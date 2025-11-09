import React, { useState } from 'react';
// Import the data you just created
import { constitutionData } from '../data/constitution';

// This is a sub-component to keep the code clean
// It displays the selected article and the opinion tabs
const ArticleDisplay = ({ article }) => {
  // This state tracks which tab is open
  const [activeTab, setActiveTab] = useState('share'); 
  const [opinionText, setOpinionText] = useState('');

  const handleSubmitOpinion = (e) => {
     e.preventDefault();
     alert(`Submitting opinion for ${article.id}: ${opinionText}`);
     // TODO: This is where you will fetch() to your backend
     setOpinionText('');
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      
      {/* This is the "Article content to Read/Review" box */}
      <h2 className="text-3xl font-bold mb-4">{article.title}</h2>
      <div className="bg-gray-50 p-6 rounded border border-gray-200 mb-6">
        <h3 className="text-lg font-semibold mb-2">Article Text</h3>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">{article.content}</p>
      </div>

      {/* This is the "Share my opinion on this" section */}
      <h3 className="text-2xl font-semibold mb-4">Share My Opinion On This</h3>
      
      {/* These are the tabs from your wireframe */}
      <div className="flex border-b mb-4">
        <button 
          onClick={() => setActiveTab('share')}
          className={`py-2 px-4 text-sm font-medium ${activeTab === 'share' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Share Opinion On This
        </button>
        <button 
          onClick={() => setActiveTab('discuss')}
          className={`py-2 px-4 text-sm font-medium ${activeTab === 'discuss' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Summarize Discussion
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {/* "Share Opinion" tab content */}
        {activeTab === 'share' && (
          <form onSubmit={handleSubmitOpinion}>
            <textarea 
              value={opinionText}
              onChange={(e) => setOpinionText(e.target.value)}
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Share your opinion, identify loopholes, or suggest changes..."
              required
            />
            <button 
              type="submit"
              className="mt-4 bg-green-600 text-white font-bold py-2 px-6 rounded-lg shadow hover:bg-green-700 transition duration-150"
            >
              Submit Opinion
            </button>
          </form>
        )}
        
        {/* "Summarize Discussion" tab content */}
        {activeTab === 'discuss' && (
          <div className="text-gray-600 p-4 bg-gray-50 rounded">
            <p>This area will show a summary of existing discussions and opinions from other users about this article.</p>
          </div>
        )}
      </div>
    </div>
  );
};


// This is the main component for the page
function ConstitutionPage() {
  // This state tracks which article is currently selected
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  
  // Find the full article object from our data
  const selectedArticle = constitutionData.find(art => art.id === selectedArticleId);

  return (
    // Main layout: Sidebar + Content Area
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto py-8 gap-8">
      
      {/* Sidebar (Article Navigation) */}
      <nav className="w-full md:w-1/4 bg-white p-6 rounded-lg shadow-md h-fit sticky top-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900">Constitution Articles</h2>
        <ul className="space-y-1 max-h-96 overflow-y-auto">
          {constitutionData.map(article => (
            <li key={article.id}>
              <button
                onClick={() => setSelectedArticleId(article.id)}
                className={`w-full text-left p-2 rounded ${
                  selectedArticleId === article.id 
                    ? 'bg-blue-100 text-blue-700 font-bold' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {article.title}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main Content Area */}
      <main className="w-full md:w-3/4">
        {selectedArticle ? (
          // If an article is selected, show it
          <ArticleDisplay article={selectedArticle} />
        ) : (
          // If no article is selected, show a prompt
          <div className="bg-white p-10 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-semibold text-gray-700">Please select an article</h2>
            <p className="text-gray-500 mt-2">Choose an article from the list on the left to read its content and share your opinion.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default ConstitutionPage;