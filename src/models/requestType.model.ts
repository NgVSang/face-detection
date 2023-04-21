import mongoose, { Schema, Document } from 'mongoose';
import {requestInterface} from './request.model';

export interface requestTypeInterface extends Document {
  name: string;
  requests: string[] | requestInterface[];
}

const requestTypeSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    requests :[{ type: mongoose.Schema.Types.ObjectId, ref: 'request' }],
  },
  { timestamps: true }
);

export default mongoose.model<requestTypeInterface>('requestType', requestTypeSchema);
