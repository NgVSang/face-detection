import express from 'express';
import * as adminController from '../../controllers/admin.controller'
import * as authorization from '../../middlewares/authorization.middleware'

const router = express.Router();

router.get("/users" , adminController.getListUser);

export default router