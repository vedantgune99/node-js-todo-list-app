import serveStaticFile from "./serveStaticFiles.js";

const router = async (request, response) => {
    console.log(`Received ${request.method} request for ${request.url}`);

    if (request.url === '/' && request.method === 'GET') {
        await serveStaticFile(request, response, "index.html");
    }

    else if (request.url === '/styles' && request.method === 'GET'){
        await serveStaticFile(request, response, "styles.css");
    }

    else if (request.url === '/about' && request.method === 'GET') {
        response.writeHead(200, { 'Content-Type': 'text/plain' });
        response.end('This is the about page.');
    }

    else {
        response.writeHead(404, { 'Content-Type': 'text/plain' });
        response.end('Page not found.');
    }
}

export default router;