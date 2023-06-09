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
import AttenDanceService from "../services/attendance.service"
import FaceService from "../services/face.service"

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
        console.log('Loading training data...');
        let labels: any[] = [];
        if (req.file?.buffer) {
            labels = await FaceService.detectFace(req.file?.buffer);
            // console.log("adfad",labels);
            if ( labels.length > 0 ){
                const listUserDetect: any[] = []
                for (let i = 0 ; i< labels.length ; i++ ){
                    if (labels[i].includes("unknown")) {
                        
                    }else {
                        const user = await User.findById(labels[i])
                            .select(['name','email','gender','phoneNumber','deviceToken'])
                        sendNotification({
                            token: user?.deviceToken,
                            body: 'Bạn vừa chấm công vào lúc '+ dayjs(new Date()).format('HH:mm:ss') + ' ngày ' + dayjs(new Date()).format('DD/MM/YYYY') ,
                            title: 'Chấm công thành công'
                        })
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
            console.log('Loading training data...');
            let labels: any[] = [];
            console.log(completeBuffer);
            if (completeBuffer) {
                labels = await FaceService.detectFace(completeBuffer);
                if ( labels.length > 0 ){
                    const listUserDetect: any[] = []
                    for (let i = 0 ; i< labels.length ; i++ ){
                        if (labels[i].includes("unknown")) {
                            
                        }else {
                            const user = await User.findById(labels[i])
                                .select(['name','email','gender','phoneNumber','deviceToken'])
                            sendNotification({
                                token: user?.deviceToken,
                                body: 'Bạn vừa chấm công vào lúc '+ dayjs(new Date()).format('HH:mm:ss') + ' ngày ' + dayjs(new Date()).format('DD/MM/YYYY') ,
                                title: 'Chấm công thành công'
                            })
                            await AttenDanceService.attendance(user)
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

export {
    login,
    faceDetect,
    faceDetectApi
}