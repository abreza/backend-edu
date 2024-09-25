import { promises as fsPromises } from "fs";
import * as uuid from "uuid";
import bcrypt from ".";

const saltRounds = 10;

export const getUsers = async () => {
    try {
        await fsPromises.access('/data/users.data.json');
    } catch (error) {
        await fsPromises.writeFile('/data/users.data.json', "[]");
    }
    return JSON.parse(await fsPromises.readFile('/data/users.data.json'));
}

export const createUser = async (user) => {
    const userList = await getUsers();
    const userAlreadyExist = userList.findIndex(({ username }) => user.username === username)
    if (userAlreadyExist) {
        throw new Error('user already exist')
    } else {
        user.password = bcrypt.hash(user.password, saltRounds, (err, hash) => hash);
        userList.push({ ...user, id: uuid.v4() })
        await fsPromises.writeFile('/data/users.data.json', JSON.stringify(userList))
    }
}

export const updateUser = () => { }
export const deleteUser = () => { }
export const getUser = () => { }