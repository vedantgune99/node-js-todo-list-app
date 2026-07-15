import { createServer } from "node:http";
import router from "./todo/router.js";
import { hostname, port } from "./config/config.js";

const server = createServer((req, res) => {
    router(req, res);
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});