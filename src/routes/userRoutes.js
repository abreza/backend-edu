import { postDataHandler } from "./../utils/postDataHandler.js";
import {
  createUser,
  loginUser,
  getUserById,
  forgetPassword,
} from "./../services/user/user.service.js";
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
    case "/forget-password":
      if (req.method === "POST") {
        let body = await postDataHandler(req);
        const user = JSON.parse(body, (key, value) => {
          return value;
        });
        await forgetPassword(user);
        res.end("Check your email.");
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
