import mongoose, { Schema, Document } from 'mongoose';
import {WorkingInterface} from './working.model';

export interface AttendanceInterface extends Document {
    type: number
    user: string
    // working: string | WorkingInterface
    date: string
    createdAt: Date
    updatedAt: Date
}

const AttendanceSchema: Schema = new Schema(
  {
    type: { type: Number, require: true },
    user :{ type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    date : { type: String, require: true }
    // working :{ type: mongoose.Schema.Types.ObjectId, ref: 'working' },
  },
  { timestamps: true }
);

export default mongoose.model<AttendanceInterface>('attendances', AttendanceSchema);
