import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";

process.env.NODE_ENV = "test";
const { hostname } = await import("../config/config.js");
const router = (await import("../todo/router.js")).default;

const request = (path, method = "GET", serverPort) => {
    return new Promise((resolve, reject) => {
        const req = http.request({
            hostname,
            port: serverPort,
            path,
            method,
        }, (res) => {
            let data = "";
            res.setEncoding("utf8");
            res.on("data", (chunk) => data += chunk);
            res.on("end", () => resolve({
                statusCode: res.statusCode,
                headers: res.headers,
                body: data,
            }));
        });

        req.on("error", reject);
        req.end();
    });
};


test('Native HTTP Route Testing...', async (t) => {
    const server = http.createServer(router);
    await new Promise((resolve, reject) => {
        server.listen(0, hostname, (err) => err ? reject(err) : resolve());
    });
    const address = server.address();
    const serverPort = address && typeof address === "object" ? address.port : 0;

    try {
        await t.test('GET / should return the application HTML', async () => {
            const res = await request("/", "GET", serverPort);
            assert.strictEqual(res.statusCode, 200);
            assert.match(res.headers["content-type"], /text\/html/);
            assert.ok(res.body.includes("<") || res.body.length > 0);
        });

        await t.test('GET /styles should return CSS content', async () => {
            const res = await request("/styles", "GET", serverPort);
            assert.strictEqual(res.statusCode, 200);
            assert.match(res.headers["content-type"], /text\/css/);
            assert.ok(res.body.includes("body") || res.body.length > 0);
        });

        await t.test('GET /delete/:id should redirect to /', async () => {
            const res = await request("/delete/test-id", "GET", serverPort);
            assert.strictEqual(res.statusCode, 302);
            assert.strictEqual(res.headers.location, "/");
        });

        await t.test('GET /nonexistent should return 404', async () => {
            const res = await request("/nonexistent", "GET", serverPort);
            assert.strictEqual(res.statusCode, 404);
            assert.match(res.body, /Page not found/);
        });

        await t.test('POST /add-todo should redirect to /', async () => {
            const res = await request("/add-todo", "POST", serverPort);
            assert.strictEqual(res.statusCode, 302);
            assert.strictEqual(res.headers.location, "/");
        });

        await t.test('GET /delete/:id should handle non-existent ID gracefully', async () => {
            const res = await request("/delete/nonexistent-id", "GET", serverPort);
            assert.strictEqual(res.statusCode, 302);
            assert.strictEqual(res.headers.location, "/");
        });

        await t.test('POST /add-todo should handle missing form data gracefully', async () => {
            const res = await request("/add-todo", "POST", serverPort);
            assert.strictEqual(res.statusCode, 302);
            assert.strictEqual(res.headers.location, "/");
        });

        await t.test('POST /update-todo should redirect to /', async () => {
            const res = await request("/update-todo", "POST", serverPort);
            assert.strictEqual(res.statusCode, 302);
            assert.strictEqual(res.headers.location, "/");
        });

    } finally {
        await new Promise((resolve, reject) => {
            server.close((err) => err ? reject(err) : resolve());
        });
    }
});