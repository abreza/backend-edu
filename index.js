import * as http from "http";
import { getTasks, addTask, deleteTask } from "./tasks.js";

const port = 3000;

const postDataHandler = async (req) => {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      resolve(body);
    });
  });
};

const server = http.createServer(async (req, res) => {
  try {
    if (req.url === "/add") {
      if (req.method === "POST") {
        let body = await postDataHandler(req);
        const task = JSON.parse(body, (key, value) => {
          if (key === "deadline") {
            return new Date(value);
          }
          return value;
        });
        await addTask(task);

        const tasks = await getTasks();
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(tasks));
      }
    } else if (req.url === "/delete") {
      if (req.method === "DELETE") {
        let body = await postDataHandler(req);
        const { id } = JSON.parse(body);
        await deleteTask(id);
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(newTasks));
      }
    } else {
      const tasks = await getTasks();
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(tasks));
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
