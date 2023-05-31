import dayjs from 'dayjs'
import User from '../models/users.model'
import Attendance from '../models/attendance.model'
import Working from "../models/working.model";

const attendance = async (user: any) =>{
    const date = dayjs(new Date()).format("YYYY-MM-DD")
    let result: any
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
                date: date,
                user:user.id
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
    return result
}

const AttenDanceService = {
    attendance
}

export default AttenDanceService