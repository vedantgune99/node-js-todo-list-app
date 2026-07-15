import { createServer } from "node:http";
import router  from "./router.js";
import { hostname, port } from "./config.js";

const server = createServer((req, res) => {
    router(req, res);
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});