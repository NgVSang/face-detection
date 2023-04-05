import express from 'express';
// const authRouter = require("./auth.routes");
import authRouter from './auth.routes'
import userRoute from './user/users.routes'
import adminRoute from './admin/admin.routes'
import * as authorization from '../middlewares/authorization.middleware'
import * as userController from '../controllers/users.controller'
import * as adminController from '../controllers/admin.controller'
import {uploadFileMiddleware} from '../utils/saveImage';

const router = express.Router();

const authRoutes = [{ path: "/auth", route: authRouter }];
const userRoutes = [{ path: "/user", route: userRoute }];
const adminRoutes = [{ path: "/admin", route: adminRoute }];

authRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

userRoutes.forEach((route) => {
    router.use(route.path, authorization.checkEmployee , route.route);
});
adminRoutes.forEach((route) => {
    router.use(route.path, authorization.checkAdmin , route.route);
});

router.post('/test',adminController.testAddImage)

export default router;