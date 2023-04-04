import express from 'express';
import * as userController from '../../controllers/users.controller'
import * as authorization from '../../middlewares/authorization.middleware'

const router = express.Router();

router.post("/attendance" , userController.attendance)
router.get("/getAttendance",userController.getAttendance)
router.get("/getWorking",userController.getWorking)

export default router