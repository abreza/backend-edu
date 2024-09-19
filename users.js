import { promises as fsPromises } from "fs";

export const getUsers = async () => {
  try {
    await fsPromises.access("./data/users.json");
  } catch (err) {
    await fsPromises.writeFile("./data/users.json", "[]");
  }
  return JSON.parse(await fsPromises.readFile("./data/users.json"));
};

export const register = async (username, password) => {
  const users = await getUsers();

  if (users.find((user) => user.username === username)) {
    throw new Error("Duplicate username!");
  }

  users.push({ username, password });
  await fsPromises.writeFile("./data/users.json", JSON.stringify(users));
};
