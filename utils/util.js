function toRespArray(value) {
  const parts = [];

  const encode = (val) => {
    if (Array.isArray(val)) {
      parts.push(`*${val.length}\r\n`);
      for (const v of val) encode(v);
    } else if (val === null || val === undefined) {
      parts.push(`$-1\r\n`);
    } else if (typeof val === 'number') {
      // Redis treats numbers as bulk strings unless explicitly integers
      const str = String(val);
      parts.push(`$${Buffer.byteLength(str)}\r\n${str}\r\n`);
    } else if (typeof val === 'boolean') {
      // Redis doesn't have native bools, encode as string "true"/"false"
      const str = val ? 'true' : 'false';
      parts.push(`$${str.length}\r\n${str}\r\n`);
    } else {
      // Treat everything else as a bulk string
      const str = String(val);
      parts.push(`$${Buffer.byteLength(str)}\r\n${str}\r\n`);
    }
  };

  encode(value);
  return parts.join('');
}

module.exports = { 
  toRespArray
};