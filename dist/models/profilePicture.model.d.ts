import mongoose, { Document } from 'mongoose';
export interface profilePictureInterface extends Document {
    name: string;
    email: string;
    password: string;
    gender?: string;
    profilePicture?: string;
    role: number;
}
declare const _default: mongoose.Model<profilePictureInterface, {}, {}, {}, mongoose.Document<unknown, {}, profilePictureInterface> & Omit<profilePictureInterface & {
    _id: mongoose.Types.ObjectId;
}, never>, any>;
export default _default;
