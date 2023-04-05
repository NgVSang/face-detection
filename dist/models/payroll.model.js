import mongoose, { Schema } from 'mongoose';
const PayrollSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    baseSalary: { type: Number, required: true },
    timeRequired: { type: Number, required: true },
    timeWork: { type: Number, required: true },
    leaveTime: { type: Number, required: true },
    fined: { type: Number, required: false, default: 0 },
    paytime: { type: Date, require: true },
    totalAmount: { type: Number, required: true },
});
export default mongoose.model('payroll', PayrollSchema);
//# sourceMappingURL=payroll.model.js.map