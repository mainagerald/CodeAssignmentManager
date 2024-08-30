import React from "react";

const Comment = (props) => {
    const timeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        let interval = Math.floor(seconds / 31536000);
      
        if (interval >= 1) return `${interval} year${interval > 1 ? 's' : ''} ago`;
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) return `${interval} month${interval > 1 ? 's' : ''} ago`;
        interval = Math.floor(seconds / 86400);
        if (interval >= 1) return `${interval} day${interval > 1 ? 's' : ''} ago`;
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) return `${interval} hour${interval > 1 ? 's' : ''} ago`;
        interval = Math.floor(seconds / 60);
        if (interval >= 1) return `${interval} minute${interval > 1 ? 's' : ''} ago`;
        return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
      };

  const { keyId, username, text, createdAt, onReply, onDelete, showDeleteButton } = props;

  return (
    <div
      key={keyId}
      className="flex items-start bg-gray-100 p-4 mb-4 rounded-xl shadow-md transition-transform transform hover:scale-105"
    >
      <div className="flex-1">
        <div className="font-semibold text-gray-800 dark:text-gray-200">
          {username}
        </div>
        <div className="text-gray-600 dark:text-gray-400 mt-1">{text}</div>
        <div className="text-sm text-gray-500 dark:text-gray-500 mt-2 mr-0">
          {timeAgo(createdAt)}
        </div>
        <div className="flex items-center mt-2 space-x-4">
          <button
            onClick={onReply}
            className="text-blue-500 hover:text-blue-700 font-semibold"
          >
            Reply
          </button>
          {showDeleteButton && (
            <button
              onClick={onDelete}
              className="text-red-500 hover:text-red-700 font-semibold"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comment;
