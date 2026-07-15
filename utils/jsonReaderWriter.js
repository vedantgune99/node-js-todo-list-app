import data from '../data.json' with { type: 'json'};

const readJson = async () => {
    const todoList = JSON.parse(JSON.stringify(data));
    console.log("Read and deserialized JSON data");
    return todoList;
}

const writeJson = async (todoList) => {
    const serializedData = JSON.stringify(todoList, null, 2);
    console.log("Serialized and wrote JSON data");
    return serializedData;
}

export { readJson, writeJson };