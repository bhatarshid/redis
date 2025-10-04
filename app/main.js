const net = require("net");
const { commandManager } = require("./commandManager");

console.log("Server is running...");

const server = net.createServer((connection) => {

  const dataList = new Map();
  const expiry = new Map();

  commandManager(connection, dataList, expiry);
});

server.listen(6379, "127.0.0.1");
