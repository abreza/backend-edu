import { postDataHandler } from './../utils/postDataHandler.js';
import { createUser, loginUser } from "./../services/user/user.service.js";

export const userRoutes = async (req, res) => {
    switch (req.url) {
        case "/register":
            if (req.method === "POST") {
                let body = await postDataHandler(req);
                await createUser(JSON.parse(body));
                res.end({ status: 200 });
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
        case "/[id]":
            if (req.method === "GET") {
                // const user = JSON.parse(body, (key, value) => {
                //     return value;
                // });
                // const token = await loginUser(user);
                res.end(JSON.stringify(token));
            }
            break;
        default:
            break;
    }
};
