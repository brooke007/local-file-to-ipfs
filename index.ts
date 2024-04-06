import { createCanvas, loadImage } from 'canvas';
import GIFEncoder from 'gifencoder';
import * as fs from 'fs';

// const { createCanvas, loadImage } = require('canvas');
// const GIFEncoder = require('gifencoder');
// const fs = require('fs');


// 读取并解析 JSON 文件
function readJsonFile(filePath: string) {
  const jsonData = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(jsonData);
}

async function createGifFromFrames(frameData: any[], outputPath: string) {
  const width = 3000; // 根据实际情况调整
  const height = 2500; // 根据实际情况调整
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  const encoder = new GIFEncoder(width, height);
  encoder.start();
  encoder.setRepeat(0); 
  encoder.setDelay(500); 
  encoder.setQuality(10); 

  // const loadImagesPromises = frameData.flatMap(frame =>
  //   frame.map(({ uri }) => loadImage(uri))
  // );
  // const images = await Promise.all(loadImagesPromises);

  let imageIndex = 0;

  for (const frame of frameData) {
    ctx.clearRect(0, 0, width, height);

    // ctx.fillStyle = 'white'; // 设置填充颜色为白色
    // ctx.fillRect(0, 0, width, height); // 填充整个画布
    //console.log(frame);
    for (const {uri, x, y, rotation, scale} of frame) {
      const image = await loadImage(uri);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation * Math.PI / 180);
      ctx.scale(scale, scale); 
      ctx.drawImage(image, -image.width / 2, -image.height / 2);
      ctx.restore();
      console.log(uri, x, y, rotation, scale);
    }
    console.log("1 image finished");
    encoder.addFrame(ctx as any);
  }

  encoder.finish();

  const buffer = encoder.out.getData();
  fs.writeFileSync(outputPath, buffer, 'binary');
  console.log('GIF created:', outputPath);
}

// 调用函数，这次我们从 JSON 文件中读取帧数据
const frames = readJsonFile('all-keyframes.json'); // 请根据实际路径修改
createGifFromFrames(frames, './output.gif').catch(console.error);