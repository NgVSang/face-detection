import mongoose, { Schema, Document } from 'mongoose';

export interface profilePictureInterface extends Document {
  name: string;
  email: string;
  password: string;
  gender?:string
  profilePicture?:string
  role:number
}

const profilePictureSchema: Schema = new Schema(
  {
    image: { type: String, required: true },
    user :{ type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  },
  { timestamps: true }
);

export default mongoose.model<profilePictureInterface>('profilePicture', profilePictureSchema);
