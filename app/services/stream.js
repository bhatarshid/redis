const { toRespArray } = require("../../utils/util");
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
  const data = store.get(streamKey).value;
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
    const idValidation = validateId(streamKey, timestamp, sequence);
    if (idValidation !== true) {
      return {
        status: false,
        message: idValidation.message
      }
    }
  }


  if (!store.has(streamKey)) {
    store.set(streamKey, { value: new Map(), type: 'stream' });
  }
  const stream = store.get(streamKey);
  stream.value.set(`${timestamp}-${sequence}`, fieldList);

  return {
    status: true,
    message: "OK",
    id: `${timestamp}-${sequence}`
  };
}

function parseId(id, isStart) {
  if (id === '-') return [Number.MIN_SAFE_INTEGER, 0];
  if (id === '+') return [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER];

  const [tsStr, seqStr] = id.split('-');
  const ts = Number(tsStr);
  const seq = seqStr !== undefined ? Number(seqStr) : (isStart ? 0 : Number.MAX_SAFE_INTEGER);
  return [ts, seq];
}

function getStreamData(streamKey, startId, endId) {
  const stream = store.get(streamKey);
  if (!stream || !stream.value || stream.value.size === 0) {
    return toRespArray([]);
  }

  const [startTs, startSeq] = parseId(startId, true);
  const [endTs, endSeq] = parseId(endId, false);

  const entries = [];

  for (const [id, fieldList] of stream.value.entries()) {
    const [ts, seq] = id.split('-').map(Number);
    const isAfterStart = ts > startTs || (ts === startTs && seq >= startSeq);
    const isBeforeEnd = ts < endTs || (ts === endTs && seq <= endSeq);

    if (isAfterStart && isBeforeEnd) {
      entries.push([id, fieldList]);
    }
  }

  return toRespArray(entries);
}

module.exports = { 
  addToStream,
  getStreamData
}