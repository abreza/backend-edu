import * as http from "http";
import { userRoutes } from './src/routes/userRoutes.js'
import { taskRoutes } from './src/routes/taskRoutes.js'

const port = 3000;

const server = http.createServer(async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");
    if (req.url.startWith('/task')) {
      req.url = req.url.replace('/task', "/");
      taskRoutes(req, res);
    } else if (req.url.startWith('/user')) {
      req.url = req.url.replace('/user', "/");
      userRoutes(req, res);
    }
  } catch (err) {
    console.log(err);
    res.statusCode = 500;
    res.end("Server error");
  }
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
