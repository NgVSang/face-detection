import mongoose, { Schema } from 'mongoose';
const profilePictureSchema = new Schema({
    image: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
}, { timestamps: true });
export default mongoose.model('profilePicture', profilePictureSchema);
//# sourceMappingURL=profilePicture.model.js.map