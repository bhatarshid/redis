export function rpushData(data, key, value) {
  if (data.has(key) && Array.isArray(data.get(key))) {
    const prevValues = data.get(key);
    prevValues.push(...value);
    data.set(key, prevValues);
  }
  else {
    data.set(key, [...value])
  }
  return data.get(key);
}

export function lrangeData(data, key, start, stop) {
  if (!data.has(key)) {
    return null
  }
  const values = data.get(key)
  return values.slice(+start, +stop+1)
}

export function lpopData(data, key) {
  if (!data.has(key) || !Array.isArray(data.get(key))) return null;
  return data.get(key).shift();
}