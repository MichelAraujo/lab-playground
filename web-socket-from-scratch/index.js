const http = require('node:http');
const fs = require('node:fs');

const handShakePrepare = require('./handShakePrepare');

const hostname = '127.0.0.1';
const port = 3000;
const SEVEN_BITS_MARKER = 125;

// TODO: add a try/catch to manager errors
const htmlFile = fs.readFileSync('./index.html', 'utf8');

const server = http.createServer((req, res) => {
  res.writeHeader(200, {"Content-Type": "text/html"});
  res.write(htmlFile);
  res.end();
});

server.on('upgrade', (req, socket, head) => {
  const { 'sec-websocket-key': socketClientKey } = req.headers;

  const headers = handShakePrepare(socketClientKey);

  console.log('Client connected => ', socketClientKey);
  socket.write(headers);
  socket.on('readable', () => onSocketReadable(socket));
  const response = sendMessage('hello from server!', socket);
  socket.write(response);
});

function onSocketReadable(socket) {
  // We use this table to know where are the Bitys to use => https://docs.google.com/spreadsheets/d/125ZN408N6vkzXnoh6xT75OAT2Fkn_zVjoPql4JyWGzw/edit?usp=sharing
  // Discard the first bity of the payload
  socket.read(1);

  const [ SecondBytePayload ] = socket.read(1); 
  // Remove the first bit of the second Byte that refer to MASK Indicator
  const lengthIndicator = parseInt(SecondBytePayload.toString(2).slice(1), 2);

  let messageLength = 0;
  if (lengthIndicator <= SEVEN_BITS_MARKER) {
    messageLength = lengthIndicator;
  }

  const maskKey = socket.read(4);
  const messageEncodedBuffer = socket.read(messageLength);

  console.log('====', messageLength);
  console.log('====', maskKey);
  console.log('message =>', unmask(messageEncodedBuffer, maskKey).toString('utf8'));
}

function unmask(messageEncodedBuffer, maskKey) {
  // Create the byte Array of decoded payload
  const messageDecodeUint8 = Uint8Array.from(messageEncodedBuffer, (element, i) => element ^ maskKey[i % 4]);
  return Buffer.from(messageDecodeUint8.buffer);
}

function sendMessage(message, socket) {
  const messageBuffer = Buffer.from(message);
  const messageSize = messageBuffer.length;

  let dataFrameBuffer;

  const firstByte = 0x80 | 0x01; // End of the message or utf8 opcode as defined in protocol
  if (messageSize <= SEVEN_BITS_MARKER) {
    const bytes = [firstByte];
    dataFrameBuffer = Buffer.from(bytes.concat(messageSize));
  }
  // TODO: add a else and throw a error if message is too long

  const totalBufferSize = dataFrameBuffer.byteLength + messageSize;

  const target = Buffer.allocUnsafe(totalBufferSize);
  let offset = 0;

  const bufferList = [dataFrameBuffer, messageBuffer];
  for (const buffer of bufferList) {
    target.set(buffer, offset);
    offset += buffer.length;
  }

  return target;
}

server.listen(port, hostname, 'connection', () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
