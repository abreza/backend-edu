import { promises as fsPromises } from "fs";
import * as uuid from "uuid";

export const getTasks = async () => {
  try {
    await fsPromises.access("./tasks.json");
  } catch (err) {
    await fsPromises.writeFile("./tasks.json", "[]");
  }
  return JSON.parse(await fsPromises.readFile("./tasks.json"));
};

export const addTask = async (task) => {
  const tasks = await getTasks();
  tasks.push({ ...task, id: uuid.v4() });
  await fsPromises.writeFile("./tasks.json", JSON.stringify(tasks));
};

export const deleteTask = async (id) => {
  const tasks = await getTasks();
  const newTasks = tasks.filter((task) => task.id !== id);
  await fsPromises.writeFile("./tasks.json", JSON.stringify(newTasks));
};

export const updateTask = async (id, updatedTask) => {
  const tasks = await getTasks();
  const updatedTasks = tasks.map((task) => {
    if (task.id === id) {
      return { ...task, ...updatedTask };
    }
    return task;
  });
  await fsPromises.writeFile("./tasks.json", JSON.stringify(updatedTasks));
};
