import faceapi from 'face-api.js';
import path from 'path';
import { loadImage, Image, createCanvas } from 'canvas';
import { __dirname } from '../config';
import { monkeyPatchFaceApiEnv } from './monkeyPatch';
monkeyPatchFaceApiEnv();
let trainingData;
let faceMatcher;
const MODAL_PATH = path.join(__dirname, 'lib');
export const loadTrainingData = async () => {
    const labels = ['Bui_Hong_Phuoc',];
    const faceDescriptors = [];
    for (const label of labels) {
        const descriptors = [];
        for (let i = 3; i <= 10; i++) {
            const img = await loadImage(path.join(__dirname, 'labeled_images', label, `${i}.jpg`));
            const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
            if (detection?.descriptor) {
                descriptors.push(detection?.descriptor);
            }
            else {
                console.log("ảnh ", i, " không thể thấy mặt");
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
    console.log(trainingData);
    console.log('Training data complete!');
};
export const detectFace = async (imageData) => {
    const image = new Image();
    image.src = imageData;
    const canvas = createCanvas(image.width, image.height);
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0, image.width, image.height);
    const faceDetectionOptions = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 });
    const detections = await faceapi.detectAllFaces(canvas, faceDetectionOptions).withFaceLandmarks()
        .withFaceDescriptors();
    const labeledDescriptors = trainingData;
    const maxDescriptorDistance = 0.6;
    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, maxDescriptorDistance);
    const labels = await Promise.all(detections.map(async (detection) => {
        return faceMatcher.findBestMatch(detection.descriptor).label;
    }));
    return labels;
};
//# sourceMappingURL=face-recognition.js.map