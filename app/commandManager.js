const { setData } = require("./services/set");
const { getData } = require("./services/get");
const { rpushData, lrangeData, lpopData } = require("./services/rpush");

const commandManager = (connection, dataList, expiry) => {
  connection.on("data", (data) => {
    const input = data.toString();
    const parts = input.split("\r\n");
    const command = parts[2]?.toUpperCase();

    switch (command) {
      case "PING":
        connection.write("+PONG\r\n");
        break;
      case "ECHO": {
        const message = parts[4];
        connection.write(`$${message.length}\r\n${message}\r\n`);
        break;
      }
      case "SET": {
        const key = parts[4];
        const value = parts[6];
        const type = parts[8];
        const ttl = parts[10];

        const status = setData(dataList, expiry, key, value, type, ttl);
        if (status === 0) {
          connection.write(`-1\r\n`);
        } else {
          connection.write(`$2\r\nOK\r\n`);
        }
        break;
      }
      case "GET": {
        const key = parts[4];
        const value = getData(dataList, expiry, key);
        if (value) {
          connection.write(`$${value.length}\r\n${value}\r\n`);
        } else {
          connection.write(`-1\r\n`);
        }
        break;
      }
      case "RPUSH": {
        const key = parts[4];
        const valueList = []
        for (let i = 6; i<parts.length; i+=2) {
          valueList.push(parts[i]);
        }
        const returnValue = rpushData(dataList, key, valueList);
        connection.write(`:${returnValue.length}\r\n`);
        break;
      }
      case "LRANGE": {
        const key = parts[4];
        const start = parts[6];
        const stop = parts[8];
        if (!stop) {
          connection.write("-ERR wrong number of arguments for command")
          break;
        }
        const value = lrangeData(dataList, key, start, stop);

        let response = `*${value.length}\r\n`
        value.forEach((v) => response += `$${v.length}\r\n${v}\r\n`)
        connection.write(`${response}`);
        break;
      }
      case "LPOP": {
        const key = parts[4];
        let range = parts[6];
        if (!range) {
          range = 1;
        }
        if (isNaN(range) || range < 1) {
          connection.write("-ERR value is not an integer or out of range\r\n");
          break;
        }
        const value = lpopData(dataList, key, range);
        if (!value) {
          connection.write(`$-1\r\n`);
          break;
        }
        let response = `*${value.length}\r\n`
        value.forEach((v) => response += `$${v.length}\r\n${v}\r\n`)
        connection.write(`${response}`);
        break;
      }
      case "TYPE": {
        const key = parts[4];
        if (!dataList.has(key)) {
          connection.write(`+none\r\n`)
        }
        const value = dataList.get(key);
        if (Array.isArray(value)) {
          connection.write(`+list\r\n`)
        } else {
          connection.write(`+string\r\n`)
        }
        break;
      }
      default:
        connection.write("-ERR unknown command\r\n");
        break;
    }
  });

  connection.on("end", () => {
    console.log("Client disconnected");
  });
}

module.exports = { commandManager };