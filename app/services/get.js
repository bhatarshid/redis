function getData(data, expiry, key) {
  if (expiry.get(key)) {
    if (new Date(expiry.get(key)) >= new Date()) {
      return data.get(key);
    }
    else {
      data.delete(key);
      expiry.delete(key);
      return null;
    }
  }
  else {
    return data.get(key);
  }
}

module.exports = { getData };