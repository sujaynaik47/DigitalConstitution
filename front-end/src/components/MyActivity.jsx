import React, { useEffect, useState } from 'react';

const MyActivity = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get current user from localStorage
    const getUserData = () => {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const userData = JSON.parse(userStr);
          setUser(userData);
          return userData;
        }
      } catch (err) {
        console.error('Error loading user:', err);
      }
      return null;
    };

    const fetchMyPosts = async () => {
      const currentUser = getUserData();
      
      if (!currentUser || !currentUser.userId) {
        setError('Please log in to view your posts');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/posts/user/${currentUser.userId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch your posts');
        }

        const data = await response.json();
        setPosts(data.posts || []);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError(err.message || 'Failed to load your posts');
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">💬 My Recent Activity</h2>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">💬 My Recent Activity</h2>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">💬 My Recent Activity</h2>
      
      {user && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600">Showing posts by</p>
          <p className="font-semibold text-gray-800">{user.userId}</p>
        </div>
      )}

      {posts.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600 text-lg mb-2">No posts yet</p>
          <p className="text-gray-500 text-sm">Start sharing your opinions on constitutional articles!</p>
        </div>
      ) : (
        <div className="space-y-6">
          <p className="text-sm text-gray-600 mb-4">
            Total posts: <span className="font-semibold text-gray-800">{posts.length}</span>
          </p>
          
          {posts.map((post) => (
            <div 
              key={post.postId} 
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
                      {post.articleNumber}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">
                      ID: {post.postId}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {post.articleTitle}
                  </h3>
                </div>
              </div>

              {/* Content */}
              <p className="text-gray-700 mb-4 leading-relaxed">
                {post.content}
              </p>

              {/* Stats */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 font-semibold">
                      👍 {post.agreeCount}
                    </span>
                    <span className="text-xs text-gray-500">Agree</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-600 font-semibold">
                      👎 {post.disagreeCount}
                    </span>
                    <span className="text-xs text-gray-500">Disagree</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 font-semibold">
                      💬 {post.posts?.length || 0}
                    </span>
                    <span className="text-xs text-gray-500">Comments</span>
                  </div>
                </div>
                
                <span className="text-xs text-gray-500">
                  Posted: {formatDate(post.createdAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyActivity;
