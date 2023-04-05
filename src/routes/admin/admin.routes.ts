import express from 'express';
import * as adminController from '../../controllers/admin.controller'
import * as authorization from '../../middlewares/authorization.middleware'
import validator from '../../middlewares/validate.middleware';
import * as authValidation from '../../validations/auth.validation'

const router = express.Router();

router.get("/users" , adminController.getListUser);
router.post(
    "/create-user", 
    validator(authValidation.createUserSchema, "body"), 
    adminController.createUser
)
router.post(
    "/add-image-user/:userId", 
    adminController.addImageForUser
)


export default router