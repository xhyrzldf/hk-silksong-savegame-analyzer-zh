const fs = require('fs');
const path = require('path');

// 读取ICO文件
const icoPath = path.join(__dirname, 'build', 'icon.ico');
const pngPath = path.join(__dirname, 'public', 'avatar.png');

// ICO文件可能包含多个尺寸的图标，我们需要提取PNG数据
const icoBuffer = fs.readFileSync(icoPath);

// ICO文件头结构：
// 0-1: Reserved (0)
// 2-3: Type (1 for ICO)
// 4-5: Count (number of images)
const count = icoBuffer.readUInt16LE(4);
console.log(`Found ${count} images in ICO file`);

// 读取第一个图像的信息
// 每个图像目录条目是16字节
const imageOffset = 6; // 头部之后
const width = icoBuffer[imageOffset];
const height = icoBuffer[imageOffset + 1];
const imageSize = icoBuffer.readUInt32LE(imageOffset + 8);
const imageDataOffset = icoBuffer.readUInt32LE(imageOffset + 12);

console.log(`Image info: ${width}x${height}, size: ${imageSize}, offset: ${imageDataOffset}`);

// 提取PNG数据
const pngData = icoBuffer.slice(imageDataOffset, imageDataOffset + imageSize);

// 检查是否是PNG格式（PNG signature: 89 50 4E 47）
if (pngData[0] === 0x89 && pngData[1] === 0x50 && pngData[2] === 0x4E && pngData[3] === 0x47) {
  console.log('Found PNG data, extracting...');
  fs.writeFileSync(pngPath, pngData);
  console.log(`Successfully extracted PNG to ${pngPath}`);
} else {
  console.log('ICO does not contain PNG data, using fallback...');
  // 如果ICO不包含PNG，我们使用hornet-headonly.png作为占位符
  const fallbackPath = path.join(__dirname, 'public', 'hornet-headonly.png');
  fs.copyFileSync(fallbackPath, pngPath);
  console.log('Using hornet-headonly.png as avatar');
}
