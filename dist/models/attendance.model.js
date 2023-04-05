import mongoose, { Schema } from 'mongoose';
const AttendanceSchema = new Schema({
    type: { type: Number, require: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    date: { type: String, require: true }
}, { timestamps: true });
export default mongoose.model('attendances', AttendanceSchema);
//# sourceMappingURL=attendance.model.js.map