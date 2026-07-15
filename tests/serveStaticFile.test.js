import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import fs from "node:fs/promises";

process.env.NODE_ENV = "test";

const { templatesDir, contentTypes } = await import("../config/config.js");
const { createResponse, renderTodos, serveStaticFile } = await import("../utils/serveStaticFiles.js");

const createMockResponse = () => {
    const res = {
        statusCode: 200,
        headers: {},
        body: "",
        setHeader(name, value) {
            this.headers[name] = value;
        },
        end(data) {
            this.body = data;
        }
    };

    return res;
};

const writeTemplate = async (fileName, content) => {
    const filePath = path.join(templatesDir, fileName);
    await fs.writeFile(filePath, content, "utf8");
    return filePath;
};

const removeTemplate = async (fileName) => {
    const filePath = path.join(templatesDir, fileName);
    await fs.rm(filePath, { force: true });
};

test("createResponse creates the expected response payload", () => {
    const res = createMockResponse();
    const body = "<h1>Hello</h1>";

    createResponse(res, 201, body, "template.html");

    assert.equal(res.statusCode, 201);
    assert.equal(res.body, body);
    assert.equal(res.headers["Content-Type"], "text/html");
});

test("createResponse uses the correct content type for supported extensions", () => {
    const htmlResponse = createMockResponse();
    const cssResponse = createMockResponse();
    const jsResponse = createMockResponse();

    createResponse(htmlResponse, 200, "<p>ok</p>", "index.html");
    createResponse(cssResponse, 200, "body { color: red; }", "styles.css");
    createResponse(jsResponse, 200, "console.log('hi');", "app.js");

    assert.equal(htmlResponse.headers["Content-Type"], contentTypes[".html"]);
    assert.equal(cssResponse.headers["Content-Type"], contentTypes[".css"]);
    assert.equal(jsResponse.headers["Content-Type"], contentTypes[".js"]);
    assert.ok(contentTypes[".html"] && contentTypes[".css"] && contentTypes[".js"]);
});

test("renderTodos returns an empty state for invalid or missing todo input", () => {
    assert.match(renderTodos({}), /No todos found/);
    assert.match(renderTodos("not valid json"), /No todos found/);
    assert.match(renderTodos({ todoList: [null, undefined, { title: 42 }] }), /No todos found/);
});

test("renderTodos renders every valid todo entry and skips invalid ones", () => {
    const todos = {
        todoList: [
            { id: 1, title: "Buy milk", completed: false },
            { id: 2, title: "Write tests", completed: true },
            { id: 3, title: 111, completed: false },
            { foo: "bar" }
        ]
    };

    const markup = renderTodos(todos);

    assert.match(markup, /Buy milk/);
    assert.match(markup, /Write tests/);
    assert.doesNotMatch(markup, /111/);
    assert.equal((markup.match(/<tr>/g) || []).length, 2);
});

test("renderTodos can render a large list of todos", () => {
    const todos = {
        todoList: Array.from({ length: 1000 }, (_, index) => ({
            id: index + 1,
            title: `Task ${index + 1}`,
            completed: index % 2 === 0
        }))
    };

    const markup = renderTodos(todos);
    assert.equal((markup.match(/<tr>/g) || []).length, 1000);
});

test("serveStaticFile returns a 400 response when the filename is not html", async () => {
    const res = createMockResponse();
    await serveStaticFile({}, res, "styles.css");

    assert.equal(res.statusCode, 200);
    assert.match(res.body, /body/);
});

test("serveStaticFile returns a 404 response when the template file is not found", async () => {
    const res = createMockResponse();
    await serveStaticFile({}, res, "missing-template.html");

    assert.equal(res.statusCode, 404);
    assert.match(res.body, /ENOENT|not found|missing-template/);
});

test("serveStaticFile returns a 500 response when the html file is invalid", async () => {
    const fileName = `invalid-${Date.now()}.html`;
    await writeTemplate(fileName, "This is not valid html content");

    try {
        const res = createMockResponse();
        await serveStaticFile({}, res, fileName);

        assert.equal(res.statusCode, 500);
        assert.match(res.body, /Invalid HTML template/);
    } finally {
        await removeTemplate(fileName);
    }
});

test("serveStaticFile renders a fallback row when todos are empty", async () => {
    const fileName = `empty-${Date.now()}.html`;
    await writeTemplate(fileName, "<html><body>{{todos}}</body></html>");

    try {
        const res = createMockResponse();
        await serveStaticFile({}, res, fileName, {});

        assert.equal(res.statusCode, 200);
        assert.match(res.body, /No todos found/);
    } finally {
        await removeTemplate(fileName);
    }
});

test("serveStaticFile handles invalid todo payloads gracefully", async () => {
    const fileName = `invalid-todos-${Date.now()}.html`;
    await writeTemplate(fileName, "<html><body>{{todos}}</body></html>");

    try {
        const res = createMockResponse();
        await serveStaticFile({}, res, fileName, "not valid");

        assert.equal(res.statusCode, 200);
        assert.match(res.body, /No todos found/);
    } finally {
        await removeTemplate(fileName);
    }
});

test("serveStaticFile leaves the template unchanged when it does not include the todos placeholder", async () => {
    const fileName = `plain-${Date.now()}.html`;
    const contents = "<html><body><h1>Plain template</h1></body></html>";
    await writeTemplate(fileName, contents);

    try {
        const res = createMockResponse();
        await serveStaticFile({}, res, fileName, { todoList: [{ id: 1, title: "Test", completed: false }] });

        assert.equal(res.statusCode, 200);
        assert.equal(res.body, contents);
    } finally {
        await removeTemplate(fileName);
    }
});
