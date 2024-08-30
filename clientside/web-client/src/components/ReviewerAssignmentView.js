import React, { useState, useEffect, useRef } from "react";
import Spinner from "../util/Spinner";
import {
  Form,
  FormGroup,
  Button,
  Alert,
  Container,
  Col,
  Row,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import StatusBadge from "../util/StatusBadge";
import { useAuth } from "../context/AuthContext";
import {
  getAssignmentById,
  getComments,
  postComment,
  putRejectAssignment,
  putReviewAssignment,
} from "../api/Service";
import { jwtDecode } from "jwt-decode";

const ReviewerAssignmentView = () => {
  const { jwt, logout } = useAuth();
  const navigate = useNavigate();

  const {assignmentId} = useParams();

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
  const [assignmentNumbers, setAssignmentNumberEnums] = useState([]);
  const [assignmentStatuses, setAssignmentStatusEnums] = useState([]);
  const prevAssignment = useRef(assignment);

  useEffect(() => {
    fetchAssignmentById();
  }, [assignmentId]);

  useEffect(()=>{
    fetchComments();
  }, [assignmentId]);

  useEffect(() => {
    prevAssignment.current = assignment;
  }, [assignment]);

  async function fetchAssignmentById() {
    console.log("fetching");
    try {
      setLoading(true);
      const response = await getAssignmentById(assignmentId, jwt);
      console.log("response", response);
      
      if (response.status === 200) {
        setAssignment(response.data);
        setAssignmentNumberEnums(response.data.assignmentNumberEnums || []);
        setAssignmentStatusEnums(response.data.assignmentStatusEnums || []);
      }
    } catch (error) {
      if (error.message === "Session expired. Please log in again.") {
        logout();
        alert("Your session has expired. Please log in again.");
        navigate("/login");
      }
      console.error("Error fetching assignment:", error);
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  }
  async function fetchComments(){
    try {
      setLoading(true);
      const response = await getComments(assignmentId, jwt);
      if (response.status === 200) {
        setComments(response.data);
      }
      console.log("Success Comments", comments);
    } catch (error) {
      if (error.message === "Session expired. Please log in again.") {
        logout();
        alert("Your session has expired. Please log in again.");
        navigate("/login");
      }
      console.error("Error fetching assignment:", error);
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  }

  function reviewedAssignment(prop, value) {
    setAssignment((prevAssignment) => ({
      ...prevAssignment,
      [prop]: value,
    }));
  }

  async function reviewAssignment() {
    try {
      const revAssignment = {
        ...assignment,
        status: "Completed",
      };
      const response = await putReviewAssignment(
        revAssignment,
        assignmentId,
        jwt
      );
      if (response.status === 200) {
        setAssignment(response.data);
        alert("ASSIGNMENT REVIEW COMPLETED!");
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.message === "Session expired. Please log in again.") {
        logout();
        alert("Your session has expired. Please log in again.");
        navigate("/login");
      } else {
        alert(
          "FAILED TO REVIEW ASSIGNMENT: " + error.response?.data?.message ||
            error.message
        );
      }
      console.error(error);
    }
  }

  async function rejectAssignment() {
    try {
      const rejectedAssignment = {
        ...assignment,
        status: "Needs update",
      };
      const response = await putRejectAssignment(
        rejectedAssignment,
        assignmentId,
        jwt
      );
      if (response.status === 200) {
        setAssignment(response.data);
        alert("ASSIGNMENT REJECTED!");
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.message === "Session expired. Please log in again.") {
        logout();
        alert("Your session has expired. Please log in again.");
        navigate("/login");
      } else {
        alert(
          "FAILED TO REVIEW ASSIGNMENT: " + error.response?.data?.message ||
            error.message
        );
      }
      console.error(error);
    }
  }

  function updateComment(value) {
    const newComment = { ...comment };
    newComment.text = value;
    setComment(newComment);
    console.log("sending-->", newComment);    
  }

  async function handleCommentSubmit() {
    try {
      const response = await postComment(comment, assignmentId, jwt);
      setComment(response);
      if (response.status ===200) {
        alert("Comment added successfully!");
        fetchAssignmentById();
      }
    } catch (error) {
      if (error.message === "Session expired. Please log in again.") {
        logout();
        alert("Your session has expired. Please log in again.");
        navigate("/login");
      }
      console.error("Error: ", error?.message);
      setError(
        "Failed to create assignment: " +
          (error.response?.data?.message || error.message)
      );
    }
  }

  if (loading) {
    return (
      <Container className="d-flex justify-content-center mt-5">
        <Spinner animation="border" role="status">
          <span className="sr-only">loading</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return <Alert variant="danger">Error: {error}</Alert>;
  }

  return (
    <div>
      <Container className="mt-3 p-4 bg-white shadow-md rounded">
        <Row className="d-flex align-items-center mb-4">
          <Col>
            <h3 className="text-2xl font-bold">
              {console.log("assignment->", assignment)
              }
              Assignment {assignment.assignmentNumber?.assignmentNumber}
            </h3>
          </Col>
          <Col>
            <StatusBadge text={assignment.status} />
          </Col>
        </Row>
        <Form>
          <FormGroup as={Row} className="mb-3" controlId="formGithubUrl">
            <Form.Label column sm="3" className="font-semibold">
              Github URL:
            </Form.Label>
            <Col sm="9">
              <Form.Control
                type="url"
                readOnly
                placeholder="Enter the GitHub URL"
                value={assignment.githubUrl || ""}
                onChange={(e) =>
                  reviewedAssignment("githubUrl", e.target.value)
                }
                className="border border-gray-300 bg-yellow rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </Col>
          </FormGroup>
          <FormGroup as={Row} className="mb-3" controlId="formBranch">
            <Form.Label column sm="3" className="font-semibold">
              Branch:
            </Form.Label>
            <Col sm="9">
              <Form.Control
                type="text"
                readOnly
                placeholder="Enter the branch name"
                value={assignment.branch || ""}
                onChange={(e) => reviewedAssignment("branch", e.target.value)}
                className="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </Col>
          </FormGroup>
          <FormGroup
            as={Row}
            className="mb-3"
            controlId="formCodeReviewVideoUrl"
          >
            <Form.Label column sm="3" className="font-semibold">
              Review Video URL:
            </Form.Label>
            <Col sm="9">
              <Form.Control
                type="url"
                readOnly={assignment.status === "Completed" ? true : false}
                placeholder="https://teams-setter.com/review"
                value={assignment.codeReviewVideoUrl || ""}
                onChange={(e) =>
                  reviewedAssignment("codeReviewVideoUrl", e.target.value)
                }
                className="border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </Col>
          </FormGroup>
          <div>
            {assignment.status === "Completed" ? (
              <></>
            ) : (
              <Button
                type="button"
                className="mt-3 text-white bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 border border-transparent hover:bg-opacity-80 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 transition-all duration-300 shadow-lg transform hover:scale-105"
                onClick={reviewAssignment}
              >
                Complete Review
              </Button>
            )}
          </div>
          <div className="mr-2">
            {assignment.status === "Needs update" ||
            assignment.status === "Completed" ? (
              <></>
            ) : (
              <Button
                type="button"
                variant="danger"
                className="mt-3 bg-danger mr-5 border-none hover:bg-danger text-white font-bold px-5 py-2.5 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-danger focus:ring-offset-2 transition-all duration-300 shadow-lg transform hover:scale-105 text-center me-2 mb-2"
                onClick={rejectAssignment}
              >
                Reject Assignment
              </Button>
            )}
            <div className="mt-4 bg-gray-100 rounded-lg shadow-md p-4">
              <textarea
                className="w-full p-3 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out resize-none"
                rows="4"
                onChange={(e) => updateComment(e.target.value)}
                value={comment.text}
                placeholder="Write your comment here..."
              ></textarea>
              <Button
                variant="primary"
                type="button"
                onClick={handleCommentSubmit}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Post Comment
              </Button>
            </div>
            <div className="bg-gray mt-2">
              {comments ?     
              comments.map((comment)=>(
              <textarea
                key={comment.id}
                className="w-full p-2 mb-2 border bg-gray-100 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out resize-none"
                rows="4"
                readOnly
                onChange={(e) => updateComment(e.target.value)}
                value={comment.text}
                placeholder="Write your comment here..."
              ></textarea>))
              :<></>}
            </div>
          </div>
        </Form>
      </Container>
    </div>
  );
};

export default ReviewerAssignmentView;
