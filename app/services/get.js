export function getData(data, expiry, key) {
  console.log({data, expiry})
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