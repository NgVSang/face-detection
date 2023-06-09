import express from 'express';
import * as userController from '../../controllers/users.controller'
import * as authorization from '../../middlewares/authorization.middleware'
import * as authValidation from '../../validations/auth.validation'
import validator from '../../middlewares/validate.middleware';
import multer from 'multer';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/getAttendance",userController.getAttendance)
router.get("/getWorking",userController.getWorking)
router.get("/list-request",userController.getListRequest)
router.get("/getRequestType",userController.getAllRequsetType)
router.get("/salary",userController.getSalary)

router.post("/attendance" , userController.attendance)
router.post("/change-password",userController.changePassword)
router.post("/request",userController.createRequest)
router.post(
    "/update-profile",
    userController.updateProfile
)

export default router