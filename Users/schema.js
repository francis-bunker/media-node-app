import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    user_type: { type: String, enum: ["regular", "admin"], default: "regular" },
}, { collection: "users" });
export default userSchema;