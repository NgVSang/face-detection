import { Image, createCanvas } from 'canvas';
import faceapi from 'face-api.js';
import User from '../models/users.model'

const detectFace = async (imageData: Buffer) => {
    const image = new Image();
    image.src = imageData;
    const canvas = createCanvas(image.width, image.height);
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0, image.width, image.height);
  
    const faceDetectionOptions = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 });
    // @ts-ignore
    const detections = await faceapi.detectAllFaces(canvas, faceDetectionOptions).withFaceLandmarks()
      .withFaceDescriptors();
    const trainingData = await User.find({
        role: 1
    })
    .select(['name','faceDescriptors'])
    
    const faceDescriptors: any[] = [];
    for ( let i = 0; i < trainingData.length ; i++ ) {
        if (trainingData[i].faceDescriptors && trainingData[i].faceDescriptors?.length > 0){
            const arrFloat32: any[] = []
            for ( let j = 0 ;j < trainingData[i].faceDescriptors?.length ; j ++ ){
                const arr: any =  new Float32Array(Object.values(trainingData[i].faceDescriptors[j]))
                arrFloat32.push(arr)
            }
            faceDescriptors.push(new faceapi.LabeledFaceDescriptors(trainingData[i].id as string, arrFloat32))
        }
    }
    const labeledDescriptors = faceDescriptors;
    const maxDescriptorDistance = 0.5;
    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, maxDescriptorDistance);

    const labeledResults = detections.map((detection) => {
        const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
        return {
            detection,
            label: bestMatch.label,
            distance: bestMatch.distance
        };
    });
    
    const results = labeledResults.map((result) => {
        return result.label
    });
    return results;
};

const FaceService = {
    detectFace
}

export default FaceService