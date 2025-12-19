import mongoose from "mongoose";
import usersSchema from "../Users/schema.js";
import userSchema from "../Users/schema.js";
const postSchema = new mongoose.Schema({
    text: String,
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "users" },  
    date: Date,
    photo: String,
    location_lat: Number,
    location_long: Number,
    place_id: String,
    place_name: String
});
export default postSchema;