import React, { useState, useEffect } from 'react';
import PostCard from './PostCard';

// Constitution data API
const CONSTITUTION_API_URL = 'https://raw.githubusercontent.com/civictech-India/constitution-of-india/master/constitution_of_india.json';

// --- SUB-COMPONENT: ArticleDisplay ---
const ArticleDisplay = ({ article }) => {
  const [activeTab, setActiveTab] = useState('share'); 
  const [opinionText, setOpinionText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [discussions, setDiscussions] = useState([]);
  const [loadingDiscussions, setLoadingDiscussions] = useState(false);
  const [user, setUser] = useState(null);

  // Get user data on mount
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
  }, []);

  // Fetch discussions for this article
  useEffect(() => {
    const fetchDiscussions = async () => {
      setLoadingDiscussions(true);
      try {
        const userData = JSON.parse(localStorage.getItem('user'));
        const res = await fetch(`http://localhost:5000/api/posts/article/${article.id}`, {
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${userData?.userId}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          setDiscussions(data.posts || []);
        }
      } catch (err) {
        console.error('Failed to fetch discussions:', err);
      } finally {
        setLoadingDiscussions(false);
      }
    };

    if (article.id) {
      fetchDiscussions();
    }
  }, [article.id]);

  const handleSubmitOpinion = async (e) => {
    e.preventDefault();
    
    if (!opinionText.trim()) {
      alert('Please write your opinion before submitting');
      return;
    }

    setSubmitting(true);

    try {
      // Get user data from localStorage
      const userData = JSON.parse(localStorage.getItem('user'));
      
      if (!userData || !userData.userId) {
        alert('Please log in to submit an opinion');
        return;
      }

      // Create post via backend API
      const response = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.userId}`
        },
        body: JSON.stringify({
          articleNumber: article.id,
          articleTitle: article.title,
          content: opinionText
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}`);
      }
      
      alert('✅ Opinion submitted successfully!');
      setOpinionText('');
      
      // Refresh discussions
      const refreshRes = await fetch(`http://localhost:5000/api/posts/article/${article.id}`, {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${userData.userId}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (refreshRes.ok) {
        const refreshData = await refreshRes.json();
        setDiscussions(refreshData.posts || []);
      }

      // Switch to discussions tab to see the new post
      setActiveTab('discuss');

    } catch (error) {
      console.error('Submit opinion error:', error);
      alert(`Failed to submit opinion: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

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

      // Update local discussions state
      setDiscussions((prev) =>
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
          'Authorization': `Bearer ${user.userId}`
        },
        body: JSON.stringify({ text }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
      alert('Comment posted successfully');
    } catch (err) {
      alert('Failed to submit comment: ' + (err.message || err));
    }
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
      
      {/* Tabs */}
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
          View Discussions ({discussions.length})
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
              disabled={submitting}
            />
            <button 
              type="submit"
              disabled={submitting}
              className={`mt-4 bg-green-600 text-white font-bold py-2 px-6 rounded-lg shadow hover:bg-green-700 transition duration-150 ${
                submitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {submitting ? 'Submitting...' : 'Submit Opinion'}
            </button>
          </form>
        )}
        
        {activeTab === 'discuss' && (
          <div className="space-y-4">
            {loadingDiscussions ? (
              <p className="text-gray-600">Loading discussions...</p>
            ) : discussions.length === 0 ? (
              <div className="text-gray-600 p-4 bg-gray-50 rounded">
                <p>No discussions yet for this article. Be the first to share your opinion!</p>
              </div>
            ) : (
              discussions.map(post => (
                <PostCard
                  key={post.postId}
                  post={post}
                  userRole={post.userId?.role}
                  showTrendingBadge={false}
                  showInteractionButtons={true}
                  onAgree={handleAgreeClick}
                  onDisagree={handleDisagreeClick}
                  onComment={handlePostClick}
                />
              ))
            )}
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
  const [searchTerm, setSearchTerm] = useState("");

  // Data Fetching
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

  // Filtered list
  const filteredArticles = articles.filter(article =>
    article.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto py-8 gap-8">
      
      {/* Sidebar (Article Navigation) */}
      <nav className="w-full md:w-2/5 bg-white p-6 rounded-lg shadow-md h-fit sticky top-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900">Constitution Articles</h2>
        
        {/* Search bar */}
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
          <ul className="space-y-1 max-h-[60vh] overflow-y-auto">
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
            
            {filteredArticles.length === 0 && !isLoading && (
              <p className="text-gray-500 p-2">No articles found.</p>
            )}
          </ul>
        )}
      </nav>

      {/* Main Content Area */}
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



//import React, { useState, useEffect } from 'react';
// import PostCard from './PostCard';

// // Constitution data API
// const CONSTITUTION_API_URL = 'https://raw.githubusercontent.com/civictech-India/constitution-of-india/master/constitution_of_india.json';

// // --- SUB-COMPONENT: ArticleDisplay ---
// const ArticleDisplay = ({ article, onOpinionSubmitted }) => {
//   const [activeTab, setActiveTab] = useState('share'); 
//   const [opinionText, setOpinionText] = useState('');
//   const [submitting, setSubmitting] = useState(false);
//   const [discussions, setDiscussions] = useState([]);
//   const [loadingDiscussions, setLoadingDiscussions] = useState(false);

//   // Fetch discussions for this article
//   useEffect(() => {
//     const fetchDiscussions = async () => {
//       setLoadingDiscussions(true);
//       try {
//         const userData = JSON.parse(localStorage.getItem('user'));
//         const res = await fetch(`http://localhost:5000/api/posts/article/${article.id}`, {
//           credentials: 'include',
//           headers: {
//             'Authorization': `Bearer ${userData?.token}`,
//             'Content-Type': 'application/json'
//           }
//         });
        
//         if (res.ok) {
//           const data = await res.json();
//           setDiscussions(data.posts || []);
//         }
//       } catch (err) {
//         console.error('Failed to fetch discussions:', err);
//       } finally {
//         setLoadingDiscussions(false);
//       }
//     };

//     if (article.id) {
//       fetchDiscussions();
//     }
//   }, [article.id]);

//   const handleSubmitOpinion = async (e) => {
//     e.preventDefault();
    
//     if (!opinionText.trim()) {
//       alert('Please write your opinion before submitting');
//       return;
//     }

//     setSubmitting(true);

//     try {
//       // Get user data from localStorage
//       const userData = JSON.parse(localStorage.getItem('user'));
      
//       if (!userData || !userData.userId) {
//         alert('Please log in to submit an opinion');
//         return;
//       }

//       // Create post via backend API
//       const response = await fetch('http://localhost:5000/api/posts', {
//         method: 'POST',
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${userData.userId}` // Use userId as token
//         },
//         body: JSON.stringify({
//           articleNumber: article.id,
//           articleTitle: article.title,
//           content: opinionText
//         })
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(errorData.message || `Error ${response.status}`);
//       }

//       const data = await response.json();
      
//       alert('✅ Opinion submitted successfully!');
//       setOpinionText('');
      
//       // Refresh discussions
//       const refreshRes = await fetch(`http://localhost:5000/api/posts/article/${article.id}`, {
//         credentials: 'include',
//         headers: {
//           'Authorization': `Bearer ${userData.userId}`,
//           'Content-Type': 'application/json'
//         }
//       });
      
//       if (refreshRes.ok) {
//         const refreshData = await refreshRes.json();
//         setDiscussions(refreshData.posts || []);
//       }

//       // Notify parent component
//       if (onOpinionSubmitted) {
//         onOpinionSubmitted();
//       }

//     } catch (error) {
//       console.error('Submit opinion error:', error);
//       alert(`Failed to submit opinion: ${error.message}`);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="bg-white p-8 rounded-lg shadow-md">
      
//       {/* Article content box */}
//       <h2 className="text-3xl font-bold mb-4">{article.title}</h2>
//       <div className="bg-gray-50 p-6 rounded border border-gray-200 mb-6">
//         <h3 className="text-lg font-semibold mb-2">Article Text</h3>
//         <p className="text-gray-700 leading-relaxed whitespace-pre-line">{article.content}</p>
//       </div>

//       {/* "Share my opinion" section */}
//       <h3 className="text-2xl font-semibold mb-4">Share My Opinion On This</h3>
      
//       {/* Tabs */}
//       <div className="flex border-b mb-4">
//         <button 
//           onClick={() => setActiveTab('share')}
//           className={`py-2 px-4 text-sm font-medium ${activeTab === 'share' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
//         >
//           Share Opinion On This
//         </button>
//         <button 
//           onClick={() => setActiveTab('discuss')}
//           className={`py-2 px-4 text-sm font-medium ${activeTab === 'discuss' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
//         >
//           View Discussions ({discussions.length})
//         </button>
//       </div>

//       {/* Tab Content */}
//       <div>
//         {activeTab === 'share' && (
//           <form onSubmit={handleSubmitOpinion}>
//             <textarea 
//               value={opinionText}
//               onChange={(e) => setOpinionText(e.target.value)}
//               className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//               placeholder="Share your opinion, identify loopholes, or suggest changes..."
//               required
//               disabled={submitting}
//             />
//             <button 
//               type="submit"
//               disabled={submitting}
//               className={`mt-4 bg-green-600 text-white font-bold py-2 px-6 rounded-lg shadow hover:bg-green-700 transition duration-150 ${
//                 submitting ? 'opacity-50 cursor-not-allowed' : ''
//               }`}
//             >
//               {submitting ? 'Submitting...' : 'Submit Opinion'}
//             </button>
//           </form>
//         )}
        
//         {activeTab === 'discuss' && (
//           <div className="space-y-4">
//             {loadingDiscussions ? (
//               <p className="text-gray-600">Loading discussions...</p>
//             ) : discussions.length === 0 ? (
//               <div className="text-gray-600 p-4 bg-gray-50 rounded">
//                 <p>No discussions yet for this article. Be the first to share your opinion!</p>
//               </div>
//             ) : (
//               discussions.map(post => (
//                 <PostCard
//                   key={post.postId}
//                   post={post}
//                   userRole={post.userId?.role}
//                   showTrendingBadge={false}
//                   showInteractionButtons={false} // Read-only mode
//                 />
//               ))
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };


// // --- MAIN COMPONENT: ConstitutionPage ---
// function ConstitutionPage() {
//   const [articles, setArticles] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [selectedArticleId, setSelectedArticleId] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");

//   // Data Fetching
//   useEffect(() => {
//     const fetchConstitutionData = async () => {
//       try {
//         const response = await fetch(CONSTITUTION_API_URL);
//         if (!response.ok) {
//           throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
//         }
//         const data = await response.json(); 
        
//         const articlesArray = Object.entries(data).map(([artNo, details]) => ({
//           ArtNo: artNo,
//           Name: `Article ${artNo}: ${details.title}`, 
//           ArtDesc: details.description
//         }));
        
//         setArticles(articlesArray);
        
//       } catch (error) {
//         console.error("Failed to fetch constitution data:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
    
//     fetchConstitutionData();
    
//   }, []); 

//   const selectedArticle = articles.find(art => art.ArtNo === selectedArticleId);

//   // Filtered list
//   const filteredArticles = articles.filter(article =>
//     article.Name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleOpinionSubmitted = () => {
//     console.log('Opinion submitted successfully');
//     // You can add additional actions here if needed
//   };

//   return (
//     <div className="flex flex-col md:flex-row max-w-7xl mx-auto py-8 gap-8">
      
//       {/* Sidebar (Article Navigation) */}
//       <nav className="w-full md:w-2/5 bg-white p-6 rounded-lg shadow-md h-fit sticky top-24">
//         <h2 className="text-xl font-bold mb-4 text-blue-900">Constitution Articles</h2>
        
//         {/* Search bar */}
//         <input
//           type="text"
//           placeholder="Search by name or article no..."
//           className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
        
//         {isLoading ? (
//           <p className="text-gray-500">Loading articles...</p>
//         ) : (
//           <ul className="space-y-1 max-h-[60vh] overflow-y-auto">
//             {filteredArticles.map(article => (
//               <li key={article.ArtNo}>
//                 <button
//                   onClick={() => setSelectedArticleId(article.ArtNo)}
//                   className={`w-full text-left p-2 rounded ${
//                     selectedArticleId === article.ArtNo 
//                       ? 'bg-blue-100 text-blue-700 font-bold' 
//                       : 'text-gray-700 hover:bg-gray-100'
//                   }`}
//                 >
//                   {article.Name}
//                 </button>
//               </li>
//             ))}
            
//             {filteredArticles.length === 0 && !isLoading && (
//               <p className="text-gray-500 p-2">No articles found.</p>
//             )}
//           </ul>
//         )}
//       </nav>

//       {/* Main Content Area */}
//       <main className="w-full md:w-3/5">
//         {isLoading ? (
//           <div className="bg-white p-10 rounded-lg shadow-md text-center">
//             <h2 className="text-2xl font-semibold text-gray-700">Loading...</h2>
//           </div>
//         ) : selectedArticle ? (
//           <ArticleDisplay 
//             article={{
//               id: selectedArticle.ArtNo,
//               title: selectedArticle.Name,
//               content: selectedArticle.ArtDesc 
//             }}
//             onOpinionSubmitted={handleOpinionSubmitted}
//           />
//         ) : (
//           <div className="bg-white p-10 rounded-lg shadow-md text-center">
//             <h2 className="text-2xl font-semibold text-gray-700">Please select an article</h2>
//             <p className="text-gray-500 mt-2">Choose an article from the list on the left to read its content and share your opinion.</p>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

// export default ConstitutionPage;


// // import React, { useState, useEffect } from 'react';

// // // This is the working, complete data source
// // const CONSTITUTION_API_URL = 'https://raw.githubusercontent.com/civictech-India/constitution-of-india/master/constitution_of_india.json';

// // // --- SUB-COMPONENT: ArticleDisplay ---
// // // (This component is unchanged)
// // const ArticleDisplay = ({ article }) => {
// //   const [activeTab, setActiveTab] = useState('share'); 
// //   const [opinionText, setOpinionText] = useState('');

// //   const handleSubmitOpinion = (e) => {
// //      e.preventDefault();
// //      alert(`Submitting opinion for ${article.id}: ${opinionText}`);
// //      // TODO: This is where you will fetch() to your backend
// //      setOpinionText('');
// //   };

// //   return (
// //     <div className="bg-white p-8 rounded-lg shadow-md">
      
// //       {/* Article content box */}
// //       <h2 className="text-3xl font-bold mb-4">{article.title}</h2>
// //       <div className="bg-gray-50 p-6 rounded border border-gray-200 mb-6">
// //         <h3 className="text-lg font-semibold mb-2">Article Text</h3>
// //         <p className="text-gray-700 leading-relaxed whitespace-pre-line">{article.content}</p>
// //       </div>

// //       {/* "Share my opinion" section */}
// //       <h3 className="text-2xl font-semibold mb-4">Share My Opinion On This</h3>
      
// //       {/* Tabs from your wireframe */}
// //       <div className="flex border-b mb-4">
// //         <button 
// //           onClick={() => setActiveTab('share')}
// //           className={`py-2 px-4 text-sm font-medium ${activeTab === 'share' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
// //         >
// //           Share Opinion On This
// //         </button>
// //         <button 
// //           onClick={() => setActiveTab('discuss')}
// //           className={`py-2 px-4 text-sm font-medium ${activeTab === 'discuss' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
// //         >
// //           Summarize Discussion
// //         </button>
// //       </div>

// //       {/* Tab Content */}
// //       <div>
// //         {activeTab === 'share' && (
// //           <form onSubmit={handleSubmitOpinion}>
// //             <textarea 
// //               value={opinionText}
// //               onChange={(e) => setOpinionText(e.target.value)}
// //               className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
// //               placeholder="Share your opinion, identify loopholes, or suggest changes..."
// //               required
// //             />
// //             <button 
// //               type="submit"
// //               className="mt-4 bg-green-600 text-white font-bold py-2 px-6 rounded-lg shadow hover:bg-green-700 transition duration-150"
// //             >
// //               Submit Opinion
// //             </button>
// //           </form>
// //         )}
        
// //         {activeTab === 'discuss' && (
// //           <div className="text-gray-600 p-4 bg-gray-50 rounded">
// //             <p>This area will show a summary of existing discussions and opinions from other users about this article.</p>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };


// // // --- MAIN COMPONENT: ConstitutionPage ---
// // function ConstitutionPage() {
// //   const [articles, setArticles] = useState([]);
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [selectedArticleId, setSelectedArticleId] = useState(null);
  
// //   // --- 1. ADD NEW STATE FOR THE SEARCH TERM ---
// //   const [searchTerm, setSearchTerm] = useState("");

// //   // --- Data Fetching (no change) ---
// //   useEffect(() => {
// //     const fetchConstitutionData = async () => {
// //       try {
// //         const response = await fetch(CONSTITUTION_API_URL);
// //         if (!response.ok) {
// //           throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
// //         }
// //         const data = await response.json(); 
        
// //         const articlesArray = Object.entries(data).map(([artNo, details]) => ({
// //           ArtNo: artNo,
// //           Name: `Article ${artNo}: ${details.title}`, 
// //           ArtDesc: details.description
// //         }));
        
// //         setArticles(articlesArray);
        
// //       } catch (error) {
// //         console.error("Failed to fetch constitution data:", error);
// //       } finally {
// //         setIsLoading(false);
// //       }
// //     };
    
// //     fetchConstitutionData();
    
// //   }, []); 

  
// //   const selectedArticle = articles.find(art => art.ArtNo === selectedArticleId);

// //   // --- 2. CREATE A FILTERED LIST ---
// //   // This logic runs every time you type in the search bar
// //   const filteredArticles = articles.filter(article =>
// //     article.Name.toLowerCase().includes(searchTerm.toLowerCase())
// //   );

// //   return (
// //     // Main layout: Sidebar + Content Area
// //     <div className="flex flex-col md:flex-row max-w-7xl mx-auto py-8 gap-8">
      
// //       {/* Sidebar (Article Navigation) - 40% width */}
// //       <nav className="w-full md:w-2/5 bg-white p-6 rounded-lg shadow-md h-fit sticky top-24">
// //         <h2 className="text-xl font-bold mb-4 text-blue-900">Constitution Articles</h2>
        
// //         {/* --- 3. ADD THE SEARCH BAR INPUT --- */}
// //         <input
// //           type="text"
// //           placeholder="Search by name or article no..."
// //           className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
// //           value={searchTerm}
// //           onChange={(e) => setSearchTerm(e.target.value)}
// //         />
        
// //         {isLoading ? (
// //           <p className="text-gray-500">Loading articles...</p>
// //         ) : (
// //           <ul className="space-y-1 max-h-[60vh] overflow-y-auto"> {/* Adjusted height */}
            
// //             {/* --- 4. MAP OVER THE *FILTERED* LIST --- */}
// //             {filteredArticles.map(article => (
// //               <li key={article.ArtNo}>
// //                 <button
// //                   onClick={() => setSelectedArticleId(article.ArtNo)}
// //                   className={`w-full text-left p-2 rounded ${
// //                     selectedArticleId === article.ArtNo 
// //                       ? 'bg-blue-100 text-blue-700 font-bold' 
// //                       : 'text-gray-700 hover:bg-gray-100'
// //                   }`}
// //                 >
// //                   {article.Name}
// //                 </button>
// //               </li>
// //             ))}
            
// //             {/* Show a message if no results are found */}
// //             {filteredArticles.length === 0 && !isLoading && (
// //               <p className="text-gray-500 p-2">No articles found.</p>
// //             )}
// //           </ul>
// //         )}
// //       </nav>

// //       {/* Main Content Area - 60% width */}
// //       <main className="w-full md:w-3/5">
// //         {isLoading ? (
// //           <div className="bg-white p-10 rounded-lg shadow-md text-center">
// //             <h2 className="text-2xl font-semibold text-gray-700">Loading...</h2>
// //           </div>
// //         ) : selectedArticle ? (
// //           <ArticleDisplay 
// //             article={{
// //               id: selectedArticle.ArtNo,
// //               title: selectedArticle.Name,
// //               content: selectedArticle.ArtDesc 
// //             }} 
// //           />
// //         ) : (
// //           <div className="bg-white p-10 rounded-lg shadow-md text-center">
// //             <h2 className="text-2xl font-semibold text-gray-700">Please select an article</h2>
// //             <p className="text-gray-500 mt-2">Choose an article from the list on the left to read its content and share your opinion.</p>
// //           </div>
// //         )}
// //       </main>
// //     </div>
// //   );
// // }

// // export default ConstitutionPage;