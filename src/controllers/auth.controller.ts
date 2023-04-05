import { Request, Response, NextFunction } from "express"
import response from "../utils/response"
import User from '../models/users.model'
import * as userService from '../services/user.service'
import {createToken} from "../services/jsonwebtoken.service"
import faceapi from 'face-api.js';
import { loadImage, Image, createCanvas } from 'canvas';
import {SECRET_KEY, __dirname} from "../config"
import path from "path"


const MODAL_PATH = path.join(__dirname, 'lib');

const login = async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({
            email: req.body.email,
        })
        await userService.checkPassword(user?.password || "", req.body.password || "");
        const token = createToken({
            secret_key: SECRET_KEY || "asdfad",
            data:{
                id: user?.id || '',
                name: user?.name || '',
                email: user?.email || '',
                gender: user?.gender || '',
                role: user?.role || 1,
            },
            expiresIn:"60days"
        });
        // await userService.addDeviceToken(user.id, req.value.deviceToken);
        return res.status(200).json(response({ info: user, access_token: token}, "Success", 1));
    } catch (error: any) {
        return res.status(500).json(response({}, error.message || "Lỗi máy chủ", 0));
    }
}

const faceDetect = async (req: Request, res: Response) => {
    try {
        await Promise.all([
            faceapi.nets.ssdMobilenetv1.loadFromDisk(MODAL_PATH),
            faceapi.nets.faceLandmark68Net.loadFromDisk(MODAL_PATH),
            faceapi.nets.faceRecognitionNet.loadFromDisk(MODAL_PATH),
        ]);
        let labels: any[] = [];
        if (req.file?.buffer) {
            labels = await detectFace(req.file?.buffer);
            if ( labels.length > 0 ){
                const listUserDetect: any[] = []
                for (let i = 0 ; i< labels.length ; i++ ){
                    const user = await User.findById(labels[i])
                        .select(['name','email','gender','phoneNumber'])
                    listUserDetect.push(user)
                }
                return res.status(200).json(response({ result: listUserDetect  }, "Success", 1));
            }else {
                return res.status(200).json(response({ result: labels }, "Không tìm được người phù hợp", 0));
            }
        }
    } catch (error: any) {
        return res.status(500).json(response({}, error.message || "Lỗi máy chủ", 0));
    }
}

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
        const arrFloat32: any[] = []
        for ( let j = 0 ;j < trainingData[i].faceDescriptors.length ; j ++ ){
            const arr: any =  new Float32Array(Object.values(trainingData[i].faceDescriptors[j]))
            arrFloat32.push(arr)
        }
        // console.log(arrFloat32);
        faceDescriptors.push(new faceapi.LabeledFaceDescriptors(trainingData[i].id as string, arrFloat32))
    }
    const labeledDescriptors = faceDescriptors;
    const maxDescriptorDistance = 0.6;
    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, maxDescriptorDistance);
    
    const labels = await Promise.all(
      detections.map(async (detection) => {
        // @ts-ignore
        return faceMatcher.findBestMatch(detection.descriptor).label;
      })
    );
    return labels;
    // return trainingData;
  };

export {
    login,
    faceDetect
}