import serveStaticFile from "../utils/serveStaticFiles.js";
import { getAllTodos, addTodo, deleteTodoById, updateTodo } from "./service.js";

const router = async (request, response) => {
    console.log(`Received ${request.method} request for ${request.url}`);

    if (request.url === '/' && request.method === 'GET') {
        const todos = await getAllTodos(request);
        await serveStaticFile(request, response, "index.html", todos);
    }

    else if (request.url === '/styles' && request.method === 'GET') {
        await serveStaticFile(request, response, "styles.css");
    }

    else if (request.url === '/add-todo' && request.method === 'POST') {
        await addTodo(request);
        response.writeHead(302, { 'Location': '/' });
        response.end();
    }

    else if (request.url.startsWith('/delete/') && request.method === 'GET') {
        const id = request.url.split('/').pop();
        console.log(`Deleting todo with id: ${id}`);
        await deleteTodoById(id);
        response.writeHead(302, { 'Location': '/' });
        response.end();
    }

    else if (request.url === '/update-todo' && request.method === 'POST') {
        await updateTodo(request);
        response.writeHead(302, { 'Location': '/' });
        response.end();
    }

    else {
        response.writeHead(404, { 'Content-Type': 'text/plain' });
        response.end('Page not found.');
    }
}

export default router;