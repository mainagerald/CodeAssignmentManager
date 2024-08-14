import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocalStorageState } from "../util/useLocalState";
import {
  Form,
  FormGroup,
  Button,
  Alert,
  Container,
  Col,
  Row,
} from "react-bootstrap";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Navbar from "./Navbar";

const CreateAssignmentView = () => {
  const [auth] = useLocalStorageState("", "jwt");
  const location = useLocation();
  const nextAssignmentNumber = location.state?.nextAssignmentNumber;
  const [assignment, setAssignment] = useState({
    branch: "",
    githubUrl: "",
    codeReviewVideoUrl: "",
    assignmentNumber: nextAssignmentNumber,
    status: "Pending Submission",
  });
  const [error, setError] = useState(null);
  const [assignmentNumberEnums, setAssignmentNumberEnums] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssignmentEnums();
    console.log("Next assignment number:", nextAssignmentNumber); // Debug log
  }, [nextAssignmentNumber]);

  async function fetchAssignmentEnums() {
    try {
      const response = await axios.get(
        "http://localhost:8888/api/assignments/enums",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth}`,
          },
        }
      );
      if (response.status === 200) {
        setAssignmentNumberEnums(response.data.assignmentNumberEnums);
      }
    } catch (error) {
      console.error("Error fetching assignment enums:", error);
      setError(error.response?.data?.message || error.message);
    }
  }

  function updateAssignment(prop, value) {
    setAssignment((prevAssignment) => ({
      ...prevAssignment,
      [prop]: value,
    }));
  }

  async function submitNewAssignment() {
    if (!assignment.githubUrl || !assignment.branch) {
      setError("Please fill in all required fields: Github URL and Branch.");
      return;
    }

    try {
      const assignmentToSubmit = {
        ...assignment,
        assignmentNumber: nextAssignmentNumber,
      };

      const response = await axios.post(
        "http://localhost:8888/api/assignments/create",
        assignmentToSubmit,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth}`,
          },
        }
      );
      console.log("Creating assignment:", assignmentToSubmit);
      console.log("Response:", response);

      if (response.status === 201) {
        alert("Assignment created successfully!");
        navigate(`/assignments/${response.data.id}`);
      }
    } catch (error) {
      console.error("Error: ", error?.message);
      setError(
        "Failed to create assignment: " +
          (error.response?.data?.message || error.message)
      );
    }
  }

  const currentAssignmentInfo = assignmentNumberEnums.find(
    (a) => a.assignmentNumber === nextAssignmentNumber
  );

  if (!nextAssignmentNumber) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar/>
    <Container className="mt-5 p-4">
      <h3 className="mb-4 text-2xl font-bold">Create New Assignment</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <FormGroup as={Row} className="mb-4">
          <Form.Label column sm="3" className="font-bold">
            Assignment Number:
          </Form.Label>
          <Col sm="9">
            <div className="py-2 px-3 bg-gray-100 rounded">
              Assignment {nextAssignmentNumber}:{" "}
              {currentAssignmentInfo ? currentAssignmentInfo.name : ""}
            </div>
          </Col>
        </FormGroup>
        <FormGroup as={Row} className="mb-4" controlId="formGithubUrl">
          <Form.Label column sm="3" className="font-bold">
            Github URL:*
          </Form.Label>
          <Col sm="9">
            <Form.Control
              type="url"
              placeholder="Enter the GitHub URL"
              value={assignment.githubUrl || ""}
              onChange={(e) => updateAssignment("githubUrl", e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </Col>
        </FormGroup>
        <FormGroup as={Row} className="mb-4" controlId="formBranch">
          <Form.Label column sm="3" className="font-bold">
            Branch:*
          </Form.Label>
          <Col sm="9">
            <Form.Control
              type="text"
              placeholder="Enter the branch name"
              value={assignment.branch || ""}
              onChange={(e) => updateAssignment("branch", e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </Col>
        </FormGroup>
        <FormGroup as={Row} className="mb-4" controlId="formCodeReviewVideoUrl">
          <Form.Label column sm="3" className="font-bold">
            Code Review Video URL:
          </Form.Label>
          <Col sm="9">
            <Form.Control
              type="url"
              placeholder="Enter the code review video URL"
              value={assignment.codeReviewVideoUrl || ""}
              onChange={(e) =>
                updateAssignment("codeReviewVideoUrl", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </Col>
        </FormGroup>
        <Button
          type="button"
          className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={submitNewAssignment}
        >
          Create Assignment
        </Button>
        <div className="mt-3">
          <Link to="/dashboard" color="secondary">
            Go to dashboard
          </Link>
        </div>
      </Form>
    </Container>
    </div>
  );
};

export default CreateAssignmentView;
