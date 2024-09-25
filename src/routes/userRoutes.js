import { postDataHandler } from './../utils/postDataHandler.js';
import { createUser } from "./../services/user/user.service.js";

export const userRoutes = async (req, res) => {
    switch (req.url) {
        case "/user":
            if (req.method === "POST") {
                let body = await postDataHandler(req);
                const user = JSON.parse(body, (key, value) => {
                    return value;
                });
                await createUser(user);
                const tasks = await getTasks();
                res.end(JSON.stringify(tasks));
            }
            break;
        default:
            break;
    }
};
