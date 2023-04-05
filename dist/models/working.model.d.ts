import mongoose, { Document } from 'mongoose';
export interface WorkingInterface extends Document {
    user: string;
    timeWork: Number;
    date: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<WorkingInterface, {}, {}, {}, mongoose.Document<unknown, {}, WorkingInterface> & Omit<WorkingInterface & {
    _id: mongoose.Types.ObjectId;
}, never>, any>;
export default _default;
