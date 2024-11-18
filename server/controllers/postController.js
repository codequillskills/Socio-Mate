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
      
    res.status(201).json(populatedPost);
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
    res.json(posts);
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
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.comments.push({
      user: req.user._id,
      content,
    });

    await post.save();
    
    const updatedPost = await Post.findById(post._id)
      .populate('user', 'username profilePicture')
      .populate('comments.user', 'username profilePicture');
      
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId })
      .populate('user', 'username profilePicture')
      .populate('comments.user', 'username profilePicture')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 