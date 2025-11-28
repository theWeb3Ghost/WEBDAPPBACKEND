import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    uid: { type: String, required: true },
    username: { type: String, unique: true },
    address: { type: String, required: true },
    privateKey: { type: String, required: true },
    claimed: { type: Boolean, default: false },
    balance: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model("User", UserSchema);
