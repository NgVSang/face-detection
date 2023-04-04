import {Response} from "express";
import User from "../models/users.model";
import response from "../utils/response";

const getListUser = async (req: any, res: Response) => {
    try {
        const { limit = 10,skip = 0 } = req.query
        console.log(limit);
        const month = '2023-03'
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

        return res.status(200).json(response({ result: listUser}, "Success", 1));
    } catch (error: any) {
        return res.status(500).json(response({}, error.message || "Lỗi máy chủ", 0));
    }
}

export {
    getListUser
}