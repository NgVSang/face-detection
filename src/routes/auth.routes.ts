import express from 'express';
import validator  from "../middlewares/validate.middleware";
import * as authController from '../controllers/auth.controller'
import * as authorization from '../middlewares/authorization.middleware'
import * as authValidation from '../validations/auth.validation'
import multer from 'multer';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/login", validator(authValidation.loginSchema, "body"), authController.login);
// router.post("/detect", upload.single('file'), authController.faceDetect);
// router.post("/login",  authController.login);
router.post("/detect", authController.faceDetect);
router.post("/detect_api",upload.single('file'), authController.faceDetectApi);

export default router
