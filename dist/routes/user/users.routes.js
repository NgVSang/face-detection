import express from 'express';
import * as userController from '../../controllers/users.controller';
const router = express.Router();
router.post("/attendance", userController.attendance);
router.get("/getAttendance", userController.getAttendance);
router.get("/getWorking", userController.getWorking);
export default router;
//# sourceMappingURL=users.routes.js.map