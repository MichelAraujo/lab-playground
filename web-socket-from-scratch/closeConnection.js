const closeConnection = () => {
  // The first byte with opcode related to the end of the connection
  const firstByte = 0x08; // Hexa (1000 in binary)

  // Build dataFrame buffer with opcode of the end connection (like protocol RFC required)
  const dataFrameBuffer = Buffer.from([firstByte]);
  return dataFrameBuffer;
}

module.exports = closeConnection;
