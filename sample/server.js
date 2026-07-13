import { createServer } from "node:http";
import serveFile from "./utils.js";

const hostname = "0.0.0.0";
const port = 3000;




const server = createServer(async (request, response ) => {
    // console.log(request.method);
    response.statusCode = 200;
    response.setHeader("Content-Type", "text/html");
    const html = await serveFile('index.html');
    response.end(html);
});

server.listen(port, hostname, () => {
    console.log(`server listening at http://${hostname}:${port}`);
})

