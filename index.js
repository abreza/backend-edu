import * as http from "http";
import { routeTasksApis } from "./tasksRoutes.js";
import { routeUsersApis } from "./usersRoutes.js";

const port = 3000;

const server = http.createServer(async (req, res) => {
  try {
    if (req.url.startsWith("/tasks")) {
      req.url = req.url.replace("/users", "");
      await routeTasksApis(req, res);
    } else if (req.url.startsWith("/users")) {
      req.url = req.url.replace("/users", "");
      await routeUsersApis(req, res);
    } else {
      res.statusCode = 404;
      res.end("Not found!");
    }
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.end("Server error!");
  }
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
