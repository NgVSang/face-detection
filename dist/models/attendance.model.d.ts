import mongoose, { Document } from 'mongoose';
export interface AttendanceInterface extends Document {
    type: number;
    user: string;
    date: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<AttendanceInterface, {}, {}, {}, mongoose.Document<unknown, {}, AttendanceInterface> & Omit<AttendanceInterface & {
    _id: mongoose.Types.ObjectId;
}, never>, any>;
export default _default;
