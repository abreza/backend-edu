import jwt from "jsonwebtoken";
import { getUserByUsername } from "../services/user/user.service.js";

const secretKey = process.env.JWT_SECRET_KEY || "backend-edu";

const tokenOptions = {
  expiresIn: "1h", // Token will expire in 1 hour
};

export const generateToken = (payload) => {
  if (!payload) throw new Error("Payload is required to generate a token");
  return jwt.sign(payload, secretKey, tokenOptions);
};

export const getUserByToken = async (token) => {
  // const jwdData = jwt.decode(token, { complete });
  // if (!jwdData) {
  //   throw Error("Token is not valid!");
  // }
  // const checkToken = jwt.sign(jwdData.payload, secretKey, jwdData.header);
  // if(token === checkToken) {
  //   const user = await getUserByUsername(jwdData.payload.username);
  //   return user;
  // }

  const payload = jwt.verify(token, secretKey);
  if (!payload) {
    throw Error("Token is not valid!");
  }
  const username = payload.username;
  const user = await getUserByUsername(username);
  return user;
};
