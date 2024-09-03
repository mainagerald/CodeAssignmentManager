import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { jwtDecode } from "jwt-decode";

import Spinner from "../util/Spinner";
import StatusBadge from "../util/StatusBadge";
import Comment from "../util/Comment";
import { useAuth } from "../context/AuthContext";
import {
  deleteComment,
  editComment,
  getAssignmentById,
  getComments,
  postComment,
  putRejectAssignment,
  putReviewAssignment,
  rejectAssignment,
  reviewAssignment,
} from "../api/Service";

const ReviewerAssignmentView = () => {
  const { jwt, logout } = useAuth();
  const navigate = useNavigate();
  const { assignmentId } = useParams();

  const [assignment, setAssignment] = useState({
    branch: "",
    githubUrl: "",
    assignmentNumber: null,
    status: null,
    codeReviewVideoUrl: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState({
    text: "",
    assignment: assignmentId,
    createdBy: jwtDecode(jwt).userId,
  });
  const [comments, setComments] = useState([]);

  const fetchAssignmentById = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAssignmentById(assignmentId, jwt);      
      setAssignment(response);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [assignmentId, jwt]);

  const fetchComments = useCallback(async () => {
    try {
      const response = await getComments(assignmentId, jwt);
      setComments(response);
    } catch (error) {
      handleError(error);
    }
  }, [assignmentId, jwt]);

  useEffect(() => {
    fetchAssignmentById();
    fetchComments();
  }, [fetchAssignmentById, fetchComments]);

  const handleError = (error) => {
    if (error.message === "Session expired. Please log in again.") {
      logout();
      alert("Your session has expired. Please log in again.");
      navigate("/login");
    } else {
      console.error("Error:", error);
      setError(error.response?.data?.message || error.message);
    }
  };

  const updateAssignment = (prop, value) => {
    setAssignment((prev) => ({ ...prev, [prop]: value }));
  };

  const handleReviewAssignment = async (status) => {
    try {
      const updatedAssignment = { ...assignment, status };
      const response = await (status === "Completed"
        ? reviewAssignment(updatedAssignment, assignmentId, jwt)
        : rejectAssignment(updatedAssignment, assignmentId, jwt));

      if (response.status === 200) {
        setAssignment(response.data);
        alert(`Assignment ${status === "Completed" ? "reviewed" : "rejected"}!`);
        navigate("/dashboard");
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleCommentSubmit = async () => {
    try {
      const response = await postComment(comment, assignmentId, jwt);
      if (response.status === 200) {
        alert("Comment added successfully!");
        fetchComments();
        setComment((prev) => ({ ...prev, text: "" }));
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleCommentAction = async (action, commentId) => {
    try {
      let response;
      if (action === "edit") {
        response = await editComment(commentId, jwt);
      } else if (action === "delete") {
        response = await deleteComment(commentId, jwt);
      }

      if (response.status === 200) {
        alert(`Comment ${action === "edit" ? "updated" : "deleted"}!`);
        fetchComments();
      }
    } catch (error) {
      handleError(error);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center mt-5">
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return <Alert variant="danger">Error: {error}</Alert>;
  }

  return (
    <Container className="mt-3 p-4 bg-white rounded">
      <Row className="d-flex align-items-center mb-4">
        <Col>
          <h3 className="text-2xl font-bold">
            Assignment {assignment.assignmentNumber?.assignmentNumber}
          </h3>
        </Col>
        <Col>
          <StatusBadge text={assignment.status} />
        </Col>
      </Row>
      <Form>
        <FormFields assignment={assignment} updateAssignment={updateAssignment} />
        <ReviewActions
          status={assignment.status}
          onReview={() => handleReviewAssignment("Completed")}
          onReject={() => handleReviewAssignment("Needs update")}
        />
        <CommentSection
          comment={comment}
          setComment={setComment}
          onSubmit={handleCommentSubmit}
          comments={comments}
          currentUserId={jwtDecode(jwt).userId}
          onEdit={(id) => handleCommentAction("edit", id)}
          onDelete={(id) => handleCommentAction("delete", id)}
        />
      </Form>
    </Container>
  );
};

const FormFields = ({ assignment, updateAssignment }) => (
  <>
    <Form.Group as={Row} className="mb-3" controlId="formGithubUrl">
      <Form.Label column sm="3" className="font-semibold">
        Github URL:
      </Form.Label>
      <Col sm="9">
        <Form.Control
          type="url"
          readOnly
          value={assignment.githubUrl || ""}
          onChange={(e) => updateAssignment("githubUrl", e.target.value)}
          className="border border-gray-300 bg-yellow rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </Col>
    </Form.Group>
    <Form.Group as={Row} className="mb-3" controlId="formBranch">
      <Form.Label column sm="3" className="font-semibold">
        Branch:
      </Form.Label>
      <Col sm="9">
        <Form.Control
          type="text"
          readOnly
          value={assignment.branch || ""}
          onChange={(e) => updateAssignment("branch", e.target.value)}
          className="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </Col>
    </Form.Group>
    <Form.Group as={Row} className="mb-3" controlId="formCodeReviewVideoUrl">
      <Form.Label column sm="3" className="font-semibold">
        Review Video URL:
      </Form.Label>
      <Col sm="9">
        <Form.Control
          type="url"
          readOnly={assignment.status === "Completed"}
          value={assignment.codeReviewVideoUrl || ""}
          onChange={(e) => updateAssignment("codeReviewVideoUrl", e.target.value)}
          className="border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </Col>
    </Form.Group>
  </>
);

const ReviewActions = ({ status, onReview, onReject }) => (
  <div>
    {status !== "Completed" && (
      <>
        <Button
          type="button"
          className="mt-3 text-white bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 border border-transparent hover:bg-opacity-80 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 transition-all duration-300 shadow-lg transform hover:scale-105"
          onClick={onReview}
        >
          Complete Review
        </Button>
        {status !== "Needs update" && (
          <Button
            type="button"
            variant="danger"
            className="mt-3 bg-danger mr-5 border-none hover:bg-danger text-white font-bold px-5 py-2.5 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-danger focus:ring-offset-2 transition-all duration-300 shadow-lg transform hover:scale-105 text-center me-2 mb-2"
            onClick={onReject}
          >
            Reject Assignment
          </Button>
        )}
      </>
    )}
  </div>
);

const CommentSection = ({
  comment,
  setComment,
  onSubmit,
  comments,
  currentUserId,
  onEdit,
  onDelete,
}) => (
  <div className="mt-4">
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
      {comments ? (
        comments
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((comment) => (
            <Comment
              key={comment.id}
              keyId={comment.id}
              username={comment.username}
              text={comment.text}
              createdAt={comment.createdAt}
              showEditButton={comment.createdBy === currentUserId}
              onEdit={() => onEdit(comment.id)}
              showDeleteButton={comment.createdBy === currentUserId}
              onDelete={() => onDelete(comment.id)}
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

export default ReviewerAssignmentView;