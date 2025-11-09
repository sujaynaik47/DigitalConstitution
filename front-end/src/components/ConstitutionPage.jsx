import React, { useState, useEffect } from 'react';

// This is the working, complete data source
const CONSTITUTION_API_URL = 'https://raw.githubusercontent.com/civictech-India/constitution-of-india/master/constitution_of_india.json';

// --- SUB-COMPONENT: ArticleDisplay ---
// (This component is unchanged)
const ArticleDisplay = ({ article }) => {
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
      
      {/* Article content box */}
      <h2 className="text-3xl font-bold mb-4">{article.title}</h2>
      <div className="bg-gray-50 p-6 rounded border border-gray-200 mb-6">
        <h3 className="text-lg font-semibold mb-2">Article Text</h3>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">{article.content}</p>
      </div>

      {/* "Share my opinion" section */}
      <h3 className="text-2xl font-semibold mb-4">Share My Opinion On This</h3>
      
      {/* Tabs from your wireframe */}
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
        
        {activeTab === 'discuss' && (
          <div className="text-gray-600 p-4 bg-gray-50 rounded">
            <p>This area will show a summary of existing discussions and opinions from other users about this article.</p>
          </div>
        )}
      </div>
    </div>
  );
};


// --- MAIN COMPONENT: ConstitutionPage ---
function ConstitutionPage() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  
  // --- 1. ADD NEW STATE FOR THE SEARCH TERM ---
  const [searchTerm, setSearchTerm] = useState("");

  // --- Data Fetching (no change) ---
  useEffect(() => {
    const fetchConstitutionData = async () => {
      try {
        const response = await fetch(CONSTITUTION_API_URL);
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
        }
        const data = await response.json(); 
        
        const articlesArray = Object.entries(data).map(([artNo, details]) => ({
          ArtNo: artNo,
          Name: `Article ${artNo}: ${details.title}`, 
          ArtDesc: details.description
        }));
        
        setArticles(articlesArray);
        
      } catch (error) {
        console.error("Failed to fetch constitution data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchConstitutionData();
    
  }, []); 

  
  const selectedArticle = articles.find(art => art.ArtNo === selectedArticleId);

  // --- 2. CREATE A FILTERED LIST ---
  // This logic runs every time you type in the search bar
  const filteredArticles = articles.filter(article =>
    article.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    // Main layout: Sidebar + Content Area
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto py-8 gap-8">
      
      {/* Sidebar (Article Navigation) - 40% width */}
      <nav className="w-full md:w-2/5 bg-white p-6 rounded-lg shadow-md h-fit sticky top-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900">Constitution Articles</h2>
        
        {/* --- 3. ADD THE SEARCH BAR INPUT --- */}
        <input
          type="text"
          placeholder="Search by name or article no..."
          className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        {isLoading ? (
          <p className="text-gray-500">Loading articles...</p>
        ) : (
          <ul className="space-y-1 max-h-[60vh] overflow-y-auto"> {/* Adjusted height */}
            
            {/* --- 4. MAP OVER THE *FILTERED* LIST --- */}
            {filteredArticles.map(article => (
              <li key={article.ArtNo}>
                <button
                  onClick={() => setSelectedArticleId(article.ArtNo)}
                  className={`w-full text-left p-2 rounded ${
                    selectedArticleId === article.ArtNo 
                      ? 'bg-blue-100 text-blue-700 font-bold' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {article.Name}
                </button>
              </li>
            ))}
            
            {/* Show a message if no results are found */}
            {filteredArticles.length === 0 && !isLoading && (
              <p className="text-gray-500 p-2">No articles found.</p>
            )}
          </ul>
        )}
      </nav>

      {/* Main Content Area - 60% width */}
      <main className="w-full md:w-3/5">
        {isLoading ? (
          <div className="bg-white p-10 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-semibold text-gray-700">Loading...</h2>
          </div>
        ) : selectedArticle ? (
          <ArticleDisplay 
            article={{
              id: selectedArticle.ArtNo,
              title: selectedArticle.Name,
              content: selectedArticle.ArtDesc 
            }} 
          />
        ) : (
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