import React from 'react';

const PostsList = () => {
  const posts = [
    {
      userId: 'sujan_01',
      postId: 'pid-123',
      articleTitle: 'Article 14: Equality before law',
      opinionText: 'This is a great article, but I found a potential loophole regarding digital-only entities. We should discuss this.'
    },
    {
      userId: 'varun_23',
      postId: 'pid-456',
      articleTitle: 'Article 21: Protection of life and personal liberty',
      opinionText: 'The interpretation of "personal liberty" needs to be explicitly extended to include digital privacy and data ownership.'
    }
  ];

  const handleAgreeClick = (postId) => alert(`You agreed with post ${postId}`);
  const handleDisagreeClick = (postId) => alert(`You disagreed with post ${postId}`);
  const handleCommentClick = (postId) => alert(`Opening comment for post ${postId}`);

  return (
    <div className="py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">🏛️ Digital Constitution Posts</h2>
      <div className="grid gap-6">
        {posts.map((post) => (
          <div key={post.postId} className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition duration-300 border-l-4 border-blue-500">
            <header className="flex justify-between text-sm text-gray-500 mb-2">
              <span>User Id: {post.userId}</span>
              <span>Post Id: {post.postId}</span>
            </header>
            <h3 className="text-xl font-semibold mb-2 text-blue-700">{post.articleTitle}</h3>
            <p className="text-gray-600 mb-4">{post.opinionText}</p>
            <footer className="flex justify-start space-x-4 border-t border-gray-200 pt-4">
              <button 
                onClick={() => handleAgreeClick(post.postId)}
                className="bg-green-100 text-green-700 font-semibold py-2 px-4 rounded-lg transition duration-150 hover:bg-green-200"
              >
                Agree
              </button>
              <button 
                onClick={() => handleCommentClick(post.postId)}
                className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg transition duration-150 hover:bg-gray-300"
              >
                My opinion on this
              </button>
              <button 
                onClick={() => handleDisagreeClick(post.postId)}
                className="bg-red-100 text-red-700 font-semibold py-2 px-4 rounded-lg transition duration-150 hover:bg-red-200"
              >
                Disagree
              </button>
            </footer>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostsList;