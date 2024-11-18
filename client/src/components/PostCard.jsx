import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaComment, FaShare, FaTrash, FaImage } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

export default function PostCard({ post, onPostUpdate, onPostDelete }) {
  const [isLiked, setIsLiked] = useState(post.likes.includes(useAuth().user?._id));
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const { user } = useAuth();
  const isPostOwner = post.user._id === user._id;

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

      const processedData = {
        ...data,
        comments: data.comments.map(comment => ({
          ...comment,
          user: {
            ...comment.user,
            profilePicture: comment.user.profilePicture 
              ? (comment.user.profilePicture.startsWith('http') 
                ? comment.user.profilePicture 
                : `http://localhost:5000${comment.user.profilePicture}`)
              : null
          }
        }))
      };

      onPostUpdate(processedData);
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

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/posts/${post._id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (response.status === 200) {
        await onPostDelete(post._id);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:5000/api/posts/${post._id}/comments/${commentId}`,
        {
          headers: { Authorization: `Bearer ${user.token}` }
        }
      );

      if (data.user.profilePicture && !data.user.profilePicture.startsWith('http')) {
        data.user.profilePicture = `http://localhost:5000${data.user.profilePicture}`;
      }
      data.comments = data.comments.map(comment => {
        if (comment.user.profilePicture && !comment.user.profilePicture.startsWith('http')) {
          comment.user.profilePicture = `http://localhost:5000${comment.user.profilePicture}`;
        }
        return comment;
      });

      onPostUpdate(data);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const confirmDelete = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl">
            <h1 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Delete Post</h1>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                No, Cancel
              </button>
              <button
                onClick={() => {
                  handleDelete();
                  onClose();
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        );
      }
    });
  };

  const confirmDeleteComment = (commentId, commentUsername) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl">
            <h1 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Delete Comment</h1>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete this comment by {commentUsername}?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                No, Cancel
              </button>
              <button
                onClick={() => {
                  handleDeleteComment(commentId);
                  onClose();
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        );
      }
    });
  };

  const isCommentOwner = (commentUserId) => {
    return commentUserId === user._id;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 p-6 mb-6 border border-gray-100 dark:border-gray-700 animate-fadeIn">
      {/* Enhanced Post Header */}
      <div className="flex justify-between items-center mb-6">
        <Link 
          to={`/profile/${post.user._id}`} 
          className="flex items-center space-x-4 group"
        >
          <div className="relative transform group-hover:scale-110 transition-transform duration-200">
            <img
              src={post.user.profilePicture || 'https://via.placeholder.com/40'}
              alt={post.user.username}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-primary-light dark:ring-primary-dark ring-offset-2 dark:ring-offset-gray-800 group-hover:ring-secondary-light dark:group-hover:ring-secondary-dark transition-all duration-200 shadow-md"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/40?text=User';
              }}
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full ring-2 ring-white dark:ring-gray-800"></div>
          </div>
          <div className="transform group-hover:translate-x-2 transition-transform duration-200">
            <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-primary-light dark:group-hover:text-primary-dark">
              {post.user.username}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(post.createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </Link>
        {isPostOwner && (
          <button
            onClick={confirmDelete}
            className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors rounded-full hover:bg-red-100 dark:hover:bg-red-900/20 transform hover:rotate-12 transition-all duration-200"
          >
            <FaTrash className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Enhanced Post Content */}
      <div className="space-y-4">
        <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed">
          {post.content}
        </p>
        
        {/* Enhanced Post Image */}
        {post.image && (
          <div className="relative rounded-xl overflow-hidden shadow-lg group">
            <img
              src={post.image}
              alt="Post content"
              className="w-full object-cover max-h-[32rem] transform group-hover:scale-[1.02] transition-transform duration-500"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-4 right-4 bg-black/50 p-3 rounded-full backdrop-blur-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <FaImage className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Post Actions */}
      <div className="flex items-center justify-between border-t border-b dark:border-gray-700 py-4 my-6">
        <button
          onClick={handleLike}
          className="flex items-center space-x-2 group"
        >
          {isLiked ? (
            <FaHeart className="w-6 h-6 text-red-500 transform group-hover:scale-125 transition-transform duration-200" />
          ) : (
            <FaRegHeart className="w-6 h-6 text-gray-500 dark:text-gray-400 group-hover:text-red-500 transform group-hover:scale-125 transition-all duration-200" />
          )}
          <span className={`font-medium ${isLiked ? 'text-red-500' : 'text-gray-500 dark:text-gray-400 group-hover:text-red-500'} transition-colors duration-200`}>
            {likesCount}
          </span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 group"
        >
          <FaComment className="w-6 h-6 transform group-hover:scale-125 transition-transform duration-200" />
          <span className="font-medium group-hover:text-blue-500 transition-colors duration-200">
            {post.comments.length}
          </span>
        </button>
        <button
          onClick={handleShare}
          className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-green-500 group"
        >
          <FaShare className="w-6 h-6 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-200" />
        </button>
      </div>

      {/* Enhanced Comments Section */}
      {showComments && (
        <div className="space-y-6 animate-slideIn">
          {/* Enhanced Comment Form */}
          <form onSubmit={handleComment} className="flex space-x-3">
            <div className="flex-shrink-0 transform hover:scale-105 transition-transform duration-200">
              <img
                src={user.profilePicture || 'https://via.placeholder.com/32'}
                alt={user.username}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700 ring-offset-2 dark:ring-offset-gray-800 shadow-md"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/32?text=User';
                }}
              />
            </div>
            <div className="flex-grow flex space-x-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-grow rounded-full border dark:border-gray-700 dark:bg-gray-700/50 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-inner"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-primary-light dark:bg-primary-dark text-white rounded-full hover:bg-primary-dark dark:hover:bg-primary-light transition-colors transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
              >
                Post
              </button>
            </div>
          </form>

          {/* Enhanced Comments List */}
          <div className="space-y-4">
            {post.comments.map((comment) => {
              const profilePicture = comment.user.profilePicture
                ? (comment.user.profilePicture.startsWith('http')
                  ? comment.user.profilePicture
                  : `http://localhost:5000${comment.user.profilePicture}`)
                : 'https://via.placeholder.com/32?text=User';

              return (
                <div key={comment._id} className="flex space-x-3 group animate-fadeIn">
                  <Link 
                    to={`/profile/${comment.user._id}`} 
                    className="flex-shrink-0 transform group-hover:scale-105 transition-transform duration-200"
                  >
                    <img
                      src={profilePicture}
                      alt={comment.user.username}
                      className={`w-10 h-10 rounded-full object-cover ring-2 ${
                        comment.user._id === user._id
                          ? 'ring-primary-light dark:ring-primary-dark'
                          : 'ring-gray-200 dark:ring-gray-700'
                      } ring-offset-2 dark:ring-offset-gray-800 shadow-md`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/32?text=User';
                      }}
                    />
                  </Link>
                  <div className="flex-grow">
                    <div className={`rounded-2xl p-4 relative shadow-md transform hover:-translate-y-1 transition-transform duration-200 ${
                      comment.user._id === user._id
                        ? 'bg-primary-light/10 dark:bg-primary-dark/10 border border-primary-light/20 dark:border-primary-dark/20'
                        : 'bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600'
                    }`}>
                      <Link 
                        to={`/profile/${comment.user._id}`}
                        className="font-bold text-gray-900 dark:text-white hover:underline"
                      >
                        {comment.user.username}
                        {comment.user._id === user._id && 
                          <span className="ml-2 text-xs font-normal text-primary-light dark:text-primary-dark">
                            (You)
                          </span>
                        }
                      </Link>
                      <div className="text-gray-700 dark:text-gray-300 mt-1">
                        {comment.content}
                      </div>
                      {/* Enhanced Delete button */}
                      {(isPostOwner || comment.user._id === user._id) && (
                        <button
                          onClick={() => confirmDeleteComment(comment._id, comment.user.username)}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-all transform hover:scale-110 hover:rotate-12"
                        >
                          <FaTrash className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-3">
                      {new Date(comment.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
} 