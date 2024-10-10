import { promises as fsPromises } from "fs";

const userFilePath = "data/users.data.json";

// Helper function to ensure the data directory and file exist
export const ensureFileExists = async () => {
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
