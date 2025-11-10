// ConstitutionPage.jsx

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PostCard from './PostCard';

// 1. IMPORT THE JSON DATA DIRECTLY
// This makes the data available immediately as a JavaScript object.
import constitutionData from '../data/constitution.json'; 

// We no longer need this constant since we import the data directly.
// const CONSTITUTION_API_URL = '../data/constitution.json';


// Reddit/YouTube-style Nested Reply Component with threading
const ReplyPost = ({ post, level = 0, onAgree, onDisagree, onComment, onReply }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const hasReplies = post.replies && post.replies.length > 0;
  
  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    
    setSubmitting(true);
    try {
      await onReply(post.postId, replyText);
      setReplyText('');
      setShowReplyForm(false);
    } catch (err) {
      console.error('Reply error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`${level > 0 ? 'ml-6 md:ml-8 mt-3' : 'mt-4'} relative`}>
      {/* Vertical threading line - Reddit/YouTube style */}
      {level > 0 && (
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-gray-300 hover:bg-blue-400 transition-colors" 
          style={{ left: '-1rem' }}
        ></div>
      )}
      
      {/* Post Card Container */}
      <div className={`${level > 0 ? 'pl-4 border-l-2 border-transparent hover:border-blue-200 transition-colors' : ''}`}>
        <PostCard
          post={post}
          userRole={post.userId?.role}
          showTrendingBadge={false}
          showInteractionButtons={true}
          onAgree={onAgree}
          onDisagree={onDisagree}
          onComment={onComment}
        />

        {/* Reply Button */}
        <div className="mt-2 ml-2">
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
            Reply
          </button>
        </div>

        {/* Inline Reply Form */}
        {showReplyForm && (
          <form onSubmit={handleReplySubmit} className="mt-3 ml-2">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your reply..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="3"
              disabled={submitting}
              autoFocus
            />
            <div className="flex gap-2 mt-2">
              <button
                type="submit"
                disabled={submitting || !replyText.trim()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {submitting ? 'Posting...' : 'Post Reply'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowReplyForm(false);
                  setReplyText('');
                }}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Nested Replies - Recursive rendering */}
      {hasReplies && (
        <div className="mt-2">
          {post.replies.map(reply => (
            <ReplyPost
              key={reply.postId}
              post={reply}
              level={level + 1}
              onAgree={onAgree}
              onDisagree={onDisagree}
              onComment={onComment}
              onReply={onReply}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// --- MAIN COMPONENT: ConstitutionPage ---
function ConstitutionPage() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [referencePost, setReferencePost] = useState(null);
  const [searchParams] = useSearchParams();
  
  // Opinion/Discussion states
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

  // Data Fetching (MODIFIED to use direct import)
  useEffect(() => {
  try {
   // constitutionData is the imported JSON (assumed to be an array of objects)
   const dataArray = constitutionData; 
   
   // Check if the imported data is an array
   if (!Array.isArray(dataArray)) {
    throw new Error("Imported constitution data is not an array. Check JSON file format.");
   }
   
   // Map the array, using item.article as the ArtNo
   const articlesArray = dataArray.map(item => ({
    // CORRECTED: Extract ArtNo from the 'article' field
    ArtNo: String(item.article), 
    Name: `Article ${item.article}: ${item.title}`, 
    ArtDesc: item.description,
    OriginalTitle: item.title 
   }));
   
   setArticles(articlesArray);
   
  } catch (error) {
   console.error("Failed to process constitution data:", error);
  } finally {
   setIsLoading(false);
  }
  
 }, []);
  // Handle navigation with article number and reference post
  useEffect(() => {
    const articleParam = searchParams.get('article');
    const refParam = searchParams.get('ref');
    
    if (articleParam) {
      setSelectedArticleId(articleParam);
      
      // Get reference post from localStorage if available
      if (refParam) {
        const storedPost = localStorage.getItem('referencePost');
        if (storedPost) {
          try {
            const parsedPost = JSON.parse(storedPost);
            setReferencePost(parsedPost);
          } catch (err) {
            console.error('Failed to parse reference post:', err);
          }
        }
      }
    }
  }, [searchParams]);

  // Auto-switch to discuss tab if there's a reference post
  useEffect(() => {
    if (referencePost) {
      setActiveTab('discuss');
    }
  }, [referencePost]);

  // Fetch discussions for the selected article
  const fetchDiscussions = async () => {
    // Ensure we use the exact selected ID (e.g., "21A") for fetching
    if (!selectedArticleId) return;
    
    setLoadingDiscussions(true);
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      // The correct ID is used here: http://localhost:5000/api/posts/article/{21A}
      const res = await fetch(`http://localhost:5000/api/posts/article/${selectedArticleId}`, {
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

  useEffect(() => {
    fetchDiscussions();
  }, [selectedArticleId]);

  const handleSubmitOpinion = async (e) => {
    e.preventDefault();
    
    if (!opinionText.trim()) {
      alert('Please write your opinion before submitting');
      return;
    }

    if (!selectedArticleId) {
      alert('Please select an article first');
      return;
    }

    setSubmitting(true);

    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      
      if (!userData || !userData.userId) {
        alert('Please log in to submit an opinion');
        return;
      }

      const selectedArticle = articles.find(art => art.ArtNo === selectedArticleId);
      
      if (!selectedArticle) {
          throw new Error('Selected article not found in list.');
      }

      const postData = {
        // FIX CONFIRMED: Ensure the articleNumber is the exact ArtNo/selectedArticleId (e.g., "21A")
        articleNumber: selectedArticleId, 
        // FIX CONFIRMED: Use the clean OriginalTitle for the backend
        articleTitle: selectedArticle.OriginalTitle, 
        content: opinionText
      };

      // If there's a reference post, mark this as a reply
      if (referencePost) {
        postData.replyToPostId = referencePost.postId;
      }

      const response = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.userId}`
        },
        body: JSON.stringify(postData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}`);
      }
      
      alert('✅ Opinion submitted successfully!');
      setOpinionText('');
      
      // Clear reference post from localStorage
      localStorage.removeItem('referencePost');
      setReferencePost(null);
      
      // Refresh discussions
      await fetchDiscussions();

      // Switch to discussions tab to see the new post
      setActiveTab('discuss');

    } catch (error) {
      console.error('Submit opinion error:', error);
      alert(`Failed to submit opinion: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle inline reply submission
  const handleInlineReply = async (parentPostId, replyContent) => {
    if (!user) {
      alert('Please log in first');
      throw new Error('Not authenticated');
    }

    try {
      const selectedArticle = articles.find(art => art.ArtNo === selectedArticleId);

      if (!selectedArticle) {
          throw new Error('Selected article not found in list.');
      }
      
      const postData = {
        // FIX CONFIRMED: Ensure the articleNumber is the exact ArtNo/selectedArticleId (e.g., "21A")
        articleNumber: selectedArticleId,
        // FIX CONFIRMED: Use the clean OriginalTitle for the backend
        articleTitle: selectedArticle.OriginalTitle,
        content: replyContent,
        replyToPostId: parentPostId
      };

      const response = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.userId}`
        },
        body: JSON.stringify(postData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}`);
      }

      // Refresh discussions to show new reply
      await fetchDiscussions();

    } catch (error) {
      console.error('Inline reply error:', error);
      alert(`Failed to post reply: ${error.message}`);
      throw error;
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

      // Update discussions recursively
      const updatePostCounts = (posts) => {
        return posts.map(p => {
          if (p.postId === postId) {
            return {
              ...p,
              agreeCount: data.agreeCount,
              disagreeCount: data.disagreeCount,
              userVote: type,
            };
          }
          if (p.replies && p.replies.length > 0) {
            return {
              ...p,
              replies: updatePostCounts(p.replies)
            };
          }
          return p;
        });
      };

      setDiscussions(updatePostCounts(discussions));
    } catch (err) {
      alert('Could not register your response: ' + (err.message || err));
    }
  };

  const handleAgreeClick = (postId) => callVote(postId, 'agree');
  const handleDisagreeClick = (postId) => callVote(postId, 'disagree');

  const handlePostClick = (postId) => {
    if (!user) {
      alert('Please log in first');
      return;
    }

    // Find the post (could be nested)
    const findPost = (posts) => {
      for (const p of posts) {
        if (p.postId === postId) return p;
        if (p.replies && p.replies.length > 0) {
          const found = findPost(p.replies);
          if (found) return found;
        }
      }
      return null;
    };

    const post = findPost(discussions);
    if (!post) {
      alert('Post not found');
      return;
    }

    // Store reference and scroll to form
    localStorage.setItem('referencePost', JSON.stringify({
      postId: post.postId,
      articleNumber: post.articleNumber,
      articleTitle: post.articleTitle,
      content: post.content,
      userId: post.userId?.userId || post.userId,
      userRole: post.userId?.role
    }));

    // Reload with reference
    window.location.reload();
  };

  const selectedArticle = articles.find(art => art.ArtNo === selectedArticleId);

  // Filtered list
  const filteredArticles = articles.filter(article =>
    article.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      
      {/* Top Section: Article List (Left) + Article Content (Right) */}
      <div className="flex flex-col lg:flex-row gap-8 mb-8">
        
        {/* Left: Article Navigation Sidebar */}
        <nav className="w-full lg:w-1/3 bg-white p-6 rounded-lg shadow-md h-fit lg:sticky lg:top-24">
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
                    onClick={() => {
                      setSelectedArticleId(article.ArtNo);
                      setReferencePost(null);
                      localStorage.removeItem('referencePost');
                      setActiveTab('share');
                    }}
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

        {/* Right: Article Content Display */}
        <div className="w-full lg:w-2/3 bg-white p-8 rounded-lg shadow-md">
          {isLoading ? (
            <div className="text-center py-10">
              <h2 className="text-2xl font-semibold text-gray-700">Loading...</h2>
            </div>
          ) : selectedArticle ? (
            <>
              <h2 className="text-3xl font-bold mb-4 text-gray-900">{selectedArticle.Name}</h2>
              <div className="bg-gray-50 p-6 rounded border border-gray-200">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Article Text</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{selectedArticle.ArtDesc}</p>
              </div>
            </>
          ) : (
            <div className="text-center py-10">
              <h2 className="text-2xl font-semibold text-gray-700">Please select an article</h2>
              <p className="text-gray-500 mt-2">Choose an article from the list on the left to read its content.</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section: Share Opinion & View Discussions (Full Width) */}
      {selectedArticle && (
        <div className="bg-white p-8 rounded-lg shadow-md">
          
          {/* Reference Post - Show if navigating from another page */}
          {referencePost && (
            <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-blue-800">
                  📌 Replying to this post:
                </h4>
                <button
                  onClick={() => {
                    localStorage.removeItem('referencePost');
                    setReferencePost(null);
                    setActiveTab('share');
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  ✕ Cancel Reply
                </button>
              </div>
              <div className="border-l-2 border-blue-300 pl-4">
                <PostCard
                  post={referencePost}
                  userRole={referencePost.userRole}
                  showTrendingBadge={false}
                  showInteractionButtons={false}
                />
              </div>
            </div>
          )}

          {/* Section Title */}
          <h3 className="text-2xl font-semibold mb-4 text-gray-900">
            {referencePost ? '↳ Write Your Reply' : 'Share My Opinion On This'}
          </h3>
          
          {/* Tabs */}
          <div className="flex border-b mb-6">
            <button 
              onClick={() => setActiveTab('share')}
              className={`py-2 px-6 text-sm font-medium transition-colors ${
                activeTab === 'share' 
                  ? 'border-b-2 border-blue-600 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {referencePost ? 'Write Reply' : 'Share Opinion'}
            </button>
            <button 
              onClick={() => setActiveTab('discuss')}
              className={`py-2 px-6 text-sm font-medium transition-colors ${
                activeTab === 'discuss' 
                  ? 'border-b-2 border-blue-600 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
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
                  className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={referencePost 
                    ? `Write your reply to this post...` 
                    : "Share your opinion, identify loopholes, or suggest changes..."}
                  required
                  disabled={submitting}
                />
                <button 
                  type="submit"
                  disabled={submitting}
                  className={`mt-4 bg-green-600 text-white font-bold py-3 px-8 rounded-lg shadow hover:bg-green-700 transition duration-150 ${
                    submitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {submitting ? 'Submitting...' : (referencePost ? 'Post Reply' : 'Submit Opinion')}
                </button>
              </form>
            )}
            
            {activeTab === 'discuss' && (
              <div className="space-y-4">
                {loadingDiscussions ? (
                  <p className="text-gray-600">Loading discussions...</p>
                ) : discussions.length === 0 ? (
                  <div className="text-gray-600 p-6 bg-gray-50 rounded text-center">
                    <p>No discussions yet for this article. Be the first to share your opinion!</p>
                  </div>
                ) : (
                  discussions.map(post => (
                    <ReplyPost
                      key={post.postId}
                      post={post}
                      level={0}
                      onAgree={handleAgreeClick}
                      onDisagree={handleDisagreeClick}
                      onComment={handlePostClick}
                      onReply={handleInlineReply}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ConstitutionPage;
