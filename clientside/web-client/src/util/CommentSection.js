import React from 'react'
import Comment from './Comment';
import { Button } from 'react-bootstrap';

const CommentSection = ({
    comment,
    setComment,
    onSubmit,
    comments,
    currentUserId,
    onEdit,
    onDelete,
  }) => (
    <div className="mt-4 bg-white rounded-lg shadow-md p-6">
      <textarea
        className="w-full p-4 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out resize-none"
        rows="4"
        onChange={(e) => setComment((prev) => ({ ...prev, text: e.target.value }))}
        value={comment.text}
        placeholder="Write your comment here..."
      />
      <Button
        variant="primary"
        type="button"
        onClick={onSubmit}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Post Comment
      </Button>
      <div className="mt-4">
        {comments.length > 0 ? (
          comments
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((comment) => (
              <Comment
                key={comment.id}
                keyId={comment.id}
                username={comment.username}
                text={comment.text}
                showEditButton={comment.createdBy === currentUserId}
                onEdit={() => onEdit(comment.id)}
                showDeleteButton={comment.createdBy === currentUserId}
                onDelete={() => onDelete(comment.id)}
                createdAt={comment.createdAt}
              />
            ))
        ) : (
          <div className="text-gray-500 dark:text-gray-400 text-center">
            No comments available.
          </div>
        )}
      </div>
    </div>
  );
  

export default CommentSection
