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
import Payroll from "../models/payroll.model";
import {convertDate, countWeekdays} from "../utils/timeConvert";
import {sendNotification} from "../services/notification.service";


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
        .populate({ 
            path: 'payrolls',
            match: { 
                date: { $regex: month }
            }
        })       
        .select(['baseSalary','name','email','phoneNumber','gender','workings','payrolls'])

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
                timeWork,
                //@ts-ignore
                received: user.payrolls.length == 0 ? 0 : user.payrolls[0].totalAmount
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

const updateUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params
        if (req.body.password){
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const user = await User.findByIdAndUpdate(userId,{
                ...req.body,
                password: hashedPassword,
            })
            return res.status(200).json(response({ user: user}, "Success", 1));
        }else{
            const user = await User.findByIdAndUpdate(userId,{
                phoneNumber: req.body.phoneNumber,
                email: req.body.email,
                name: req.body.name,
            })
            return res.status(200).json(response({ user: user}, "Success", 1));
        }
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
            console.log('Loading training data...');
            for (let i = 0; i < user.imageTraining.length ; i ++){
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
        const user = await User.findOne({
            requests: { $in: [requestId] } 
        })
        .select("name deviceToken")
        console.log(user);
        let request 
        if (status == 0 || status == 2){
            request = await Requests.findByIdAndUpdate(requestId,{
                status: parseInt(status)
            })
            .populate({
                path: 'type',
            })
        }else {
            return res.status(200).json(response({}, "Không có trạng thái", 0));
        }
        console.log(request);
        let body = "Request của bạn với nội dung " + request.body
        body += request.date != '' ? " vào ngày " + convertDate(request.date || "") : ""  
        body += request.startTime != '' ? " lúc " + request.startTime : ""
        body += request.endTime != '' ? " đến " + request.endTime : ""
        body += status == 0 ? " bị từ chối": " được chấp nhận" 
        console.log(body);
        sendNotification({
            token: user?.deviceToken,
            body: body,
            title: status === 0 ? "Request bị từ chối": "Request được chấp nhận" 
        })
        return res.status(200).json(response({}, "Success", 1));
    } catch (error: any) {
        return res.status(500).json(response({}, error.message || "Lỗi máy chủ", 0));
    }
}

const manageSalary = async (req: Request, res: Response) => {
    try {
        // const month = dayjs(new Date()).format("YYYY-MM")
        // const month = "2023-04"
        const { userId } = req.params
        const { salary, bonus, fined , month} = req.body
        const day = new Date(month)
        console.log(month)
        const user = await User.findById(userId)
        .populate({ 
            path: 'workings',
            match: { 
                date: { $regex: month }
            }
        })
        .select(['baseSalary','name','email','phoneNumber','gender','workings','payrolls','deviceToken'])
        let timeWork = 0
        //@ts-ignore
        for (let j = 0 ; j < user?.workings?.length ; j++ ){
            const work = user?.workings[j]
            if ( typeof(work) === 'object'){
                timeWork += work.timeWork
            }
        }

        // const countDay = countWeekdays(day.getFullYear(),day.getMonth())
        // console.log(countDay);
        
        const payroll = await Payroll.create({
            totalAmount: parseInt(salary) + parseInt(bonus) || 0,
            bonus : bonus || 0,
            fined: fined || 0,
            user: user?._id,
            baseSalary: user?.baseSalary,
            timeWork : timeWork,
            date: month,
            // paytime: paytime || dayjs(new Date()).format("YYYY-MM-DD"),
        })
        user?.payrolls.push(payroll._id)
        user?.save()
        sendNotification({
            token: user?.deviceToken,
            body: "Lương tháng này bạn được " + (parseInt(salary) + parseInt(bonus) - parseInt(fined) || 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
            title: "Thông báo về lương tháng " + dayjs(day).format("MM/YYYY")
        })
        return res.status(200).json(response({payroll}, "Success", 1));
    } catch (error: any) {
        return res.status(500).json(response({}, error.message || "Lỗi máy chủ", 0));
    }
}

const autoSalaryCost = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params
        const { requestId, status } = req.body
        const user = await User.findById(userId)
        return res.status(200).json(response({}, "Success", 1));
    } catch (error: any) {
        return res.status(500).json(response({}, error.message || "Lỗi máy chủ", 0));
    }
}

const testNotification = async (req: Request, res: Response) => {
    try {
        const { userId } = req.query
        const user = await User.findById(userId).select("deviceToken")
        sendNotification({
            token: user?.deviceToken,
            title: "Test",
            body: "Test"
        })
        return res.status(200).json(response({user}, "Success", 1));
    } catch (error: any) {
        console.log(error);
        
        return res.status(500).json(response({}, error.message || "Lỗi máy chủ", 0));
    }
}

export {
    getListUser,
    testAddImage,
    addImageForUser,
    createUser,
    updateUser,
    imageTraining,
    getSalary,
    getUserWorkingDetail,
    getUserAttendance,
    createTypeRequest,
    getListRequest,
    updateStatusRequest,
    manageSalary,
    autoSalaryCost,
    testNotification
}