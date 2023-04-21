import express from 'express';
import * as adminController from '../../controllers/admin.controller'
import * as authorization from '../../middlewares/authorization.middleware'
import validator from '../../middlewares/validate.middleware';
import * as authValidation from '../../validations/auth.validation'

const router = express.Router();

router.get("/users" , adminController.getListUser);
router.get("/users-salary" , adminController.getSalary);
router.get("/user-working/:userId" , adminController.getUserWorkingDetail);
router.get("/user-attendance/:userId" , adminController.getUserAttendance);
router.get("/users-request" , adminController.getListRequest);

router.post(
    "/create-type-request", 
    adminController.createTypeRequest
)

router.post(
    "/create-user", 
    validator(authValidation.createUserSchema, "body"), 
    adminController.createUser
)
router.post(
    "/add-image-user/:userId", 
    adminController.addImageForUser
)

router.post(
    "/update-request", 
    adminController.updateStatusRequest
)

router.post 


export default router