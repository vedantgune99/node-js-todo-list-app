import { readJson, writeJson } from "./utils/jsonReaderWriter.js";

const getAllTodos = async (req) => {
    try {
        const todoList = await readJson();
        return todoList;
    } catch (err) {
        console.log("Error occurred while reading JSON data: ", err.message);
        return [];
    };
}


export { getAllTodos };