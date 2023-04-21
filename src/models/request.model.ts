import mongoose, { Schema, Document } from 'mongoose';
import {requestTypeInterface} from './requestType.model';

export interface requestInterface extends Document {
    user: string;
    type: string | requestTypeInterface;
    status: number;
    body: string;
    date: string;
    startTime: string;
    endTime: string;
}

const requestSchema: Schema = new Schema(
  {
    user :{ type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    type: { type: mongoose.Schema.Types.ObjectId, ref: 'requestType' },
    date: {  type: String, required: false, },
    startTime: {  type: String, required: false, },
    endTime: {  type: String, required: false, },
    status: { type: Number, required: false, default: 1 },
    body: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<requestInterface>('request', requestSchema);
