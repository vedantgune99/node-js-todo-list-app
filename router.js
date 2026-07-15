import serveStaticFile from "./utils/serveStaticFiles.js";
import { getAllTodos, addTodo } from "./service.js";

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

    else {
        response.writeHead(404, { 'Content-Type': 'text/plain' });
        response.end('Page not found.');
    }
}

export default router;