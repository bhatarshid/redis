const net = require("net");
const { setData } = require("./services/set");
const { getData } = require("./services/get");

console.log("Server is running...");

const server = net.createServer((connection) => {

  const dataList = new Map();
  const expiry = new Map();

  connection.on("data", (data) => {
    const input = data.toString();
    const parts = input.split("\r\n");
    const command = parts[2]?.toUpperCase();

    if (command === "PING") {
      connection.write("+PONG\r\n");
    } 
    else if (command === "ECHO") {
      const message = parts[4];
      connection.write(`$${message.length}\r\n${message}\r\n`);
    }
    else if (command === "SET") {
      const key = parts[4];
      const value = parts[6];
      const type = parts[8]
      const ttl = parts[10]

      const status = setData(dataList, expiry, key, value, type, ttl);
      if (status === 0) {
        connection.write(`-1\r\n`)
      }
      else {
        connection.write(`$2\r\nOK\r\n`);
      }
    }
    else if (command === "GET") {
      const key = parts[4];
      const value = getData(dataList, expiry, key);
      if (value) {
        connection.write(`$${value.length}\r\n${value}\r\n`);
      }
      else {
        connection.write(`-1\r\n`)
      }
    }
    else {
      connection.write("-ERR unknown command\r\n");
    }
  });

  connection.on("end", () => {
    console.log("Client disconnected");
  });
});

server.listen(6379, "127.0.0.1");
