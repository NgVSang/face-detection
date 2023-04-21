import express from 'express';
import * as userController from '../../controllers/users.controller'
import * as authorization from '../../middlewares/authorization.middleware'
import * as authValidation from '../../validations/auth.validation'
import validator from '../../middlewares/validate.middleware';
import multer from 'multer';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/attendance" , userController.attendance)
router.get("/getAttendance",userController.getAttendance)
router.get("/getWorking",userController.getWorking)
router.post("/change-password",userController.changePassword)
router.post("/request",userController.createRequest)
router.post(
    "/update-profile",
    userController.updateProfile
)

export default router