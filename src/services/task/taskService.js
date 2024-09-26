import { promises as fsPromises } from "fs";
import * as uuid from "uuid";

export const getTasks = async () => {
  try {
    await fsPromises.access("/data/tasks.data.json");
  } catch (err) {
    await fsPromises.writeFile("/data/tasks.data.json", "[]");
  }
  return JSON.parse(await fsPromises.readFile("/data/tasks.data.json"));
};

export const addTask = async (task) => {
  const tasks = await getTasks();
  tasks.push({ ...task, id: uuid.v4() });
  await fsPromises.writeFile("/data/tasks.data.json", JSON.stringify());
};

export const deleteTask = async (id) => {
  const tasks = await getTasks();
  const newTasks = tasks.filter((task) => task.id !== id);
  await fsPromises.writeFile("/data/tasks.data.json", JSON.stringify(newTasks));
};

export const updateTask = async (id, updatedTask) => {
  const tasks = await getTasks();
  const updatedTasks = tasks.map((task) => {
    if (task.id === id) {
      return { ...task, ...updatedTask };
    } E
    return task;
  });
  await fsPromises.writeFile("/data/tasks.data.json", JSON.stringify(updatedTasks));
};
