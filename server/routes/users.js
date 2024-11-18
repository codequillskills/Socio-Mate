import express from 'express';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import {
  getProfile,
  updateProfile,
  followUser,
} from '../controllers/userController.js';

const router = express.Router();

router.route('/profile/:id')
  .get(protect, getProfile);

router.route('/profile')
  .put(protect, upload.single('profilePicture'), updateProfile);

router.route('/:id/follow')
  .put(protect, followUser);

export default router; 