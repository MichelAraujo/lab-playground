const http = require('node:http');
const fs = require('node:fs');

const handShakePrepare = require('./handShakePrepare');

const hostname = '127.0.0.1';
const port = 3000;
const SEVEN_BITS_MARKER = 125;
const SIXTEEN_BITS_MARKER = 126;
const SIXTY_FOUR_MARKER = 127;

// TODO: add a try/catch to manager errors
const htmlFile = fs.readFileSync('./index.html', 'utf8');

const server = http.createServer((req, res) => {
  res.writeHeader(200, {"Content-Type": "text/html"});
  res.write(htmlFile);
  res.end();
});

server.on('upgrade', (req, socket, head) => {
  const { 'sec-websocket-key': socketClientKey } = req.headers;

  const headersResponse = handShakePrepare(socketClientKey);
  socket.write(headersResponse);
  console.log('Client connected => ', socketClientKey);
  socket.on('readable', () => onSocketReadable(socket));

  const messageResponse = sendMessage('Hello from server!', socket);
  socket.write(messageResponse);
});

function onSocketReadable(socket) {
  // We use this table to know where are the Bitys to use => https://docs.google.com/spreadsheets/d/125ZN408N6vkzXnoh6xT75OAT2Fkn_zVjoPql4JyWGzw/edit?usp=sharing
  // Discard the first bity of the payload
  const firstByte = socket.read(1);

  console.log('aaaaaa', firstByte[0].toString(2).slice(4));
  if (firstByte[0].toString(2).slice(4) == 1000) {
    console.log('close connection');

  }


  // Read the second Byte of the payload
  const [ SecondBytePayload ] = socket.read(1); 
  // Remove the first bit of the second Byte that refer to MASK Indicator
  // In request the client to server always have maks so we don't need to check
  const lengthIndicator = parseInt(SecondBytePayload.toString(2).slice(1), 2);

  // Get the lenght of the message base of the lenght indicator in payload
  let messageLength = 0;
  if (lengthIndicator <= SEVEN_BITS_MARKER) {
    messageLength = lengthIndicator;
  } else if (lengthIndicator === SIXTEEN_BITS_MARKER) {
    messageLength = socket.read(2).readUint16BE(0);
  } else if (lengthIndicator === SIXTY_FOUR_MARKER) {
    // Message in 64 bits is too large
    throw new Error('Large payloads not currently implemented'); 
  }

  // Read the 4 next Bytes of the payload that contain the maskKey
  const maskKey = socket.read(4);
  
  // Read the rest of the payload content
  const messageEncodedBuffer = socket.read(messageLength);
  console.log('buffer', messageLength);
  const content = unmask(messageEncodedBuffer, maskKey).toString('utf8');

  console.log('message =>', content);
}

function unmask(messageEncodedBuffer, maskKey) {
  // Create the byte Array of decoded payload
  const messageDecodeUint8 = Uint8Array.from(messageEncodedBuffer, (element, i) => element ^ maskKey[i % 4]);
  return Buffer.from(messageDecodeUint8.buffer);
}

function sendMessage(message, socket) {
  const messageBuffer = Buffer.from(message);
  const messageSize = messageBuffer.length;

  // In this function we recreated the dataframe base in WebSocket protocol to send to the client
  let dataFrameBuffer;

  const firstByte = 0x80 | 0x01; // End of the message or utf8 opcode as defined in protocol
  if (messageSize <= SEVEN_BITS_MARKER) {
    const bytes = [firstByte];
    dataFrameBuffer = Buffer.from(bytes.concat(messageSize));
  } else {
    // Only handle 8bits menssage for the example
    throw new Error('Message too long!');
  }

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
