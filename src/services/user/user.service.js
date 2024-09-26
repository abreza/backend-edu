import { promises as fsPromises } from "fs";
import * as uuid from "uuid";
import * as bcrypt from "bcrypt";
import { generateToken } from "./../../utils/generateToken.js";
import nodemailer from "nodemailer";

const userFilePath = "data/users.data.json";

// Helper function to ensure the data directory and file exist
const ensureFileExists = async () => {
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

// Create a new user and hash the password
export const createUser = async (user) => {
  const userList = await getUsers();
  const existingUserIndex = doesUserExist(userList, user.username);
  if (existingUserIndex !== false) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(user.password, 10);

  const newUser = { ...user, id: uuid.v4(), password: hashedPassword };
  userList.push(newUser);

  await fsPromises.writeFile(userFilePath, JSON.stringify(userList, null, 2));
};

export const getUserByUsername = async (username) => {
  const userList = await getUsers();
  const user = userList.find((user) => user.username === username);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

export const updateUser = async (user) => {
  const userList = await getUsers();
  const userIndex = doesUserExist(userList, user.username);
  if (userIndex === false) {
    throw new Error("User not found");
  }

  userList[userIndex] = user;

  await fsPromises.writeFile(userFilePath, JSON.stringify(userList, null, 2));
};

export const loginUser = async (user) => {
  const existingUser = await getUserByUsername(user.username);

  const isPasswordValid = await bcrypt.compare(
    user.password,
    existingUser.password
  );

  if (!isPasswordValid) throw new Error("Password is incorrect");

  const token = generateToken({
    id: existingUser.id,
    username: existingUser.username,
  });

  return token;
};

export const getUserById = async (userId) => {};

export const resetPassword = async (username, password) => {
  const existingUser = await getUserByUsername(username);

  const hashedPassword = await bcrypt.hash(password, 10);

  existingUser.password = hashedPassword;

  await updateUser(existingUser);
};

export const verifyForgetPasswordCode = async (username, code) => {
  const existingUser = await getUserByUsername(username);

  if (existingUser.forgetPasswordCode !== code) {
    throw new Error("Code is incorrect");
  }

  return generateToken({
    id: existingUser.id,
    username: existingUser.username,
  });
};

export const verifyForgetPasswordCodeAndSetNewPassword = async (
  username,
  code,
  password
) => {
  const token = await verifyForgetPasswordCode(username, code);
  await resetPassword(username, password);
  return token;
};

export const forgetPassword = async (username) => {
  const existingUser = await getUserByUsername(username);

  const forgetPasswordCode = String(Math.floor(Math.random() * 10000));
  existingUser.forgetPasswordCode = forgetPasswordCode;

  await updateUser(existingUser);

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "edubackend5@gmail.com",
      pass: "Salamsalam123",
    },
  });

  const mailOptions = {
    from: "edubackend5@gmail.com",
    to: existingUser.email,
    subject: "Forget Password Code",
    text: `Your forget password code is: ${forgetPasswordCode}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email: ", error);
    } else {
      console.log("Email sent: ", info.response);
    }
  });
};
