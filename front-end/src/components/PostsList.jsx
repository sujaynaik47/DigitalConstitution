// PostList.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PostCard from './PostCard';

const PostsList = () => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Get current logged-in user from localStorage
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) {
      setError('You must be logged in to view posts');
      setLoading(false);
      return;
    }
    setUser(userData);

    const fetchPosts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/posts', { 
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${userData.userId}`,
            'Content-Type': 'application/json'
          }
        });
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        setPosts(data.posts || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
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

  if (loading) return <div className="py-8">Loading posts…</div>;
  if (error) return <div className="py-8 text-red-600">{error}</div>;

  return (
    <div className="py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
        🏛️ Digital Constitution Posts
      </h2>
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
            userRole={post.userId?.role}
          />
        ))}
      </div>
    </div>
  );
};

export default PostsList;

