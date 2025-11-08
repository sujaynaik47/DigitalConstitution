import React, { useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import PostCard from './PostCard';

const MyActivity = () => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        // Get current user from localStorage
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData || !userData.userId) {
          setError('You must be logged in to view your activity');
          setLoading(false);
          return;
        }
        setUser(userData);

        console.log('Fetching posts for user:', userData.userId);

        const res = await fetch(`http://localhost:5000/api/posts/user/${userData.userId}`, {
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${userData.token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || `Status ${res.status}`);
        }

        const data = await res.json();
        console.log('My posts data:', data);
        setPosts(data.posts || []);
      } catch (err) {
        console.error('Failed to load my posts', err);
        setError(`Failed to load your posts: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, []);

  const callVote = async (postId, type) => {
    if (!user) {
      alert('Please log in first');
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/posts/${postId}/${type}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || `Error ${res.status}`);

      // Update local UI
      setPosts((prev) =>
        prev.map((p) => {
          if (p.postId !== postId) return p;
          return {
            ...p,
            agreeCount: data.agreeCount,
            disagreeCount: data.disagreeCount,
            userVote: type,
          };
        })
      );
    } catch (err) {
      alert('Could not register your response: ' + (err.message || err));
    }
  };

  const handleAgreeClick = (postId) => callVote(postId, 'agree');
  const handleDisagreeClick = (postId) => callVote(postId, 'disagree');

  const handlePostClick = async (postId) => {
    const text = window.prompt('Share your post/comment (short):');
    if (!text) return;
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${postId}/post`, {
        method: 'POST',
        credentials: 'include',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ text }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
      alert('Post submitted');
    } catch (err) {
      alert('Failed to submit post: ' + (err.message || err));
    }
  };

  if (loading) {
    return (
      <div className="py-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p className="mt-2 text-gray-600">Loading your posts…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="flex items-center gap-3 mb-6 border-b pb-3">
        <FaUser className="text-3xl text-blue-500" />
        <h2 className="text-3xl font-bold text-gray-800">
          My Activity
        </h2>
      </div>
      
      <p className="text-sm text-gray-600 mb-6">
        {posts.length} {posts.length === 1 ? 'post' : 'posts'} created by you
      </p>

      {posts.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <FaUser className="text-5xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 text-lg">You haven't created any posts yet.</p>
          <p className="text-gray-500 text-sm mt-2">
            Start by creating your first post!
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {posts.map((post) => (
            <PostCard
              key={post.postId}
              post={post}
              onAgree={handleAgreeClick}
              onDisagree={handleDisagreeClick}
              onComment={handlePostClick}
              showTrendingBadge={false}
              showInteractionButtons={true}
              userRole={post.userId?.role} // Pass user role from populated data
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyActivity;