import { Response, Request } from "express"
import response from "../utils/response";
import Attendance from '../models/attendance.model'
import * as userService from '../services/user.service'
import User from '../models/users.model'
import CronJob from 'node-cron'
import {timeConvert} from "../utils/timeConvert";
import dayjs from 'dayjs'
import bcrypt from 'bcrypt'
import Working from "../models/working.model";
import {uploadFileMiddleware} from "../utils/saveImage";
import {deleteImage} from "../utils/deleteFiles";

const countingTimeWorkInDay = async () => {
    const scheduledNotifications = CronJob.schedule("0 * * * * *", async () => {
        try {
            const timeConfig = '11:18:00'
            const date = new Date(
                new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
            );
            if (timeConvert(date) === timeConfig) {
                console.log("come");
                const date = dayjs(new Date()).format("YYYY-MM-DD")
                const listUser = await User.find({
                    role: 1
                }).populate({ 
                    path: 'attendances',
                    match: { 
                        date: date
                    }
                })
                // .select(['attendances','name','email','phoneNumber'])
                for (let i = 0 ; i < listUser.length ; i ++ ) {
                    const user = listUser[i]
                    let time = 0
                    for ( let j = user.attendances.length - 1 ; j >= 0 ; j -- ) {
                        const attendance = user.attendances[j]
                        const before = user.attendances[j-1]
                        if ( typeof(attendance) === 'object' && typeof(before) === 'object' && attendance.type === 0 ) {
                            const endTime = dayjs(attendance.createdAt)
                            const startTime = dayjs(before.createdAt)
                            time += endTime.diff(startTime, 'seconds');
                        }
                    }
                    const working = await Working.create({
                        date: date,
                        user: user._id,
                        timeWork: time,
                    })
                    user.workings.push(working._id)
                    user.save()
                }
            }
        } catch (error) {
            console.log(error);
        }
    });
    scheduledNotifications.start();
}

const countingSalary = async () => {
    const scheduledNotifications = CronJob.schedule("0 * * * * *", async () => {
        try {
            const timeConfig = ' 11:44:00'
            // const dateConfig = dayjs(new Date()).endOf('month').format('YYYY-MM-DD')
            const dateConfig = '2023-03-30'
            const date = new Date(
                new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
            );
            if (dayjs(date).format('YYYY-MM-DD HH:mm:ss') === (dateConfig + timeConfig)) {
                console.log('ok');
                
            }
        } catch (error) {
            console.log(error);
        }
    });
    scheduledNotifications.start();
}

const test = async (req: any, res: Response) => {
    try {
        const month = '2023-03'
        const listUser = await User.find({
            role: 1
        }).populate({ 
            path: 'workings',
            match: { 
                date: { $regex: month }
            }
        })
        .select(['workings','name','email','phoneNumber'])
        return res.status(200).json(response({ result: listUser}, "Success", 1));
    } catch (error: any) {
        return res.status(500).json(response({}, error.message || "Lỗi máy chủ", 0));
    }
}

const attendance = async (req: any, res: Response) => {
    try {
        const { user } = req
        let result 
        const date = dayjs(new Date()).format("YYYY-MM-DD")
        // const date = "2023-03-29"
        const lastAttendance =  await Attendance.find({
            user: user.id,
            date: date
        }).sort({createdAt:'desc'})
        if (lastAttendance.length > 0){
            if (lastAttendance[0].type == 1 ) {
                result = await Attendance.create({
                    type: 0,
                    user: user.id,
                    date: date
                })
                let time = 0 
                lastAttendance.unshift(result)
                for (let i = 0 ; i< lastAttendance.length ; i++){
                    if (lastAttendance[i].type === 0 ){
                        const endTime = dayjs(lastAttendance[i].createdAt)
                        const startTime = dayjs(lastAttendance[i+ 1].createdAt)
                        time += endTime.diff(startTime, 'seconds');
                    }
                }
                const work = await Working.findOne({
                    date: date
                })
                await Working.findByIdAndUpdate(work?._id, {
                    timeWork: time
                })
            }else {
                result = await Attendance.create({
                    type: 1,
                    user: user.id,
                    date: date
                })
                
            }
        }else {
            result = await Attendance.create({
                type: 1,
                user: user.id,
                date: date
            })
            const work = await Working.create({
                date: date,
                user: user.id,
                timeWork: 0,
            })
            await User.findByIdAndUpdate(user.id,{
                $push: {
                    workings : work._id
                }
            })
        }
        const userFind = await User.findById(user.id)
        userFind?.attendances.push(result._id)
        userFind?.save()
        return res.status(200).json(response({ result: result}, "Success", 1));
    } catch (error: any) {
        return res.status(500).json(response({}, error.message || "Lỗi máy chủ", 0));
    }
}

const getAttendance =  async (req: any, res: Response) => {
    try {
        const { date = dayjs(new Date()).format("YYYY-MM-DD") } = req.query
        const { user } = req
        const attendance = await Attendance.find({
            user: user.id,
            date: date
        })

        return res.status(200).json(response({ result: attendance}, "Success", 1));
    } catch (error: any) {
        return res.status(500).json(response({}, error.message || "Lỗi máy chủ", 0));
    }
}

const getWorking = async (req: any, res: Response) => {
    try {
        const { month = dayjs(new Date()).format("YYYY-MM")} = req.query
        const { user } = req

        const workings = await Working.find({
            user: user.id,
            date: {$regex: month}
        })
        return res.status(200).json(response({ result: workings}, "Success", 1));
    } catch (error: any) {
        return res.status(500).json(response({}, error.message || "Lỗi máy chủ", 0));
    }
}

const changePassword =  async (req: any, res: Response) => {
    try {
        const { user } = req
        const { oldPassword, newPassword, confirmPassword } = req.body
        if (newPassword !== confirmPassword) {
            return res.status(200).json(response({}, "Mật khẩu không hợp lệ.", 0));
        }else {
            const findUser = await User.findById(user?.id || '')
            await userService.checkPassword(findUser?.password || "", oldPassword || "");
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await User.findByIdAndUpdate(findUser?.id || '',{
                password: hashedPassword
            })
            return res.status(200).json(response({ }, "Đổi mật khẩu thành công", 1));
        }
    } catch (error: any) {
        return res.status(500).json(response({}, error.message || "Lỗi máy chủ", 0));
    }
}

const updateProfile =  async (req: any, res: Response) => {
    try {
        await uploadFileMiddleware(req,res)
        const { user } = req
        const { email, phoneNumber , name } = req.body
        const userFind = await User.findById(user.id)
        let imageUrl = userFind?.profilePicture || ""
        if (req?.files?.length) {
            await User.findByIdAndUpdate(user.id,{
                email:email,
                phoneNumber: phoneNumber,
                name: name,
                profilePicture: 'userImages/'+ req?.files[0].filename
            })
            imageUrl= 'userImages/'+ req?.files[0].filename
            console.log(userFind?.profilePicture);
            deleteImage(userFind?.profilePicture || '')
        }else {
            await User.findByIdAndUpdate(user.id,{
                email:email,
                phoneNumber: phoneNumber,
                name: name,
            })
        }
        return res.status(200).json(response({imageUrl: imageUrl}, "Cập nhập thông tin thành công", 1));
    } catch (error: any) {
        return res.status(500).json(response({}, error.message || "Lỗi máy chủ", 0));
    }
}

export {
    attendance,
    countingTimeWorkInDay,
    test,
    countingSalary,
    getAttendance,
    getWorking,
    changePassword,
    updateProfile,
}