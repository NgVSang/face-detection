import {Response, Request} from "express";
import User from "../models/users.model";
import RequestType from "../models/requestType.model"
import Requests from "../models/request.model"
import response from "../utils/response";
import bcrypt from 'bcrypt'
import {uploadFileMiddleware} from "../utils/saveImage";
import {loadImage} from "canvas";
import path from "path";
import {__dirname} from "../config";
import faceapi from 'face-api.js';
import dayjs from "dayjs";
import Attendance from "../models/attendance.model";


const MODAL_PATH = path.join(__dirname, 'lib');
const getListUser = async (req: any, res: Response) => {
    try {
        const { limit = 10,skip = 0 } = req.query
        const totalItems = await User.countDocuments({role: 1})
        const listUser = await User.find({
            role: 1
        })
        // .populate({ 
        //     path: 'workings',
        //     match: { 
        //         date: { $regex: month }
        //     }
        // })
        .select(['baseSalary','name','email','phoneNumber','gender'])
        .limit(limit)
        .skip(skip)
        return res.status(200).json(response({ result: listUser , totalItems: totalItems}, "Success", 1));
    } catch (error: any) {
        return res.status(500).json(response({}, error.message || "Lỗi máy chủ", 0));
    }
}

const getSalary = async (req: any, res: Response) => {
    try {
        const { month = dayjs(new Date()).format('YYYY-DD')} = req.query
        const totalItems = await User.countDocuments({role: 1})
        const listUser = await User.find({
            role: 1,
        })
        .populate({ 
            path: 'workings',
            match: { 
                date: { $regex: month }
            }
        })
        .select(['baseSalary','name','email','phoneNumber','gender','workings'])

        const result: any[] = []
        for (let i = 0 ; i < listUser.length ; i++){
            let timeWork = 0
            const user = listUser[i]
            for (let j = 0 ; j < user.workings.length ; j++ ){
                const work = user.workings[j]
                if ( typeof(work) === 'object'){
                    timeWork += work.timeWork
                }
            }
            result.push({
                ...user.toObject(),
                timeWork
            })
        }
        return res.status(200).json(response({ result: result , totalItems: totalItems}, "Success", 1));
    } catch (error: any) {
        return res.status(500).json(response({}, error.message || "Lỗi máy chủ", 0));
    }
}

const getUserWorkingDetail = async (req: any, res: Response) => {
    try {
        const { userId } = req.params
        const { month = dayjs(new Date()).format('YYYY-MM')} = req.query
        const user = await User.findById(userId)
            .populate({ 
                path: 'workings',
                match: { 
                    date: { $regex: month }
                }
            })
            .select(['baseSalary','name','email','phoneNumber','gender','workings'])
        return res.status(200).json(response({ result: user}, "Success", 1));
    } catch (error: any) {
        return res.status(500).json(response({}, error.message || "Lỗi máy chủ", 0));
    }
}

const getUserAttendance = async (req: any, res: Response) => {
    try {
        const { userId } = req.params
        const { date = dayjs(new Date()).format('YYYY-MM-DD')} = req.query
        const attendance = await Attendance.find({
            user: userId,
            date: date
        })
        return res.status(200).json(response({ result: attendance }, "Success", 1));
    } catch (error: any) {
        return res.status(500).json(response({}, error.message || "Lỗi máy chủ", 0));
    }
}

const testAddImage = async (req: Request, res: Response) => {
    try {
        await uploadFileMiddleware(req,res)
        const arr = req.files
        console.log(req.files);
        
        // if (req?.files?.length) {
        //     //@ts-ignore
        //     arr.push(req?.files)
        // }
        return res.status(200).json(response({resutl: arr}, "Success", 1));
    } catch (error: any) {
        return res.status(500).json(response({}, error.message || "Lỗi máy chủ", 0));
    }
}

