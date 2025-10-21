const net = require("net");
const { commandManager } = require("./commandManager");

console.log("Server is running...");

const server = net.createServer((connection) => {
  commandManager(connection);
});

server.listen(6379, "127.0.0.1");
