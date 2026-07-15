import fs from "node:fs/promises";
import { contentTypes, templatesDir } from "../config.js";
import path from "path";

const createResponse = (res, statusCode, data, filePath) => {
    const extension = path.extname(filePath);
    const resType = contentTypes[extension];
    res.statusCode = statusCode;
    res.setHeader("Content-Type", resType);
    res.end(data);
}

const renderTodos = (todos = {}) => {

    return todos.todoList.map((todo, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${todo.title}</td>
            <td>
                <span class="status-badge">
                    ${todo.completed ? "Done" : "Pending"}
                </span>
            </td>

            <td class="text-center">
                <button
                    class="btn btn-outline-dark btn-sm"
                    data-id="${todo.id}"
                    data-title="${todo.title}"
                    data-completed="${todo.completed}"
                    data-bs-toggle="modal"
                    data-bs-target="#updateModal">
                    Update
                </button>

                <a href="/delete/${todo.id}" class="btn btn-dark btn-sm">Delete</a>
            </td>
        </tr>
    `).join("");
};


const serveStaticFile = async (req, res, fileName, todos = []) => {
    let filePath = path.join(templatesDir, fileName);
    try {
        let data = await fs.readFile(filePath, { encoding: "utf-8" });
        if (data.includes("{{todos}}")) {
            data = data.replace("{{todos}}", renderTodos(todos));
        }
        createResponse(res, 200, data, filePath);
    } catch (err) {
        console.log("Error occured while rendering the template : ", err.message);
        createResponse(res, 400, err.message, filePath);
    }
};

export default serveStaticFile;