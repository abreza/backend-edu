import { promises as fsPromises } from "fs";
import * as path from "path";
import * as uuid from "uuid";
import * as bcrypt from "bcrypt";
import { generateToken } from './../../utils/generateToken.js'

const saltRounds = 10;
const dataDirectory = path.join(process.cwd(), "data");
const userFilePath = path.join(dataDirectory, "users.data.json");

// Helper function to ensure the data directory and file exist
const ensureFileExists = async () => {
    try {
        await fsPromises.access(dataDirectory);
    } catch {
        await fsPromises.mkdir(dataDirectory, { recursive: true });
    }

    try {
        await fsPromises.access(userFilePath);
    } catch {
        await fsPromises.writeFile(userFilePath, "[]");
    }
};

// Retrieve users from the data file
export const getUsers = async () => {
    await ensureFileExists();
    const usersData = await fsPromises.readFile(userFilePath, "utf8");
    return JSON.parse(usersData);
};

// Check if a user exists based on the username
export const doesUserExist = (userList, username) => {
    const userIndex = userList.findIndex((user) => user.username === username);
    return userIndex !== -1 ? userIndex : false;
};

// Create a new user
export const createUser = async (user) => {
    const userList = await getUsers();
    const existingUserIndex = doesUserExist(userList, user.username);
    if (existingUserIndex !== false) {
        throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(user.password.trim(), saltRounds);
    const newUser = { ...user, id: uuid.v4(), password: hashedPassword };
    userList.push(newUser);

    await fsPromises.writeFile(userFilePath, JSON.stringify(userList, null, 2));
};

export const loginUser = async (user) => {
    const userList = await getUsers();
    const existingUserIndex = doesUserExist(userList, user.username);
    if (existingUserIndex === false) throw new Error("User does not exist");
    const existingUser = userList[ existingUserIndex ];
    const isPasswordValid = await bcrypt.compare(user.password, existingUser.password);
    if (!isPasswordValid) throw new Error("Password is incorrect");
    const token = generateToken({ id: existingUser.id, username: existingUser.username });
    const updatedUserList = userList.map((item) =>
        item.username === user.username ? { ...existingUser, token } : item
    );
    await fsPromises.writeFile(userFilePath, JSON.stringify(updatedUserList, null, 2));
    return token;
};

export const getUserById = async (userId) => {

}