const store = require("../store");

function getData(key) {
  const data = store.get(key);
  const expiry = data?.ttl;
  if (expiry) {
    if (new Date(expiry) >= new Date()) {
      return data.value;
    }
    else {
      store.delete(key);
      return null;
    }
  }
  else if (data) {
    return data.value;
  }
  else {
    return null;
  }
}


module.exports = { getData };