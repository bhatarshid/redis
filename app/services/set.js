const store = require("../store");

function setData(key, value, type = null, ttl = null) {
  let expiryTime = null

  if (type) {
    const upperType = type.toUpperCase();

    if (upperType === "EX") {
      expiryTime = Date.now() + ttl * 1000; 
    } else if (upperType === "PX") {
      expiryTime = Date.now() + Number(ttl);
    } else {
      return "-ERR syntax error";
    }
  }

  store.set(key, { value, ttl: expiryTime, type: 'string' });

  return "OK";
}

module.exports = { setData };