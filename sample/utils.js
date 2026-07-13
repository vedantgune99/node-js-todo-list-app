import { error } from "node:console";
import fs from "node:fs/promises";


async function serveStaticFile(fileName){
    let filePath = `./templates/${fileName}`;
    return await fs.readFile(filePath, 'utf8');
}; 

export default serveStaticFile;