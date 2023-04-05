import mongoose, { Schema } from 'mongoose';
const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: { type: String, required: false },
    phoneNumber: { type: String, require: false },
    profilePicture: { type: String, required: false, default: "images/default.jpg" },
    payrolls: [{ type: mongoose.Schema.Types.ObjectId, ref: 'payroll' }],
    workings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'working' }],
    attendances: [{ type: mongoose.Schema.Types.ObjectId, ref: 'attendances' }],
    imageTraining: [{ type: String, required: false }],
    baseSalary: { type: Number, required: false, default: 3500000 },
    faceDescriptors: [{ type: [], required: false }],
    role: { type: Number, required: false, default: 1 },
}, { timestamps: true });
export default mongoose.model('users', UserSchema);
//# sourceMappingURL=users.model.js.map