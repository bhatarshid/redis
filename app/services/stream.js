const store = require("../store");

function validateId(streamKey, timestamp, sequence) {
  const data = store.get(streamKey);
  if (!data) {
    if (timestamp >=0 && sequence > 0) {
      return true;
    }
    return {
      status: false,
      message: "-ERR invalid ID\r\n"
    };
  }
  const lastId = Array.from(data.keys()).pop();
  const [lastTimestamp, lastSequence] = lastId.split('-').map(Number);

  if (timestamp > lastTimestamp) {
    return true;
  }
  else if (timestamp === lastTimestamp) {
    if (sequence > lastSequence) {
      return true;
    }
    else {
      return {
        status: false, 
        message: "-ERR ID must be greater than the last ID in the stream\r\n"
      }
    }
  }
  return {
    status: false,
    message: "-ERR ID must be greater than the last ID in the stream\r\n"
  }
}

function generateSequence(streamKey, timestamp) {
  const data = store.get(streamKey);
  if (!data || data.size === 0) {
    return timestamp === 0 ? 1 : 0;
  }
  const lastId = Array.from(data.keys()).pop();
  const [lastTimestamp, lastSequence] = lastId.split('-').map(Number);
  return timestamp === lastTimestamp ? lastSequence + 1 : 0;
}

// this does not handle the case where multiple entries are added in the same millisecond
function generateTimestampAndSequence(streamKey) {
  return [Date.now(), 0]; 
}

function addToStream(streamKey, id, fieldList) {
  let timestamp;
  let sequence;
  if (id === '*') {
    [timestamp, sequence] = generateTimestampAndSequence(streamKey);
  }
  else if (sequence == '*') {
    sequence = generateSequence(streamKey, Number(timestamp));
  }
  else {
    [timestamp, sequence] = id.split('-').map(Number);
  }

  const idValidation = validateId(streamKey, timestamp, sequence);
  if (idValidation !== true) {
    return {
      status: false,
      message: idValidation.message
    }
  }

  if (!store.has(streamKey)) {
    store.set(streamKey, new Map());
  }
  const stream = store.get(streamKey);
  stream.set(`${timestamp}-${sequence}`, fieldList);

  return {
    status: true,
    message: "OK",
    id: `${timestamp}-${sequence}`
  };
}

module.exports = { addToStream }