export function setData(data, expiry, key, value, type = null, ttl = null) {
  if (type) {
    const upperType = type.toUpperCase();

    if (upperType === "EX") {
      const expiryTime = Date.now() + ttl * 1000; 
      expiry.set(key, expiryTime);
    } else if (upperType === "PX") {
      const expiryTime = Date.now() + Number(ttl);
      expiry.set(key, expiryTime);
    } else {
      return "-ERR syntax error";
    }
  }

  // always set the value
  data.set(key, value);

  return "OK";
}
