import mongoose, { Schema, Document } from 'mongoose';
import {AttendanceInterface} from './attendance.model';
import {PayrollInterface} from './payroll.model';
import {WorkingInterface} from './working.model';

export interface UserInterface extends Document {
  name: string;
  email: string;
  password: string;
  gender?:string
  profilePicture?:string
  role:number
  baseSalary: number
  payrolls: string[] | PayrollInterface[]
  attendances: string[] | AttendanceInterface[]
  workings: string[] | WorkingInterface[]
  phoneNumber?: string
  createdAt: Date
  updatedAt: Date
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: { type: String, required: false },
    phoneNumber: { type: String, require: false },
    profilePicture: { type: String, required: false, default: "images/default.jpg" },
    payrolls:[{ type: mongoose.Schema.Types.ObjectId, ref: 'payroll' }],
    workings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'working' }],
    attendances:[{ type: mongoose.Schema.Types.ObjectId, ref: 'attendances' }],
    baseSalary: {type: Number, required: false, default: 3500000},
    role: { type: Number, required: false, default: 1 },
  },
  { timestamps: true }
);

export default mongoose.model<UserInterface>('users', UserSchema);
