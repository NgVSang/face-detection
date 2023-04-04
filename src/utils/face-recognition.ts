import faceapi from 'face-api.js';
import path from 'path';
import { loadImage, Image, createCanvas } from 'canvas';
import { __dirname } from '../config';
import { monkeyPatchFaceApiEnv } from './monkeyPatch';
import * as fs from 'fs';

monkeyPatchFaceApiEnv();

let trainingData: any;
let faceMatcher: any;

const MODAL_PATH = path.join(__dirname, 'lib');

export const loadTrainingData = async () => {
  const labels = ['Bui_Hong_Phuoc', 'Chu Duc Anh', 'Ng Tan Khoa'];
  // const labels = ['Chu Duc Anh',];
  const faceDescriptors: any[] = [];
  for (const label of labels) {
    const descriptors: any[] = [];
    for (let i = 3; i <= 10; i++) {
      const img = await loadImage(path.join(__dirname, 'labeled_images', label, `${i}.jpg`));
      // @ts-ignore
      const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
      if (detection?.descriptor) {
        descriptors.push(detection?.descriptor);
      }else {
        console.log("ảnh ",i," không thể thấy mặt");
      }
    }
    faceDescriptors.push(new faceapi.LabeledFaceDescriptors(label, descriptors));
  }

  return faceDescriptors;
};

export const init = async () => {
  await Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromDisk(MODAL_PATH),
    faceapi.nets.faceLandmark68Net.loadFromDisk(MODAL_PATH),
    faceapi.nets.faceRecognitionNet.loadFromDisk(MODAL_PATH),
  ]);

  trainingData = await loadTrainingData();
  faceMatcher = new faceapi.FaceMatcher(trainingData, 0.6);

  console.log('Training data complete!');
};

export const detectFace = async (imageData: Buffer) => {
  const image = new Image();
  image.src = imageData;

  const canvas = createCanvas(image.width, image.height);
  const context = canvas.getContext('2d');
  context.drawImage(image, 0, 0, image.width, image.height);

  const faceDetectionOptions = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 });
  // @ts-ignore
  const detections = await faceapi.detectAllFaces(canvas, faceDetectionOptions).withFaceLandmarks()
    .withFaceDescriptors();

  const labeledDescriptors = trainingData;

  const maxDescriptorDistance = 0.6;
  const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, maxDescriptorDistance);

  const labels = await Promise.all(
    detections.map(async (detection) => {
      // @ts-ignore
      // const descriptor = await faceapi.computeFaceDescriptor(canvas, detection);

      // @ts-ignore
      return faceMatcher.findBestMatch(detection.descriptor).label;
    })
  );
  // const labels = faceMatcher.findBestMatch(detections[0].descriptor).label;  
  return labels;
};

// export const test = async ( ) => {
//   const labels = ['Chu Duc Anh',];
//   const persons = labels.map((label) => {
//     const parts = label.split(',');
//     const name = parts[0];
//     const imagePath = path.join(__dirname, parts[1]);
//     return new faceapi.LabeledFaceDescriptors(name, [await faceapi.computeFaceDescriptor(await faceapi.fetchImage(imagePath))]);
//   });
// }
