import mongoose, { Schema } from 'mongoose';
const workingSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    date: { type: String, require: true },
    timeWork: { type: Number, require: true },
}, { timestamps: true });
export default mongoose.model('working', workingSchema);
//# sourceMappingURL=working.model.js.map