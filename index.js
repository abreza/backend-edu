import * as http from "http";
import { userRoutes } from './src/routes/userRoutes.js'
import { taskRoutes } from './src/routes/taskRoutes.js'

const port = 3000;

const server = http.createServer(async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");
    if (req.url.startsWith("/tasks")) {
      req.url = req.url.replace("/users", "");
      await taskRoutes(req, res);
    } else if (req.url.startsWith("/users")) {
      req.url = req.url.replace("/users", "");
      await userRoutes(req, res);
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
