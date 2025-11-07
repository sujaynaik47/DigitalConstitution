import React, { useEffect, useState } from 'react';
import { FaThumbsUp, FaThumbsDown, FaCommentDots } from 'react-icons/fa';

const PostsList = () => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
        const res = await fetch('http://localhost:5000/api/posts', { credentials: 'include' });
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

  // ✅ Handles Agree or Disagree clicks
  const callVote = async (postId, type) => {
    if (!user) {
      alert('Please log in first');
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/posts/${postId}/${type}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || `Error ${res.status}`);

      // Update local UI: update counts and mark user's vote
      setPosts((prev) =>
        prev.map((p) => {
          if (p.postId !== postId) return p;
          return {
            ...p,
            agreeCount: data.agreeCount,
            disagreeCount: data.disagreeCount,
            userVote: type, // remember what user did
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
      alert('Post submitted');
    } catch (err) {
      alert('Failed to submit post: ' + (err.message || err));
    }
  };

  if (loading) return <div className="py-8">Loading posts…</div>;
  if (error) return <div className="py-8 text-red-600">{error}</div>;

  return (
    <div className="py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
        🏛️ Digital Constitution Posts
      </h2>
      <div className="grid gap-6">
        {posts.map((post) => {
          const userAgreed = post.userVote === 'agree';
          const userDisagreed = post.userVote === 'disagree';

          return (
            <div
              key={post.postId}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition duration-300 border-l-4 border-blue-500"
            >
              <header className="flex justify-between text-sm text-gray-500 mb-2">
                <span>User Id: {String(post.userId)}</span>
                <span>Post Id: {post.postId}</span>
              </header>

              <h3 className="text-xl font-semibold mb-2 text-blue-700">
                {post.articleTitle}
              </h3>
              <p className="text-gray-600 mb-4">{post.content}</p>

              <footer className="flex justify-start space-x-4 border-t border-gray-200 pt-4">
                {/* ✅ Agree button */}
                <button
                  onClick={() => handleAgreeClick(post.postId)}
                  className={`flex items-center space-x-2 font-semibold py-2 px-4 rounded-lg transition duration-150 ${
                    userAgreed
                      ? 'bg-green-600 text-white'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  <FaThumbsUp />
                  <span>{post.agreeCount ?? 0}</span>
                </button>

                {/* ✅ Comment / Post */}
                <button
                  onClick={() => handlePostClick(post.postId)}
                  className="flex items-center space-x-2 bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg transition duration-150 hover:bg-gray-300"
                >
                  <FaCommentDots />
                  <span>Post / Comment</span>
                </button>

                {/* ✅ Disagree button */}
                <button
                  onClick={() => handleDisagreeClick(post.postId)}
                  className={`flex items-center space-x-2 font-semibold py-2 px-4 rounded-lg transition duration-150 ${
                    userDisagreed
                      ? 'bg-red-600 text-white'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  }`}
                >
                  <FaThumbsDown />
                  <span>{post.disagreeCount ?? 0}</span>
                </button>
              </footer>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PostsList;
