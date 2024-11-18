import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaComment, FaShare, FaEllipsisV } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function PostCard({ post, onPostUpdate }) {
  const [isLiked, setIsLiked] = useState(post.likes.includes(useAuth().user?._id));
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const { user } = useAuth();

  const handleLike = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/posts/${post._id}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${user.token}` }
        }
      );
      setIsLiked(!isLiked);
      setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const { data } = await axios.post(
        `http://localhost:5000/api/posts/${post._id}/comment`,
        { content: newComment },
        {
          headers: { Authorization: `Bearer ${user.token}` }
        }
      );
      onPostUpdate(data);
      setNewComment('');
    } catch (error) {
      console.error('Error commenting:', error);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `Post by ${post.user.username}`,
        text: post.content,
        url: window.location.href
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-4">
      {/* Post Header */}
      <div className="flex justify-between items-center mb-4">
        <Link to={`/profile/${post.user._id}`} className="flex items-center space-x-3">
          <img
            src={post.user.profilePicture || 'https://via.placeholder.com/40'}
            alt={post.user.username}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{post.user.username}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </Link>
        <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
          <FaEllipsisV />
        </button>
      </div>

      {/* Post Content */}
      <p className="text-gray-800 dark:text-gray-200 mb-4">{post.content}</p>
      
      {/* Post Image */}
      {post.image && (
        <div className="mb-4">
          <img
            src={post.image}
            alt="Post content"
            className="rounded-lg w-full object-cover max-h-96"
          />
        </div>
      )}

      {/* Post Actions */}
      <div className="flex items-center justify-between border-t border-b dark:border-gray-700 py-2 mb-4">
        <button
          onClick={handleLike}
          className="flex items-center space-x-2 text-gray-500 hover:text-red-500 dark:text-gray-400"
        >
          {isLiked ? (
            <FaHeart className="text-red-500" />
          ) : (
            <FaRegHeart />
          )}
          <span>{likesCount}</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 dark:text-gray-400"
        >
          <FaComment />
          <span>{post.comments.length}</span>
        </button>
        <button
          onClick={handleShare}
          className="flex items-center space-x-2 text-gray-500 hover:text-green-500 dark:text-gray-400"
        >
          <FaShare />
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="space-y-4">
          {/* Comment Form */}
          <form onSubmit={handleComment} className="flex space-x-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 rounded-lg border dark:border-gray-700 dark:bg-gray-700 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-primary-light dark:bg-primary-dark text-white rounded-lg hover:bg-primary-dark dark:hover:bg-primary-light transition-colors"
            >
              Post
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-3">
            {post.comments.map((comment, index) => (
              <div key={index} className="flex space-x-3 text-sm">
                <img
                  src={comment.user.profilePicture || 'https://via.placeholder.com/32'}
                  alt={comment.user.username}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {comment.user.username}
                  </div>
                  <div className="text-gray-700 dark:text-gray-300">
                    {comment.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 