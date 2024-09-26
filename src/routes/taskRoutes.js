import { getTasks, addTask, deleteTask } from "../services/task/taskService.js";
import { postDataHandler } from './../utils/postDataHandler.js'

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
            const tasks = await getTasks();
            res.end(JSON.stringify(tasks));
            break;
        default:
            break;
    }
};
