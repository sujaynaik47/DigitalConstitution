import React from 'react';

const PostsList = () => {
  const articles = [
    { id: 1, title: "Article I: Digital Rights Charter", summary: "Defining the fundamental rights of citizens in the digital sphere." },
    { id: 2, title: "Article II: Data Sovereignty", summary: "Governing the ownership and control of personal and national data." },
    { id: 3, title: "Article III: AI Regulation Framework", summary: "Establishing guidelines for the development and deployment of artificial intelligence." },
  ];

  return (
    <div className="py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">🏛️ Digital Constitution Posts</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <div key={article.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition duration-300 border-l-4 border-blue-500">
            <h3 className="text-xl font-semibold mb-2 text-blue-700">Article {article.id}: {article.title}</h3>
            <p className="text-gray-600 mb-4">{article.summary}</p>
            <button className="text-sm text-orange-500 hover:text-orange-700 font-medium">
              Read Full Article & Discussion →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostsList;