import model from "./model.js";
import mongoose from "mongoose";

export default function PostsDao(db) {
    async function createPost(post) {
        const postToCreate = { ...post, date: new Date() };
        postToCreate.user_id = new mongoose.Types.ObjectId(post.user_id);
        const createdPost = await model.create(postToCreate);
        return createdPost.populate("user_id", "username");
    }
    const addLike = async (postId, userId) => {
        const post = await model.findById(postId);
        if (!post.likes.some((like) => like.user_id.toString() === userId)) {
            post.likes.push({ user_id: new mongoose.Types.ObjectId(userId) });
            await post.save();
        }
    };
    const findAllPosts = async () => model.find().populate("user_id", "username");
    const findPostById = async (postId) => model.findById(postId);
    const findPostByUserId = async (userId) => model.find({ user_id: userId }).populate("user_id", "username");
    const findPostByPlaceid = async (placeId) => model.find({ place_id: placeId }).populate("user_id", "username");
    const deletePost = async (postId) => model.findByIdAndDelete(postId);

    return {
        createPost,
        findAllPosts,
        findPostById,
        
        findPostByUserId,
        findPostByPlaceid,
        deletePost
    };
}
