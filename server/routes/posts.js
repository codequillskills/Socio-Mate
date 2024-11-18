import express from 'express';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import {
  createPost,
  getPosts,
  likePost,
  commentOnPost,
  getUserPosts,
  deletePost,
  deleteComment,
} from '../controllers/postController.js';

const router = express.Router();

router.route('/')
  .get(protect, getPosts)
  .post(protect, upload.single('image'), createPost);

router.route('/user/:userId')
  .get(protect, getUserPosts);

router.route('/:id/like')
  .put(protect, likePost);

router.route('/:id/comment')
  .post(protect, commentOnPost);

router.route('/:id')
  .delete(protect, deletePost);

router.route('/:postId/comments/:commentId')
  .delete(protect, deleteComment);

export default router; 