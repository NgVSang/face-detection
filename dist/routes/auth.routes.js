import express from 'express';
import validator from "../middlewares/validate.middleware";
import * as authController from '../controllers/auth.controller';
import * as authValidation from '../validations/auth.validation';
const router = express.Router();
router.post("/login", validator(authValidation.loginSchema, "body"), authController.login);
export default router;
//# sourceMappingURL=auth.routes.js.map