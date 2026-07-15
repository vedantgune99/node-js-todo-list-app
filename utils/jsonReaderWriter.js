import fs from 'node:fs/promises';
import { dataFilePath } from '.././config/config.js';

const readJson = async () => {
    try {
        const fileContents = await fs.readFile(dataFilePath, 'utf8');
        const parsedData = JSON.parse(fileContents);
        console.log("Read and deserialized JSON data");
        return parsedData;
    } catch (err) {
        console.log("Error occurred while reading JSON data:", err.message);
        return { todoList: [] };
    }
}

const writeToJsonFile = async (serializedData) => {
    try {
        await fs.writeFile(dataFilePath, serializedData, 'utf8');
        console.log("Successfully wrote to data.json");
    } catch (err) {
        console.error("Error writing to data.json:", err);
    }
}

const writeJson = async (todoList) => {
    const serializedData = JSON.stringify(todoList, null, 2);
    console.log("Serialized and wrote JSON data");
    await writeToJsonFile(serializedData);
    return serializedData;
}

export { readJson, writeJson };