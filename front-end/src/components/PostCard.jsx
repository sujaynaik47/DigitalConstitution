// PostCard.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaThumbsUp, FaThumbsDown, FaCommentDots, FaStar, FaGavel, FaExternalLinkAlt } from 'react-icons/fa';

const PostCard = ({ 
  post, 
  index, 
  onAgree, 
  onDisagree, 
  onComment,
  showTrendingBadge = false,
  showInteractionButtons = true,
  userRole = null // Pass user role from parent to avoid multiple API calls
}) => {
  const navigate = useNavigate();
  const userAgreed = post.userVote === 'agree';
  const userDisagreed = post.userVote === 'disagree';
  const displayUserId = post.userId?.userId || post.userId || 'Unknown';
  const borderColor = showTrendingBadge ? 'border-orange-500' : 'border-blue-500';

  // Check if user is Expert or Law Maker
  const isExpertOrLawMaker = userRole === 'Expert' || userRole === 'Law Maker';
  const userIdColor = isExpertOrLawMaker ? 'text-yellow-600 font-bold' : 'text-gray-700';
  
  // Determine badge icon and text
  const getBadge = () => {
    if (userRole === 'Expert') {
      return { 
        icon: <FaStar className="text-yellow-500" />, 
        text: 'Expert', 
        color: 'bg-yellow-50 border-yellow-400 text-yellow-700' 
      };
    } else if (userRole === 'Law Maker') {
      return { 
        icon: <FaGavel className="text-yellow-600" />, 
        text: 'Law Maker', 
        color: 'bg-yellow-50 border-yellow-500 text-yellow-800' 
      };
    }
    return null;
  };

  const badge = getBadge();

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'Date unknown';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return diffMinutes <= 1 ? 'Just now' : `${diffMinutes} minutes ago`;
      }
      return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  // Handle navigation to article in Constitution page
  const handleArticleClick = () => {
    if (post.articleNumber) {
      navigate(`/constitution?article=${post.articleNumber}`);
    }
  };

  // Handle view in discussion
  const handleViewInDiscussion = () => {
    if (post.articleNumber && post.postId) {
      navigate(`/constitution?article=${post.articleNumber}&postId=${post.postId}`);
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition duration-300 border-l-4 ${borderColor}`}
    >
      {/* Header */}
      <header className="flex justify-between items-start text-sm mb-2">
        <div className="flex items-center gap-3">
          {showTrendingBadge && index !== undefined && (
            <div className="bg-orange-500 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center text-sm">
              #{index + 1}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`block ${userIdColor}`}>
                User ID: {displayUserId}
              </span>
              {badge && (
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${badge.color}`}>
                  {badge.icon}
                  <span>{badge.text}</span>
                </span>
              )}
            </div>
            {/* {post.articleNumber && (
              <button
                onClick={handleArticleClick}
                className="text-3xl  flex items-center gap-1 mt-1 text-blue-600 hover:text-blue-800 hover:underline transition-colors "

              >
                <span className="text-sm font-large">Article: {post.articleNumber}</span>
                {/* <FaExternalLinkAlt className="text-xs" />}
              </button>
            )} */}

            {post.articleNumber && (
              <button
                onClick={handleArticleClick}
                className="text-l font-semibold flex items-center gap-2 mt-2 px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-900 hover:underline transition-colors rounded"
              >
                Article: {post.articleNumber}
                {/* <FaExternalLinkAlt className="text-xl" /> */}
              </button>
            )}


          </div>
        </div>
        <div className="text-right text-gray-500">
          <span className="block text-xs">Post ID: {post.postId}</span>
          {post.createdAt && (
            <span className="block text-xs text-gray-400 mt-1">
              {formatDate(post.createdAt)}
            </span>
          )}
        </div>
      </header>

      {/* Content */}
      <h3 className="text-xl font-semibold mb-2 text-blue-700">
        {post.articleTitle}
      </h3>
      <p className="text-gray-600 mb-4">{post.content}</p>

      {/* Footer with interaction buttons */}
      {showInteractionButtons ? (
        <footer className="flex flex-wrap justify-start gap-3 border-t border-gray-200 pt-4">
          {/* Agree button */}
          <button
            onClick={() => onAgree && onAgree(post.postId)}
            disabled={!onAgree}
            className={`flex items-center space-x-2 font-semibold py-2 px-4 rounded-lg transition duration-150 ${
              userAgreed
                ? 'bg-green-600 text-white'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            } ${!onAgree ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <FaThumbsUp />
            <span>{post.agreeCount ?? 0}</span>
          </button>

          {/* Disagree button */}
          <button
            onClick={() => onDisagree && onDisagree(post.postId)}
            disabled={!onDisagree}
            className={`flex items-center space-x-2 font-semibold py-2 px-4 rounded-lg transition duration-150 ${
              userDisagreed
                ? 'bg-red-600 text-white'
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            } ${!onDisagree ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <FaThumbsDown />
            <span>{post.disagreeCount ?? 0}</span>
          </button>

          {/* Comment / Post */}
          <button
            onClick={() => onComment && onComment(post.postId)}
            disabled={!onComment}
            className={`flex items-center space-x-2 bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg transition duration-150 hover:bg-gray-300 ${
              !onComment ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <FaCommentDots />
            <span>Share your opinion on this article</span>
          </button>

          {/* View in Discussion button */}
          <button
            onClick={handleViewInDiscussion}
            className="flex items-center space-x-2 bg-blue-100 text-blue-700 font-semibold py-2 px-4 rounded-lg transition duration-150 hover:bg-blue-200"
          >
            <FaExternalLinkAlt />
            <span>View this post in Discussion</span>
          </button>
        </footer>
      ) : (
        /* Stats-only footer for read-only views */
        <footer className="flex items-center gap-6 pt-4 border-t border-gray-200 text-sm">
          <div className="flex items-center gap-2 text-green-600">
            <FaThumbsUp />
            <span className="font-semibold">{post.agreeCount ?? 0}</span>
            <span className="text-gray-500">Agree</span>
          </div>
          
          <div className="flex items-center gap-2 text-red-600">
            <FaThumbsDown />
            <span className="font-semibold">{post.disagreeCount ?? 0}</span>
            <span className="text-gray-500">Disagree</span>
          </div>

          {post.recentInteractions !== undefined && (
            <div className="flex items-center gap-2 text-gray-600">
              <FaCommentDots />
              <span className="font-semibold">{post.recentInteractions}</span>
              <span className="text-gray-500">Interactions</span>
            </div>
          )}
        </footer>
      )}
    </div>
  );
};

export default PostCard;
