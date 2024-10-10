import { postDataHandler } from "../utils/postDataHandler.js";
import {
  createUser,
  loginUser,
  getUserById,
  sendCodeByEmail,
  resetPassword,
  forgetPassword,
} from "../services/user/user.service.js";
import { getUserByToken } from "../utils/generateToken.js";

export const userRoutes = async (req, res) => {
  switch (req.url) {
    case "/register":
      if (req.method === "POST") {
        let body = await postDataHandler(req);
        await createUser(JSON.parse(body));
        res.end("User created");
      }
      break;
    case "/login":
      if (req.method === "POST") {
        let body = await postDataHandler(req);
        const user = JSON.parse(body, (key, value) => {
          return value;
        });
        const token = await loginUser(user);
        res.end(JSON.stringify(token));
      }
      break;
    case "/sendResetCode":
      if (req.method === "POST") {
        try {
          let body = await postDataHandler(req);
          await sendCodeByEmail(JSON.parse(body).username);
          res.end("email sent");
        } catch (err) {
          res.end(JSON.stringify(err));
        }
      }
      break;
    case "/resetPassword":
      if (req.method === "POST") {
        try {
          const token = req.headers.authorization.replace("Bearer ", ""); // .split(" ")[1];
          const me = await getUserByToken(token);

          if (!token) {
            res.statusCode = 403; // Bad Request
            return res.end(JSON.stringify({ error: "Access denied" }));
          }
          if (!me) {
            res.statusCode = 400; // Bad Request
            return res.end(JSON.stringify({ error: "User does not exist" }));
          }
          let body = await postDataHandler(req);
          const { newPassword } = JSON.parse(body);
          if (!newPassword) {
            res.statusCode = 400; // Bad Request
            return res.end("New password does not exist");
          }
          await resetPassword(me, newPassword);
          res.statusCode = 200;
          res.end(JSON.stringify({ message: "Password reset successfully" }));
        } catch (err) {
          // Error handling: send error details back
          res.statusCode = 500; // Internal Server Error
          console.error("Error during rest password process:", err); // Log error server-side

          // Send a user-friendly message to the client
          res.end(
            JSON.stringify({
              error: err.message || "An unknown error occurred",
            })
          );
        }
      }
      break;
    case "/forgetPassword":
      if (req.method === "POST") {
        try {
          const body = await postDataHandler(req);
          const { newPassword, resetCode, username } = JSON.parse(body);

          // Validation: Check if required fields are present
          if (!newPassword) {
            res.statusCode = 400; // Bad Request
            return res.end(
              JSON.stringify({ error: "New password does not exist" })
            );
          }
          if (!resetCode) {
            res.statusCode = 400; // Bad Request
            return res.end(
              JSON.stringify({ error: "Reset code does not exist" })
            );
          }
          if (!username) {
            res.statusCode = 400; // Bad Request
            return res.end(
              JSON.stringify({ error: "Username must be provided" })
            );
          }

          // Attempt to reset password
          await forgetPassword(username, resetCode, newPassword);

          // Success response
          res.statusCode = 200;
          res.end(JSON.stringify({ message: "Password reset successfully" }));
        } catch (err) {
          // Error handling: send error details back
          res.statusCode = 500; // Internal Server Error
          console.error("Error during forget password process:", err); // Log error server-side

          // Send a user-friendly message to the client
          res.end(
            JSON.stringify({
              error: err.message || "An unknown error occurred",
            })
          );
        }
      }
      break;
    default:
      if (req.method === "GET") {
        const token = req.headers.authorization.replace("Bearer ", ""); // .split(" ")[1];
        const me = getUserByToken(token);
        const userId = req.url.replace("/", "");
        const user = getUserById(userId);
        res.end(JSON.stringify(user));
      }
      break;
  }
};
