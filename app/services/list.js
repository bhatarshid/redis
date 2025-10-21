const store = require("../store");

function rpushData(key, value) {
  if (store.has(key) && Array.isArray(store.get(key).value)) {
    const prevValues = store.get(key).value;
    prevValues.push(...value);
    store.set(key, { value: prevValues });
  }
  else {
    store.set(key, { value, type: 'list' });
  }
  return store.get(key).value;
}

function lrangeData(key, start, stop) {
  if (!store.has(key)) {
    return null
  }
  const values = store.get(key).value;
  return values.slice(+start, +stop+1)
}

function lpopData(key, range) {
  if (!store.has(key) || !Array.isArray(store.get(key).value)) return null;
  return store.get(key).value.splice(0, range);
}

module.exports = { rpushData, lrangeData, lpopData };