const createUser = async (req: Request, res: Response) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = await User.create({
            ...req.body,
            password: hashedPassword
        });
        return res.status(200).json(response({ user: user}, "Success", 1));
    } catch (error: any) {
        console.log("here");
        return res.status(500).json(response({}, error.message || "Lỗi máy chủ", 0));
    }
}

const addImageForUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params
        const user = await User.findById(userId)
        await uploadFileMiddleware(req,res)
        // const arr: string[] = []
        if (req?.files?.length) {
            //@ts-ignore
            for ( let i = 0 ; i< req?.files?.length ; i++){
                //@ts-ignore
                user?.imageTraining.push(req?.files[i].filename)
            }
        }
        await user?.save()
        return res.status(200).json(response({ result: user}, "Success", 1));
    } catch (error: any) {
        return res.status(500).json(response({}, error.message || "Lỗi máy chủ", 0));
    }
}

const imageTraining =async (req: Request, res: Response) => {
    try {
        const { userId } = req.params
        const user = await User.findById(userId)
        const descriptors:any[] = []
        if (user){
            await Promise.all([
                faceapi.nets.ssdMobilenetv1.loadFromDisk(MODAL_PATH),
                faceapi.nets.faceLandmark68Net.loadFromDisk(MODAL_PATH),
                faceapi.nets.faceRecognitionNet.loadFromDisk(MODAL_PATH),
            ]);
            console.log('Loading training data...');
            for (let i = 0; i < user.imageTraining.length ; i ++){
                // for (let i = 0; i < 1 ; i ++){
                // arr.push(path.join(__dirname, 'src/public/userImages/',user.imageTraining[i]))
                const img = await loadImage(path.join(__dirname, 'public/userImages/',user.imageTraining[i]))
                // @ts-ignore
                const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
                if (detection?.descriptor) {
                    descriptors.push(detection?.descriptor);
                }
            }
            await User.findByIdAndUpdate(userId,{
                faceDescriptors: descriptors
            })
        }else {
            return res.status(200).json(response({  }, "Không tìm thấy user", 0));
        }
        return res.status(200).json(response({ result: descriptors }, "Success", 1));
    } catch (error: any) {
        return res.status(500).json(response({}, error.message || "Lỗi máy chủ", 0));
    }
}

const createTypeRequest = async (req: Request, res: Response) => {
    try {
        const { name } = req.body
        const requestType = await RequestType.create({
            name:name 
        });
        return res.status(200).json(response({ result: requestType}, "Success", 1));
    } catch (error: any) {
        return res.status(500).json(response({}, error.message || "Lỗi máy chủ", 0));
    }
}

const getListRequest = async (req: Request, res: Response) => {
    try {
        const totalItems = await Requests.countDocuments()
        const listRequest = await Requests.find({})
        .populate({ 
            path: 'user',
            select:['name']
        })
        .populate({
            path: 'type',
            select:['name']
        })
        .sort({createdAt:'desc'})
        return res.status(200).json(response({result: listRequest, totalItems:totalItems}, "Success", 1));
    } catch (error: any) {
        return res.status(500).json(response({}, error.message || "Lỗi máy chủ", 0));
    }
}

const updateStatusRequest = async (req: Request, res: Response) => {
    try {
        const { requestId, status } = req.body
        //@ts-ignore
        if (status == 0 || status == 2){
            await Requests.findByIdAndUpdate(requestId,{
                status: parseInt(status)
            })
        }else {
            return res.status(200).json(response({}, "Không có trạng thái", 0));
        }
        return res.status(200).json(response({}, "Success", 1));
    } catch (error: any) {
        return res.status(500).json(response({}, error.message || "Lỗi máy chủ", 0));
    }
}

export {
    getListUser,
    testAddImage,
    addImageForUser,
    createUser,
    imageTraining,
    getSalary,
    getUserWorkingDetail,
    getUserAttendance,
    createTypeRequest,
    getListRequest,
    updateStatusRequest
}