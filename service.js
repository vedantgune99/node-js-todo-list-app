import { readJson, writeJson } from "./utils/jsonReaderWriter.js";
import getRequestFormData from "./utils/reqParser.js";

const getAllTodos = async (req) => {
    try {
        const todoList = await readJson();
        return todoList;
    } catch (err) {
        console.log("Error occurred while reading JSON data: ", err.message);
        return [];
    };
}


const addTodo = async (req) => {
    try {
        const todos = await readJson();

        const formData = await getRequestFormData(req);

        const newTodo = {
            id: todos.todoList.length + 1,
            title: formData.title,
            completed: false
        };
        todos.todoList.push(newTodo);
        await writeJson(todos);
        console.log("New todo added successfully:", newTodo);
    } catch (err) {
        console.log("Error occurred while adding a new todo: ", err.message);
    }
}


export { getAllTodos, addTodo };