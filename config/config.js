const isTest = process.env.NODE_ENV === "test";

const config = isTest
    ? await import("./config.test.js")
    : await import("./config.runtime.js");

export const hostname = config.hostname;
export const port = config.port;
export const templatesDir = config.templatesDir;
export const dataFilePath = config.dataFilePath;
export const contentTypes = config.contentTypes;