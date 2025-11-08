import React from 'react';
import { FaThumbsUp, FaThumbsDown, FaCommentDots, FaFire } from 'react-icons/fa';

const PostCard = ({ 
  post, 
  index, 
  onAgree, 
  onDisagree, 
  onComment,
  showTrendingBadge = false,
  showInteractionButtons = true 
}) => {
  const userAgreed = post.userVote === 'agree';
  const userDisagreed = post.userVote === 'disagree';
  const displayUserId = post.userId?.userId || post.userId || 'Unknown';
  const borderColor = showTrendingBadge ? 'border-orange-500' : 'border-blue-500';

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition duration-300 border-l-4 ${borderColor}`}
    >
      {/* Header */}
      <header className="flex justify-between items-start text-sm text-gray-500 mb-2">
        <div className="flex items-center gap-3">
          {showTrendingBadge && index !== undefined && (
            <div className="bg-orange-500 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center text-sm">
              #{index + 1}
            </div>
          )}
          <div>
            <span className="block">User ID: {displayUserId}</span>
            {post.articleNumber && (
              <span className="block text-xs text-gray-400">Article {post.articleNumber}</span>
            )}
          </div>
        </div>
        <div className="text-right">
          <span className="block">Post ID: {post.postId}</span>
          {showTrendingBadge && post.recentInteractions !== undefined && (
            <div className="flex items-center gap-1 text-orange-600 font-semibold text-xs mt-1">
              <FaFire className="text-xs" />
              <span>{post.recentInteractions} recent</span>
            </div>
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
        <footer className="flex justify-start space-x-4 border-t border-gray-200 pt-4">
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

          {/* Comment / Post */}
          <button
            onClick={() => onComment && onComment(post.postId)}
            disabled={!onComment}
            className={`flex items-center space-x-2 bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg transition duration-150 hover:bg-gray-300 ${
              !onComment ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <FaCommentDots />
            <span>Post / Comment</span>
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