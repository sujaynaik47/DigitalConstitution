// TrendingPosts.jsx
import React from 'react';
import { useEffect, useState } from 'react';

const TrendingPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/trending-posts');
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        setPosts(data.posts || []);
      } catch (err) {
        console.error('Failed to load trending posts', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  if (loading) return <div className="py-8">Loading trending posts…</div>;

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-4">🔥 Trending posts (last 40 hours)</h2>
      {posts.length === 0 ? (
        <div className="text-gray-600">No trending posts yet.</div>
      ) : (
        <div className="grid gap-4">
          {posts.map(p => (
            <div key={p.postId} className="bg-white p-4 rounded shadow-sm">
              <div className="flex justify-between text-sm text-gray-500">
                <div>Article: {p.articleNumber}</div>
                <div>Post: {p.postId}</div>
              </div>
              <h3 className="font-semibold mt-2">{p.articleTitle}</h3>
              <p className="text-sm text-gray-600 mt-1">{p.content}</p>
              <div className="mt-2 text-sm text-gray-700">Recent interactions (last 40h): {p.recentResponses ?? 0} · Agree: {p.agreeCount ?? 0} · Disagree: {p.disagreeCount ?? 0}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrendingPosts;