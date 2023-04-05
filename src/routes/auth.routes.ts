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
router.post("/detect", upload.single('photo'), authController.faceDetect);
// router.post("/login",  authController.login);

export default router
