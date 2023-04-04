import mongoose, { Schema, Document } from 'mongoose';

export interface WorkingInterface extends Document {
    user: string
    timeWork: Number
    date: string
    createdAt: Date
    updatedAt: Date
}

const workingSchema: Schema = new Schema(
  {
    user :{ type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    date: { type: String, require: true },
    timeWork: { type : Number, require: true },
  },
  { timestamps: true }
);

export default mongoose.model<WorkingInterface>('working', workingSchema);
