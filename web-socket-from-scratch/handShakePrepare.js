const crypto = require('node:crypto');

const WEB_SOCKET_MAGIC_STRING = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';

const handShakePrepare = (socketClientKey) => {
  const shaOne = crypto.createHash('sha1');
  shaOne.update(socketClientKey + WEB_SOCKET_MAGIC_STRING);
  const handShakeAcceptHash = shaOne.digest('base64');

  const headers = [
    'HTTP/1.1 101 Switching Protocols',
    'Upgrade: websocket',
    'Connection: Upgrade',
    `Sec-WebSocket-Accept: ${handShakeAcceptHash}`,
    ''
  ].map(line => line.concat('\r\n')).join('');

  return headers;
};

module.exports = handShakePrepare;