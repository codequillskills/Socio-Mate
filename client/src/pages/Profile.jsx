import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaCamera, FaEdit, FaUserPlus, FaUserCheck } from 'react-icons/fa';
import PostCard from '../components/PostCard';

export default function Profile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    bio: '',
    profilePicture: null
  });
  const [previewImage, setPreviewImage] = useState('');
  const { user } = useAuth();
  const isOwnProfile = user?._id === id;

  useEffect(() => {
    fetchProfile();
    fetchUserPosts();
  }, [id, user]);

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/users/profile/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setProfile(data);
      setEditForm({
        username: data.username,
        bio: data.bio || '',
        profilePicture: null
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/posts/user/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setUserPosts(data);
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditForm({ ...editForm, profilePicture: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('username', editForm.username);
    formData.append('bio', editForm.bio);
    if (editForm.profilePicture) {
      formData.append('profilePicture', editForm.profilePicture);
    }

    try {
      const { data } = await axios.put(
        'http://localhost:5000/api/users/profile',
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setProfile(data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleFollow = async () => {
    try {
      const { data } = await axios.put(
        `http://localhost:5000/api/users/${id}/follow`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setProfile(data);
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handlePostUpdate = (updatedPost) => {
    setUserPosts(userPosts.map(post => 
      post._id === updatedPost._id ? updatedPost : post
    ));
  };

  const handlePostDelete = async (postId) => {
    setUserPosts(userPosts.filter(post => post._id !== postId));
    await fetchUserPosts();
  };

  const isFollowing = profile?.followers.some(follower => follower._id === user._id);

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-light"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Cover Photo */}
          <div className="h-48 bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark"></div>
          
          {/* Profile Info */}
          <div className="relative px-6 py-4">
            {/* Profile Picture */}
            <div className="absolute -top-16 left-6">
              <div className="relative group">
                <img
                  src={previewImage || profile.profilePicture || 'https://via.placeholder.com/128'}
                  alt={profile.username}
                  className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 object-cover"
                />
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-primary-light dark:bg-primary-dark p-2 rounded-full cursor-pointer group-hover:bg-primary-dark dark:group-hover:bg-primary-light transition-colors">
                    <FaCamera className="text-white" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Profile Actions */}
            <div className="ml-40 flex justify-between items-center">
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                    className="text-2xl font-bold bg-transparent border-b-2 border-primary-light dark:border-primary-dark focus:outline-none"
                  />
                ) : (
                  <h1 className="text-2xl font-bold">{profile.username}</h1>
                )}
                <p className="text-gray-600 dark:text-gray-400">
                  {`${profile.followers.length} followers · ${profile.following.length} following`}
                </p>
              </div>
              
              {isOwnProfile ? (
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <FaEdit />
                  <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
                </button>
              ) : (
                <button
                  onClick={handleFollow}
                  className={`flex items-center space-x-2 px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                    isFollowing 
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400'
                      : 'bg-primary-light dark:bg-primary-dark text-white hover:opacity-90'
                  } transform hover:scale-105 shadow-md`}
                >
                  {isFollowing ? (
                    <>
                      <FaUserCheck className="w-5 h-5" />
                      <span>Unfollow</span>
                    </>
                  ) : (
                    <>
                      <FaUserPlus className="w-5 h-5" />
                      <span>Follow</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Bio */}
            <div className="mt-6">
              {isEditing ? (
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  placeholder="Write something about yourself..."
                  className="w-full p-2 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
                  rows="3"
                />
              ) : (
                <p className="text-gray-700 dark:text-gray-300">{profile.bio || 'No bio yet'}</p>
              )}
            </div>

            {/* Save Button */}
            {isEditing && (
              <div className="mt-4 flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setPreviewImage('');
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="btn-primary"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>

        {/* User Posts */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            {isOwnProfile ? 'Your Posts' : `${profile.username}'s Posts`}
            <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">
              ({userPosts.length})
            </span>
          </h2>
          
          {userPosts.length === 0 ? (
            <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow">
              <p className="text-gray-500 dark:text-gray-400">
                {isOwnProfile 
                  ? "You haven't posted anything yet."
                  : `${profile.username} hasn't posted anything yet.`
                }
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {userPosts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  onPostUpdate={handlePostUpdate}
                  onPostDelete={handlePostDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 