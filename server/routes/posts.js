import express from "express";
import { getFeedPosts, getUserPosts, likePost, Comment } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);

router.put("/comment/post" , verifyToken , Comment);

export default router;
