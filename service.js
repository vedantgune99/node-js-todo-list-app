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
        if (formData.title.trim() === "") {
            console.log("Todo title cannot be empty.");
            return;
        }

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


const deleteTodoById = async (id) => {
    try {
        const todos = await readJson();
        const index = todos.todoList.findIndex(todo => todo.id === parseInt(id));
        if (index !== -1) {
            const deletedTodo = todos.todoList.splice(index, 1);
            await writeJson(todos);
            console.log("Todo deleted successfully:", deletedTodo);
        } else {
            console.log(`Todo with id ${id} not found.`);
        }
    } catch (err) {
        console.log("Error occurred while deleting a todo: ", err.message);
    }
}


const updateTodo = async (req) => {
    try {
        const todos = await readJson();
        const formData = await getRequestFormData(req);
        const id = parseInt(formData.id);
        const index = todos.todoList.findIndex(todo => todo.id === id);
        if (index !== -1) {
            todos.todoList[index].title = formData.title;
            todos.todoList[index].completed = formData.completed === 'true';
            await writeJson(todos);
            console.log("Todo updated successfully:", todos.todoList[index]);
        } else {
            console.log(`Todo with id ${id} not found.`);
        }
    } catch (err) {
        console.log("Error occurred while updating a todo: ", err.message);
    }
}

export { getAllTodos, addTodo, deleteTodoById, updateTodo };
