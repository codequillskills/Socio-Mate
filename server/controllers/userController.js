import User from '../models/User.js';

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('followers', 'username profilePicture')
      .populate('following', 'username profilePicture');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userObject = user.toObject();
    if (userObject.profilePicture) {
      userObject.profilePicture = `http://localhost:5000${userObject.profilePicture}`;
    }

    res.json(userObject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { username, bio } = req.body;
    const user = await User.findById(req.user._id);

    if (user) {
      user.username = username || user.username;
      user.bio = bio || user.bio;
      
      if (req.file) {
        const profilePicturePath = `/uploads/${req.file.filename}`;
        user.profilePicture = profilePicturePath;
      }
      
      const updatedUser = await user.save();
      
      const responseUser = {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        bio: updatedUser.bio,
        profilePicture: updatedUser.profilePicture ? `http://localhost:5000${updatedUser.profilePicture}` : null,
        followers: updatedUser.followers,
        following: updatedUser.following,
      };

      res.json(responseUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isFollowing = currentUser.following.includes(req.params.id);

    if (isFollowing) {
      currentUser.following = currentUser.following.filter(id => id.toString() !== req.params.id);
      userToFollow.followers = userToFollow.followers.filter(id => id.toString() !== req.user._id.toString());
    } else {
      currentUser.following.push(req.params.id);
      userToFollow.followers.push(req.user._id);
    }

    await currentUser.save();
    await userToFollow.save();

    const updatedUserToFollow = await User.findById(req.params.id)
      .select('-password')
      .populate('followers', 'username profilePicture')
      .populate('following', 'username profilePicture');

    const responseUser = updatedUserToFollow.toObject();
    if (responseUser.profilePicture) {
      responseUser.profilePicture = `http://localhost:5000${responseUser.profilePicture}`;
    }

    res.json(responseUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 