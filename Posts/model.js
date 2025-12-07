import mongoose, { mongo } from "mongoose";
import schema from "./schema.js";
const model = mongoose.model("posts", schema);
export default model;