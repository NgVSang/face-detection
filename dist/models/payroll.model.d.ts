import mongoose, { Document } from 'mongoose';
import { UserInterface } from './users.model';
export interface PayrollInterface extends Document {
    user: UserInterface;
    baseSalary: number;
    timeRequired: number;
    timeWork: number;
    leaveTime: number;
    fined: number;
    paytime: Date;
    totalAmount: number;
}
declare const _default: mongoose.Model<PayrollInterface, {}, {}, {}, mongoose.Document<unknown, {}, PayrollInterface> & Omit<PayrollInterface & {
    _id: mongoose.Types.ObjectId;
}, never>, any>;
export default _default;
