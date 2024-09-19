import {
  getTasks,
  addTask,
  deleteTask,
  updateTask,
  assignTask,
  unassignTask
} from "./tasks.js";
import { postDataHandler } from "./postDataHandler.js";

export const routeTasksApis = async (req, res) => {
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
  } else if (req.url === "/update") {
    if (req.method === "POST") {
      let body = await postDataHandler(req);
      const { id, updatedTask } = JSON.parse(body);
      await updateTask(id, updatedTask);
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ status: "ok" }));
    }
  } else if (req.url === "/delete") {
    if (req.method === "DELETE") {
      let body = await postDataHandler(req);
      const { id } = JSON.parse(body);
      await deleteTask(id);
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(newTasks));
    }
  } else if (req.url === "/assignTask") {
    if (req.method === "POST") {
      let body = await postDataHandler(req);
      const { taskId, username } = JSON.parse(body);
      await assignTask(taskId, username);
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ status: "ok" }));
    }
  } else if (req.url === "/unassignTask") {
    if (req.method === "POST") {
      let body = await postDataHandler(req);
      const { taskId } = JSON.parse(body);
      await unassignTask(taskId);
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ status: "ok" }));
    }
  }
};
