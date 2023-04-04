import mongoose, { Schema, Document } from 'mongoose';
import {UserInterface} from './users.model';

export interface PayrollInterface extends Document {
    user: UserInterface
    baseSalary: number
    timeRequired: number
    timeWork: number
    leaveTime:number
    fined:number
    paytime: Date
    totalAmount:number
}

const PayrollSchema: Schema = new Schema(
    {
        user :{ type: mongoose.Schema.Types.ObjectId, ref: 'users' },
        baseSalary: { type: Number, required: true },
        timeRequired : { type: Number, required: true },
        timeWork: { type: Number, required: true },
        leaveTime: { type : Number, required: true },
        fined: { type : Number, required: false, default:0 },
        paytime: { type : Date, require: true }, 
        totalAmount: { type: Number, required: true },
    },
);

export default mongoose.model<PayrollInterface>('payroll', PayrollSchema);
