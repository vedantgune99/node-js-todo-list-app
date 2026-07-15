import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

export const hostname = "127.0.0.1";
export const port = 0;
export const templatesDir = path.join(projectRoot, "templates");
export const dataFilePath = path.join(projectRoot, "data", "test.json");

export const contentTypes = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript"
};