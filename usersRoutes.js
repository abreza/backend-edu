import { postDataHandler } from "./postDataHandler.js";
import { register } from "./users.js";

export const routeUsersApis = async (req, res) => {
  if (req.url === "/register") {
    if (req.method === "POST") {
      const body = await postDataHandler(req);
      const { username, password } = JSON.parse(body);
      await register(username, password);
      res.end(JSON.stringify({ status: "ok" }));
    }
  }
};
