import PostDao from "./dao.js";
export default function Posts(app, db) {
    const dao = PostDao(db);
    const findAllPosts = async (req, res) => {
        const posts = await dao.findAllPosts();
        res.send(posts);
    }
    const findPostById = async (req, res) => {
        const postId = await dao.findPostById(req.params.postId);
        res.send(postId);
    }
    const findPostByUserId = async (req, res) => {
        const userId = req.params.userId;
        const posts = await dao.findPostByUserId(userId);
        res.send(posts);
    }
    const findRecentPosts = async (req, res) => {
        const limit = parseInt(req.params.limit);
        const recentPosts = await dao.findRecentPosts(limit);
        res.send(recentPosts);
    }
    const createPost = async (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.status(401).json({ message: "You must be logged in to create a post." });
            return;
        }
        const post = req.body;
        const postToCreate = { ...post, user_id: currentUser._id };
        const newPost = await dao.createPost(postToCreate);
        res.status(201).json(newPost);
    }
    const findPostByPlaceid = async (req, res) => {
        const placeId = req.params.placeId;
        const posts = await dao.findPostByPlaceid(placeId);
        res.send(posts);
    }
    const deletePost = async (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.status(401).json({ message: "You must be logged in to delete a post." });
            return;
        }
        const postId = req.params.postId;
        const post = await dao.findPostById(postId);
        if (!post) {
            res.status(404).json({ message: "Post not found." });
            return;
        }
        if (post.user_id.toString() !== currentUser._id && currentUser.user_type !== "admin") {
            res.status(403).json({ message: "You are not authorized to delete this post." });
            return;
        }
        await dao.deletePost(postId);
        res.sendStatus(204);
    }
    const addLike = async (req, res) => {
        const currentUser = req.session["currentUser"];
        await dao.addLike(req.params.postId, currentUser._id);
        res.sendStatus(204);
    }
    app.post("/api/posts/:postId/like", addLike);
    app.delete("/api/posts/:postId", deletePost);
    app.get("/api/posts/place/:placeId", findPostByPlaceid);
    app.get("/api/posts/user/:userId", findPostByUserId);
    app.post("/api/posts", createPost);
    app.get("/api/posts", findAllPosts);
    app.get("/api/posts/recent/:limit", findRecentPosts);
    app.get("/api/posts/:postId", findPostById);
}