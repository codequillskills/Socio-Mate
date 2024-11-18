import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import { FaImage, FaSmile, FaVideo } from 'react-icons/fa';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, [user]);

  const fetchPosts = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/posts', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !image) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append('content', content);
    if (image) {
      formData.append('image', image);
    }

    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/posts',
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setPosts([data, ...posts]);
      setContent('');
      setImage(null);
      setImagePreview('');
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts(posts.map(post => 
      post._id === updatedPost._id ? updatedPost : post
    ));
  };

  const handlePostDelete = async (postId) => {
    setPosts(posts.filter(post => post._id !== postId));
    await fetchPosts();
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Create Post Card */}
          <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={user.profilePicture || 'https://via.placeholder.com/40'}
                  alt={user.username}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-primary-light dark:ring-primary-dark"
                />
                <div className="flex-grow">
                  <button
                    onClick={() => document.getElementById('postContent').focus()}
                    className="w-full text-left px-4 py-3 rounded-full bg-background-light dark:bg-background-dark hover:bg-gray-100 dark:hover:bg-gray-700 text-text-secondary-light dark:text-text-secondary-dark transition-colors duration-200"
                  >
                    What's on your mind, {user.username}?
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                  id="postContent"
                  className="w-full p-4 rounded-xl bg-background-light dark:bg-background-dark border-none
                    text-text-primary-light dark:text-text-primary-dark placeholder-text-secondary-light 
                    dark:placeholder-text-secondary-dark resize-none focus:ring-1 focus:ring-primary-light 
                    dark:focus:ring-primary-dark transition-all duration-200 min-h-[100px]"
                  placeholder="Share your thoughts..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                
                {imagePreview && (
                  <div className="relative rounded-xl overflow-hidden bg-background-light dark:bg-background-dark p-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full rounded-lg object-cover max-h-[400px]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImage(null);
                        setImagePreview('');
                      }}
                      className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full 
                        hover:bg-red-600 transition-colors duration-200 shadow-lg"
                    >
                      ✕
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-background-light 
                      dark:hover:bg-background-dark cursor-pointer transition-colors duration-200 group">
                      <FaImage className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform duration-200" />
                      <span className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                    <button
                      type="button"
                      className="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-background-light 
                        dark:hover:bg-background-dark transition-colors duration-200 group"
                    >
                      <FaVideo className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform duration-200" />
                      <span className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Video</span>
                    </button>
                    <button
                      type="button"
                      className="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-background-light 
                        dark:hover:bg-background-dark transition-colors duration-200 group"
                    >
                      <FaSmile className="w-5 h-5 text-yellow-500 group-hover:scale-110 transition-transform duration-200" />
                      <span className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Feeling</span>
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading || (!content.trim() && !image)}
                    className="px-6 py-2.5 bg-primary-light text-white rounded-full font-medium
                      hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed
                      transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105
                      disabled:hover:scale-100"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Posting...</span>
                      </div>
                    ) : (
                      'Post'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Posts Feed */}
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
                No Posts Yet
              </h3>
              <p className="text-text-secondary-light dark:text-text-secondary-dark">
                Be the first to share something with your network!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
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