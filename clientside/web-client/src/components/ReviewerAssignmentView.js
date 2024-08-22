import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useLocalStorageState } from "../util/useLocalState";
import Spinner from "../util/Spinner";
import {
  Form,
  FormGroup,
  Button,
  Alert,
  Container,
  Col,
  Row,
  Badge,
  DropdownButton,
  Dropdown,
  ButtonGroup,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { BaseUrl } from "../api/Service";


const ReviewerAssignmentView = () => {
  const [auth] = useLocalStorageState("", "jwt");
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
  const prevAssignment = useRef(assignment);
  const assignmentId = window.location.href.split("/assignments/")[1];
  const navigate = useNavigate();

  useEffect(() => {
    getAssignmentById();
  }, [assignmentId]);

  useEffect(() => {
    prevAssignment.current = assignment;
  }, [assignment]);

  async function getAssignmentById() {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BaseUrl}/assignments/getById/${assignmentId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth}`,
          },
        }
      );
      if (response.status === 200) {
        setAssignment(response.data);
        setAssignmentNumberEnums(response.data.assignmentNumberEnums || []);
        setAssignmentStatusEnums(response.data.assignmentStatusEnums || []);
      }
      console.log("data", response.data);
    } catch (error) {
      console.error("Error fetching assignment:", error);
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  }

  function reviewedAssignment(prop, value) {
    setAssignment((prevAssignment) =>({
        ...prevAssignment,
        [prop]: value,
       }));
  }

  async function reviewAssignment() {
    try {
        const revAssignment = {
            ...assignment,
            status: "Completed"
        }
      const response = await axios.put(
        `${BaseUrl}/assignments/review/${assignment.id}`,
        revAssignment,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth}`,
          },
        }
      );
      if (response.status === 200) {
        setAssignment(response.data);
        alert("ASSIGNMENT REVIEW COMPLETED!");
        navigate("/dashboard")
      }
    } catch (error) {
      alert(
        "FAILED TO REVIEW ASSIGNMENT: " + error.response?.data?.message ||
          error.message
      );
      console.error(error);
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
          <h3 className="text-2xl font-bold">Assignment {assignment.assignmentNumber?.assignmentNumber}</h3>
        </Col>
        <Col>
          <Badge pill bg={assignment.status === "Completed" ? "success" : "info"} style={{ fontSize: "1.1rem" }}>
            {assignment.status}
          </Badge>
        </Col>
      </Row>
      <Form>
        <FormGroup as={Row} className="mb-3" controlId="formGithubUrl">
          <Form.Label column sm="3" className="font-semibold">Github URL:</Form.Label>
          <Col sm="9">
            <Form.Control
              type="url"
              readOnly
              placeholder="Enter the GitHub URL"
              value={assignment.githubUrl || ""}
              onChange={(e) => reviewedAssignment("githubUrl", e.target.value)}
              className="border border-gray-300 bg-yellow rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </Col>
        </FormGroup>
        <FormGroup as={Row} className="mb-3" controlId="formBranch">
          <Form.Label column sm="3" className="font-semibold">Branch:</Form.Label>
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
        <FormGroup as={Row} className="mb-3" controlId="formCodeReviewVideoUrl">
          <Form.Label column sm="3" className="font-semibold">Review Video URL:</Form.Label>
          <Col sm="9">
            <Form.Control
              type="url"
              placeholder="https://teams-setter.com/review"
              value={assignment.codeReviewVideoUrl || ""}
              onChange={(e) =>
                reviewedAssignment("codeReviewVideoUrl", e.target.value)
              }
              className="border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </Col>
        </FormGroup>
        <Button
          type="button"
          className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={reviewAssignment}
        >
          Complete Assignment Review
        </Button>
      </Form>
    </Container>
    </div>
  );
};

export default ReviewerAssignmentView
