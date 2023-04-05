import express from 'express';
import authRouter from './auth.routes';
import userRoute from './user/users.routes';
import adminRoute from './admin/admin.routes';
import * as authorization from '../middlewares/authorization.middleware';
import * as adminController from '../controllers/admin.controller';
const router = express.Router();
const authRoutes = [{ path: "/auth", route: authRouter }];
const userRoutes = [{ path: "/user", route: userRoute }];
const adminRoutes = [{ path: "/admin", route: adminRoute }];
authRoutes.forEach((route) => {
    router.use(route.path, route.route);
});
userRoutes.forEach((route) => {
    router.use(route.path, authorization.checkEmployee, route.route);
});
adminRoutes.forEach((route) => {
    router.use(route.path, authorization.checkAdmin, route.route);
});
router.post('/test', adminController.testAddImage);
export default router;
//# sourceMappingURL=index.routes.js.map