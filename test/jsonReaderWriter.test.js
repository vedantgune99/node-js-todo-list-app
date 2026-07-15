import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import fs from "node:fs";

process.env.NODE_ENV = "test";
const { dataFilePath } = await import("../config/config.js");
const { readJson } = await import("../utils/jsonReaderWriter.js");

const testData = { todoList: [{ 'id': 1, 'title': 'test todo', 'completed': false }] }

// To test the function given above
test('readJson should read and parse JSON data from the file', async (t) => {
    await t.test('should return an object with a todoList array', async () => {
        fs.writeFileSync(dataFilePath, JSON.stringify(testData), 'utf8');
        const result = await readJson(dataFilePath);
        assert.ok(result && typeof result === 'object');
        assert.deepStrictEqual(result, testData);
        assert.ok(Array.isArray(result.todoList));
    });

    await t.test('should handle empty or malformed JSON gracefully', async () => {
        fs.writeFileSync(dataFilePath, 'malformed JSON content', 'utf8');
        const malformedFilePath = path.join(process.cwd(), "test", "malformed.json");
        const result = await readJson(malformedFilePath);
        assert.deepStrictEqual(result, { todoList: [] });
    });

    await t.test('should handle non-existent file gracefully', async () => {
        const nonExistentFilePath = path.join(process.cwd(), "test", "nonexistent.json");
        const result = await readJson(nonExistentFilePath);
        assert.deepStrictEqual(result, { todoList: [] });
    });
});

