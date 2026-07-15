import fs from "node:fs/promises";
import path from "node:path";
import { contentTypes, templatesDir } from "../config/config.js";

const createResponse = (res, statusCode, data, filePath) => {
    const extension = path.extname(filePath);
    const resType = contentTypes[extension] ?? "application/octet-stream";
    res.statusCode = statusCode;
    res.setHeader("Content-Type", resType);
    res.end(data);
};

const isHtmlTemplate = (fileName) => path.extname(fileName).toLowerCase() === ".html";

const isRenderableTodo = (todo) => {
    return Boolean(
        todo &&
        typeof todo === "object" &&
        !Array.isArray(todo) &&
        typeof todo.id !== "undefined" &&
        typeof todo.title === "string" &&
        typeof todo.completed === "boolean"
    );
};

const renderTodos = (todos = {}) => {
    if (!todos || typeof todos !== "object" || Array.isArray(todos)) {
        return `<tr><td colspan="4" class="text-center">No todos found.</td></tr>`;
    }

    const todoList = Array.isArray(todos?.todoList) ? todos.todoList : [];
    const validTodos = todoList.filter(isRenderableTodo);

    if (validTodos.length === 0) {
        return `<tr><td colspan="4" class="text-center">No todos found.</td></tr>`;
    }

    return validTodos.map((todo, index) => `
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

const serveStaticFile = async (req, res, fileName, todos = {}) => {
    if (!fileName) {
        createResponse(res, 400, "Missing template name", "unknown");
        return;
    }

    const filePath = path.join(templatesDir, fileName);

    if (!isHtmlTemplate(fileName)) {
        try {
            const data = await fs.readFile(filePath, { encoding: "utf-8" });
            createResponse(res, 200, data, filePath);
        } catch (err) {
            createResponse(res, 400, err.message || "Invalid template", filePath);
        }
        return;
    }

    try {
        let data = await fs.readFile(filePath, { encoding: "utf-8" });

        if (isHtmlTemplate(fileName)) {
            if (typeof data !== "string" || data.trim() === "") {
                throw new Error("Invalid HTML template");
            }

            const looksLikeHtml = /<([a-z][^\s>/]*|\/\s*[a-z][^\s>/]*)/i.test(data);
            if (!looksLikeHtml) {
                throw new Error("Invalid HTML template");
            }

            if (data.includes("{{todos}}")) {
                data = data.replace("{{todos}}", renderTodos(todos));
            }
        }

        createResponse(res, 200, data, filePath);
    } catch (err) {
        console.log("Error occured while rendering the template : ", err.message);
        const statusCode = err.code === "ENOENT" ? 404 : 500;
        createResponse(res, statusCode, err.message || "Invalid template", filePath);
    }
};

export { createResponse, renderTodos, serveStaticFile };
export default serveStaticFile;