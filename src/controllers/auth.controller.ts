import { Request, Response, NextFunction } from "express"
import response from "../utils/response"
import User from '../models/users.model'
import * as userService from '../services/user.service'
import bcrypt from 'bcrypt'
import {createToken} from "../services/jsonwebtoken.service"


const login = async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({
            email: req.body.email,
        })
        await userService.checkPassword(user?.password || "", req.body.password || "");
        const token = createToken({
            secret_key: process.env.SECRET_KEY || "asdfad",
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

export {
    login,
    createUser
}