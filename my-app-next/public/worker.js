addEventListener('message', (d) => {
  const imageData = d.data;
  const width = imageData.width;
  const height = imageData.height;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (x + y * width) * 4;
      imageData.data[index] = imageData.data[index] * 1.2;
      imageData.data[index + 3] = 127;
    }
  }

  postMessage(imageData, [imageData.data.buffer]);
});
