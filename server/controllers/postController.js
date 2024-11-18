import fs from 'fs';
import Post from '../models/Post.js';

export const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.create({
      user: req.user._id,
      content,
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });

    const populatedPost = await Post.findById(post._id)
      .populate('user', 'username profilePicture')
      .populate('comments.user', 'username profilePicture');

    const postObject = populatedPost.toObject();
    if (postObject.image) {
      postObject.image = `http://localhost:5000${postObject.image}`;
    }
    if (postObject.user.profilePicture) {
      postObject.user.profilePicture = `http://localhost:5000${postObject.user.profilePicture}`;
    }

    res.status(201).json(postObject);
  } catch (error) {
    console.error('Error in createPost:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'username profilePicture')
      .populate('comments.user', 'username profilePicture')
      .sort({ createdAt: -1 });

    const postsWithFullUrls = posts.map(post => {
      const postObject = post.toObject();
      if (postObject.image) {
        postObject.image = `http://localhost:5000${postObject.image}`;
      }
      if (postObject.user.profilePicture) {
        postObject.user.profilePicture = `http://localhost:5000${postObject.user.profilePicture}`;
      }
      postObject.comments = postObject.comments.map(comment => {
        if (comment.user.profilePicture) {
          comment.user.profilePicture = `http://localhost:5000${comment.user.profilePicture}`;
        }
        return comment;
      });
      return postObject;
    });

    res.json(postsWithFullUrls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const alreadyLiked = post.likes.includes(req.user._id);
    
    if (alreadyLiked) {
      post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();
    
    const updatedPost = await Post.findById(post._id)
      .populate('user', 'username profilePicture')
      .populate('comments.user', 'username profilePicture');
      
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const commentOnPost = async (req, res) => {
  try {
    const { content } = req.body;
    
    // First find the post and add the comment
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Add the new comment
    post.comments.push({
      user: req.user._id,
      content,
    });
    await post.save();

    // Fetch the complete post with all populated fields
    const populatedPost = await Post.findById(post._id)
      .populate({
        path: 'user',
        select: 'username profilePicture'
      })
      .populate({
        path: 'comments.user',
        select: 'username profilePicture'
      });

    // Convert to plain object and add full URLs
    const postObject = populatedPost.toObject();

    // Add full URL to post image
    if (postObject.image) {
      postObject.image = `http://localhost:5000${postObject.image}`;
    }

    // Add full URL to post owner's profile picture
    if (postObject.user.profilePicture) {
      postObject.user.profilePicture = `http://localhost:5000${postObject.user.profilePicture}`;
    }

    // Add full URLs to all comment user profile pictures
    postObject.comments = postObject.comments.map(comment => ({
      ...comment,
      user: {
        ...comment.user,
        profilePicture: comment.user.profilePicture
          ? `http://localhost:5000${comment.user.profilePicture}`
          : null
      }
    }));

    // Send the complete response
    res.json(postObject);
  } catch (error) {
    console.error('Error in commentOnPost:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId })
      .populate('user', 'username profilePicture')
      .populate('comments.user', 'username profilePicture')
      .sort({ createdAt: -1 });

    const postsWithFullUrls = posts.map(post => {
      const postObject = post.toObject();
      if (postObject.image) {
        postObject.image = `http://localhost:5000${postObject.image}`;
      }
      if (postObject.user.profilePicture) {
        postObject.user.profilePicture = `http://localhost:5000${postObject.user.profilePicture}`;
      }
      postObject.comments = postObject.comments.map(comment => {
        if (comment.user.profilePicture) {
          comment.user.profilePicture = `http://localhost:5000${comment.user.profilePicture}`;
        }
        return comment;
      });
      return postObject;
    });

    res.json(postsWithFullUrls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'User not authorized to delete this post' });
    }

    if (post.image) {
      const imagePath = post.image.replace('http://localhost:5000', '.');
      try {
        fs.unlinkSync(imagePath);
      } catch (err) {
        console.error('Error deleting image file:', err);
      }
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error in deletePost:', error);
    res.status(500).json({ message: 'Error deleting post' });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Find the comment
    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is post owner or comment owner
    const isPostOwner = post.user.toString() === req.user._id.toString();
    const isCommentOwner = comment.user.toString() === req.user._id.toString();

    if (!isPostOwner && !isCommentOwner) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    // Remove the comment
    post.comments = post.comments.filter(c => c._id.toString() !== req.params.commentId);
    await post.save();

    // Get updated post with populated fields
    const updatedPost = await Post.findById(post._id)
      .populate('user', 'username profilePicture')
      .populate('comments.user', 'username profilePicture');

    // Add full URLs to the response
    const postObject = updatedPost.toObject();
    if (postObject.image) {
      postObject.image = `http://localhost:5000${postObject.image}`;
    }
    if (postObject.user.profilePicture) {
      postObject.user.profilePicture = `http://localhost:5000${postObject.user.profilePicture}`;
    }
    postObject.comments = postObject.comments.map(comment => {
      if (comment.user.profilePicture) {
        comment.user.profilePicture = `http://localhost:5000${comment.user.profilePicture}`;
      }
      return comment;
    });

    res.json(postObject);
  } catch (error) {
    console.error('Error in deleteComment:', error);
    res.status(500).json({ message: error.message });
  }
}; 