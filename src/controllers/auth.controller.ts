import { Request, Response, NextFunction } from "express"
import response from "../utils/response"
import User from '../models/users.model'
import * as userService from '../services/user.service'
import {createToken} from "../services/jsonwebtoken.service"
import faceapi from 'face-api.js';
import { loadImage, Image, createCanvas } from 'canvas';
import {SECRET_KEY, __dirname} from "../config"
import path from "path"
import {sendNotification} from "../services/notification.service"
import dayjs from "dayjs"


const MODAL_PATH = path.join(__dirname, 'lib');

const login = async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({
            email: req.body.email,
        })
        .select(['baseSalary','name','email','phoneNumber','gender','workings','password','profilePicture','role'])
        await userService.checkPassword(user?.password || "", req.body.password || "");
        const deviceToken = req.body.deviceToken
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
        if (deviceToken ){
            await User.findByIdAndUpdate(user?.id,{
                deviceToken: deviceToken
            })
        }
        // await userService.addDeviceToken(user.id, req.value.deviceToken);
        return res.status(200).json(response({ info: user, access_token: token}, "Success", 1));
    } catch (error: any) {
        return res.status(500).json(response({}, error.message || "Lỗi máy chủ", 0));
    }
}

const faceDetectApi = async (req: Request, res: Response) => {
    try {
        await Promise.all([
            faceapi.nets.ssdMobilenetv1.loadFromDisk(MODAL_PATH),
            faceapi.nets.faceLandmark68Net.loadFromDisk(MODAL_PATH),
            faceapi.nets.faceRecognitionNet.loadFromDisk(MODAL_PATH),
        ]);
        console.log('Loading training data...');
        let labels: any[] = [];
        if (req.file?.buffer) {
            labels = await detectFace(req.file?.buffer);
            // console.log("adfad",labels);
            if ( labels.length > 0 ){
                const listUserDetect: any[] = []
                for (let i = 0 ; i< labels.length ; i++ ){
                    if (labels[i].includes("unknown")) {
                        
                    }else {
                        const user = await User.findById(labels[i])
                            .select(['name','email','gender','phoneNumber','deviceToken'])
                        // sendNotification({
                        //     token: user?.deviceToken,
                        //     body: 'Bạn vừa chấm công vào lúc '+ dayjs(new Date()).format('HH:mm:ss') + ' ngày ' + dayjs(new Date()).format('DD/MM/YYYY') ,
                        //     title: 'Chấm công thành công'
                        // })
                        listUserDetect.push(user)
                    }
                }
                console.log("result:",listUserDetect);
                if (listUserDetect.length === 0 ){
                    return res.status(200).json(response({ result: listUserDetect  }, "Không nhận diện được ai", 0));
                }else return res.status(200).json(response({ result: listUserDetect  }, "Success", 1));
            }else {
                return res.status(200).json(response({ result: labels }, "Không tìm được người phù hợp", 0));
            }
        }
    } catch (error: any) {
        return res.status(500).json(response({}, error.message || "Lỗi máy chủ", 0));
    }
}

const faceDetect = async (req: Request, res: Response) => {
    try {
        const buffers: any = [];
        req.on('data', (chunk) => {
            buffers.push(chunk);
        });
        req.on('end', async () => {
            const completeBuffer = Buffer.concat(buffers);
            await Promise.all([
                faceapi.nets.ssdMobilenetv1.loadFromDisk(MODAL_PATH),
                faceapi.nets.faceLandmark68Net.loadFromDisk(MODAL_PATH),
                faceapi.nets.faceRecognitionNet.loadFromDisk(MODAL_PATH),
            ]);
            console.log('Loading training data...');
            let labels: any[] = [];
            console.log(completeBuffer);
            if (completeBuffer) {
                labels = await detectFace(completeBuffer);
                // if (labels.includes("unknown")) {
                //     return res.status(200).json(response({ result: labels }, "Không tìm được người phù hợp", 0));
                // }
                if ( labels.length > 0 ){
                    const listUserDetect: any[] = []
                    for (let i = 0 ; i< labels.length ; i++ ){
                        if (labels[i].includes("unknown")) {
                            
                        }else {
                            const user = await User.findById(labels[i])
                                .select(['name','email','gender','phoneNumber','deviceToken'])
                            // sendNotification({
                            //     token: user?.deviceToken,
                            //     body: 'Bạn vừa chấm công vào lúc '+ dayjs(new Date()).format('HH:mm:ss') + ' ngày ' + dayjs(new Date()).format('DD/MM/YYYY') ,
                            //     title: 'Chấm công thành công'
                            // })
                            listUserDetect.push(user)
                        }
                    }
                    console.log("result:",listUserDetect);
                    if (listUserDetect.length === 0 ){
                        return res.status(200).json(response({ result: listUserDetect  }, "Không nhận diện được ai", 0));
                    }else return res.status(200).json(response({ result: listUserDetect  }, "Success", 1));
                }else {
                    return res.status(200).json(response({ result: labels }, "Không tìm được người phù hợp", 0));
                }
            }
            res.end();
        });
    } catch (error: any) {
        return res.status(500).json(response({}, error.message || "Lỗi máy chủ", 0));
    }
}

const detectFace = async (imageData: Buffer) => {
    // console.log("Ảnh:",imageData);
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
    // console.log(trainingData);
    
    const faceDescriptors: any[] = [];
    for ( let i = 0; i < trainingData.length ; i++ ) {
        if (trainingData[i].faceDescriptors && trainingData[i].faceDescriptors?.length > 0){
            const arrFloat32: any[] = []
            for ( let j = 0 ;j < trainingData[i].faceDescriptors?.length ; j ++ ){
                const arr: any =  new Float32Array(Object.values(trainingData[i].faceDescriptors[j]))
                arrFloat32.push(arr)
            }
            // console.log(arrFloat32);
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
    console.log(labeledResults);
    const results = labeledResults.map((result) => {
        return result.label
        //   box: result.detection.box,
        //   label: result.label,
        //   distance: result.distance
      });
    return results;
    // return trainingData;
  };

export {
    login,
    faceDetect,
    faceDetectApi
}