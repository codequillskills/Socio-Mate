import express from 'express';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import {
  createPost,
  getPosts,
  likePost,
  commentOnPost,
  getUserPosts,
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

export default router; 