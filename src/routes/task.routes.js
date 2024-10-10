import {
  getTasks,
  getMyTasks,
  addTask,
  deleteTask,
} from "../services/task/task.service.js";
import { postDataHandler } from "../utils/postDataHandler.js";
import { getUserByToken } from "../utils/generateToken.js";

export const taskRoutes = async (req, res) => {
  switch (req.url) {
    case "/add":
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
        res.end(JSON.stringify(tasks));
      }
      break;
    case "/delete":
      if (req.method === "DELETE") {
        let body = await postDataHandler(req);
        const { id } = JSON.parse(body);
        await deleteTask(id);
        res.end(JSON.stringify(newTasks));
      }
      break;
    case "/getTasks":
      let tasks = await getTasks();
      res.end(JSON.stringify(tasks));
      break;
    case "/myTasks":
      const token = req.headers.authorization.replace("Bearer ", ""); // .split(" ")[1];
      const me = await getUserByToken(token);
      const myTasks = await getMyTasks(me);
      res.end(JSON.stringify(myTasks));
      break;
    default:
      break;
  }
};
