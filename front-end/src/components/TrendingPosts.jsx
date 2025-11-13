// TrendingPosts.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFire } from 'react-icons/fa';
import PostCard from './PostCard';

const TrendingPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get current logged-in user from localStorage
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);

    const fetchTrending = async () => {
      try {
        console.log('Fetching trending posts from: http://localhost:5000/api/posts/trending');
        
        const res = await fetch('http://localhost:5000/api/posts/trending', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Response status:', res.status);
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          console.error('Error response:', errorData);
          throw new Error(errorData.message || `Status ${res.status}`);
        }
        
        const data = await res.json();
        console.log('Trending posts data:', data);
        setPosts(data.posts || []);
      } catch (err) {
        console.error('Failed to load trending posts', err);
        setError(`Failed to load trending posts: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTrending();
  }, []);

  // Handle agree/disagree votes
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
          'Authorization': `Bearer ${user.userId}`
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

  const handlePostClick = (postId) => {
    // Find the post to get article number
    const post = posts.find(p => p.postId === postId);
    if (!post) {
      alert('Post not found');
      return;
    }

    // Store the reference post in localStorage for Constitution page to pick up
    localStorage.setItem('referencePost', JSON.stringify({
      postId: post.postId,
      articleNumber: post.articleNumber,
      articleTitle: post.articleTitle,
      content: post.content,
      userId: post.userId?.userId || post.userId,
      userRole: post.userId?.role
    }));

    // Navigate to constitution page with article number
    navigate(`/constitution?article=${post.articleNumber}&ref=${postId}`);
  };

  if (loading) {
    return (
      <div className="py-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        <p className="mt-2 text-gray-600">Loading trending posts…</p>
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
        <FaFire className="text-3xl text-orange-500" />
        <h2 className="text-3xl font-bold text-gray-800">
          Trending Posts
        </h2>
      </div>
      
      <p className="text-sm text-gray-600 mb-6">
        Posts with the most interactions in the last 48 hours
      </p>

      {posts.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <FaFire className="text-5xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 text-lg">No trending posts yet.</p>
          <p className="text-gray-500 text-sm mt-2">
            Be the first to create engaging content!
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {posts.map((post, index) => (
            <PostCard
              key={post.postId}
              post={post}
              index={index}
              showTrendingBadge={true}
              showInteractionButtons={true}
              userRole={post.userId?.role}
              onAgree={handleAgreeClick}
              onDisagree={handleDisagreeClick}
              onComment={handlePostClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TrendingPosts;
