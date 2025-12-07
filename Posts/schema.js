import mongoose from "mongoose";
const postSchema = new mongoose.Schema({
    text: String,
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "users" },  
    date: Date,
    photo: String,
    location_lat: Number,
    location_long: Number,
    place_id: String
});
export default postSchema;