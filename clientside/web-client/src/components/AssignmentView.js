import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Form,
  Button,
  Alert,
  Container,
  Col,
  Row,
  DropdownButton,
  Dropdown,
  ButtonGroup,
} from "react-bootstrap";
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
  updateAssignment,
} from "../api/Service";
import CommentSection from "../util/CommentSection";

const AssignmentView = () => {
  const { jwt, logout } = useAuth();
  const { assignmentId } = useParams();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState({
    branch: "",
    githubUrl: "",
    assignmentNumber: null,
    status: null,
    codeReviewVideoUrl: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assignmentNumbers, setAssignmentNumberEnums] = useState([]);
  const [assignmentStatuses, setAssignmentStatusEnums] = useState([]);
  const [comment, setComment] = useState({
    text: "",
    assignment: assignmentId,
    createdBy: jwtDecode(jwt).userId,
  });
  const [comments, setComments] = useState([]);

  const handleError = useCallback((error) => {
    if (error.message === "Session expired. Please log in again.") {
      logout();
      alert("Your session has expired. Please log in again.");
      navigate("/login");
    } else {
      console.error("An error occurred:", error.message);
      setError("Failed to update assignment.");
    }
  }, [logout, navigate]);

  const fetchAssignment = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAssignmentById(assignmentId, jwt);
      console.log("view response", response);
      
      setAssignment(response);
      setAssignmentNumberEnums(response.assignmentNumberEnums || []);
      setAssignmentStatusEnums(response.assignmentStatusEnums || []);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [assignmentId, jwt, handleError]);

  const fetchComments = useCallback(async () => {
    try {
      const response = await getComments(assignmentId, jwt);
        setComments(response);
    } catch (error) {
      handleError(error);
    }
  }, [assignmentId, jwt, handleError]);

  useEffect(() => {
    fetchAssignment();
    fetchComments();
  }, [fetchAssignment, fetchComments]);

  const updateAssignmentState = (prop, value) => {
    setAssignment((prev) => ({ ...prev, [prop]: value }));
  };

  const submitUpdatedAssignment = async () => {
    try {
      const updatedAssignment = {
        ...assignment,
        status: "Submitted",
      };
      const response = await updateAssignment(assignmentId, updatedAssignment, jwt);
      setAssignment(response);
      alert("Assignment updated and submitted successfully!");
      navigate("/dashboard");
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
      const response = await (action === "edit" ? editComment(commentId, jwt) : deleteComment(commentId, jwt));
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
    <Container className="mt-3 p-4 bg-white shadow-md rounded">
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
        <AssignmentForm
          assignment={assignment}
          assignmentNumbers={assignmentNumbers}
          updateAssignmentState={updateAssignmentState}
        />
        {assignment.status !== "Completed" && (
          <Button
            type="button"
            className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={submitUpdatedAssignment}
          >
            Submit Assignment
          </Button>
        )}
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

const AssignmentForm = ({ assignment, assignmentNumbers, updateAssignmentState }) => (
  <>
    <Form.Group as={Row} className="mb-3" controlId="formAssignmentNumber">
      <Form.Label column sm="3" className="font-semibold">
        Assignment Number:
      </Form.Label>
      <Col sm="9">
        <DropdownButton
          as={ButtonGroup}
          id="assignmentNumber"
          variant="info"
          title={
            assignment.assignmentNumber
              ? `Assignment ${assignment.assignmentNumber.assignmentNumber}`
              : "Select Assignment"
          }
          onSelect={(eventKey) =>
            updateAssignmentState(
              "assignmentNumber",
              assignmentNumbers.find(
                (item) => item.assignmentNumber === parseInt(eventKey)
              )
            )
          }
          className="w-full"
        >
          {assignmentNumbers.map((item) => (
            <Dropdown.Item
              key={item.assignmentNumber}
              eventKey={item.assignmentNumber}
            >
              Assignment {item.assignmentNumber}: {item.name}
            </Dropdown.Item>
          ))}
        </DropdownButton>
      </Col>
    </Form.Group>
    <Form.Group as={Row} className="mb-3" controlId="formGithubUrl">
      <Form.Label column sm="3" className="font-semibold">
        Github URL:
      </Form.Label>
      <Col sm="9">
        <Form.Control
          type="url"
          placeholder="Enter the GitHub URL"
          value={assignment.githubUrl || ""}
          onChange={(e) => updateAssignmentState("githubUrl", e.target.value)}
          className="border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
          placeholder="Enter the branch name"
          value={assignment.branch || ""}
          onChange={(e) => updateAssignmentState("branch", e.target.value)}
          className="border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </Col>
    </Form.Group>
    {assignment.status === "Completed" && (
      <Form.Group as={Row} className="mb-3" controlId="formCodeReviewVideoUrl">
        <Form.Label column sm="3" className="font-semibold">
          Review Video URL:
        </Form.Label>
        <Col sm="9" className="d-flex align-items-center font-semibold text-lg">
          <a href={assignment.codeReviewVideoUrl} target="_blank" rel="noopener noreferrer">
            {assignment.codeReviewVideoUrl}
          </a>
        </Col>
      </Form.Group>
    )}
  </>
);

export default AssignmentView;