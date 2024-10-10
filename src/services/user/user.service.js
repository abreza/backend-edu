import * as uuid from "uuid";
import * as bcrypt from "bcrypt";
import { generateToken } from "./../../utils/generateToken.js";
import nodemailer from "nodemailer";
import { getUsers } from "./general.services.js";

// Helper function to validate reset code
const validateResetCode = (user, resetCode) => {
  const currentTime = new Date().getTime();
  const expirationTime = new Date(user.resetCodeExpirationTime).getTime();

  if (user.resetCode !== resetCode || currentTime > expirationTime) {
    throw new Error("Invalid or expired reset code");
  }
};

const hashPasswordHandler = async (nonHashedPassword) => {
  const hashedPassword = await bcrypt.hash(nonHashedPassword, 10);
  return hashedPassword;
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
  if (existingUserIndex !== false) throw new Error("User already exist");
  const hashedPassword = await hashPasswordHandler(user.password);
  const newUser = { ...user, id: uuid.v4(), password: hashedPassword };
  userList.push(newUser);
  await fsPromises.writeFile(userFilePath, JSON.stringify(userList, null, 2));
};

export const getUserByUsername = async (username) => {
  const userList = await getUsers();
  const user = userList.find((user) => user.username === username);
  if (!user) throw new Error("User not found");
  return user;
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

export const getUserById = async (userId) => {
  const users = await getUsers();
  const user = users.find((item) => item.id === userId);
  if (!user) throw new Error("User does not exist");
  return user;
};

export const sendCodeByEmail = async (username) => {
  const { email } = await getUserByUsername(username);

  if (!email) throw new Error("User email does not exist");

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "sajad.mahdian@gmail.com",
      pass: "gsze huhr rcgv chyj",
    },
  });

  const resetCode = Math.floor(10000 + Math.random() * 90000).toString();

  await transporter.sendMail({
    to: email, // list of receivers
    subject: "Reset Password", // Subject line
    text: `Your code is: ${resetCode}`, // plain text body
    // html: "<b>Hello world?</b>", // html body
  });

  const userList = await getUsers();
  const newList = userList.map((user) => {
    if (user.username === username) {
      const currentTime = new Date();

      const expirationTime = new Date(
        currentTime.getTime() + 10 + 60000
      ).toString();

      return {
        ...user,
        resetCode,
        resetCodeExpirationTime: expirationTime,
      };
    } else {
      return user;
    }
  });

  await fsPromises.writeFile(userFilePath, JSON.stringify(newList, null, 2));
};

export const resetPassword = async (me, newPassword) => {
  const isDuplicate = await bcrypt.compare(newPassword, me.password);
  if (isDuplicate) {
    throw new Error("You can not use your old password as new password");
  }

  console.log({ isDuplicate });

  const userList = await getUsers();

  const hashedPassword = await hashPasswordHandler(newPassword);

  userList.map((user) => {
    if (user.id === me.id) {
      // TODO: how to expire the current token
      return {
        ...user,
        password: hashedPassword,
      };
    } else {
      return user;
    }
  });
  await fsPromises.writeFile(userFilePath, JSON.stringify(userList, null, 2));
};

export const forgetPassword = async (username, resetCode, newPassword) => {
  const userList = await getUsers();
  const user = await getUserByUsername(username);

  if (!user) throw new Error("User does not exist");

  validateResetCode(user, resetCode);

  const isDuplicate = await bcrypt.compare(newPassword, user.password);

  if (isDuplicate) {
    throw new Error("You can not use your old password as new password");
  }

  const hashedPassword = await hashPasswordHandler(newPassword);

  const updatedUserList = userList.map((item) => {
    if (item.id === user.id) {
      // TODO: handle current token expiration logic
      return {
        ...item,
        password: hashedPassword,
        resetCode: undefined, // Clear reset code
        resetCodeExpirationTime: undefined, // Clear reset code expiration
      };
    }
    return item;
  });

  await fsPromises.writeFile(
    userFilePath,
    JSON.stringify(updatedUserList, null, 2)
  );
};
