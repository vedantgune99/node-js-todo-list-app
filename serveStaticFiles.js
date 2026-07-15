import fs from "node:fs/promises";
import { contentTypes, templatesDir } from "./config.js";
import path from "path";

const createResponse = (res, statusCode, data, filePath) => {
    const extension = path.extname(filePath);
    const resType = contentTypes[extension];
    res.statusCode = statusCode;
    res.setHeader("Content-Type", resType);
    res.end(data);
}


const serveStaticFile = async (req, res, fileName) => {
    let filePath = path.join(templatesDir, fileName);
    try {
        const data = await fs.readFile(filePath, { encoding: "utf-8" });
        createResponse(res, 200, data, filePath);
    } catch (err) {
        console.log("Error occured while rendering the template : ", err.message);
        createResponse(res, 400, err.message, filePath);
    }
};

export default serveStaticFile;