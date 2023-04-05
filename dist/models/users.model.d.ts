import mongoose, { Document } from 'mongoose';
import { AttendanceInterface } from './attendance.model';
import { PayrollInterface } from './payroll.model';
import { WorkingInterface } from './working.model';
export interface UserInterface extends Document {
    name: string;
    email: string;
    password: string;
    gender?: string;
    profilePicture?: string;
    role: number;
    baseSalary: number;
    payrolls: string[] | PayrollInterface[];
    attendances: string[] | AttendanceInterface[];
    workings: string[] | WorkingInterface[];
    phoneNumber?: string;
    imageTraining: string[];
    faceDescriptors: any[];
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<UserInterface, {}, {}, {}, mongoose.Document<unknown, {}, UserInterface> & Omit<UserInterface & {
    _id: mongoose.Types.ObjectId;
}, never>, any>;
export default _default;
