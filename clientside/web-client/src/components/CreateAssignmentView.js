import React, { useState, useEffect } from "react";
import { Form, FormGroup, Button, Alert, Container, Col, Row } from "react-bootstrap";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createAssignment, getAssignmentEnums } from "../api/Service";

const CreateAssignmentView = () => {
  const { jwt, logout } = useAuth();
  const location = useLocation();
  const nextAssignmentNumber = location.state?.nextAssignmentNumber;
  const [assignment, setAssignment] = useState({
    branch: "",
    githubUrl: "",
    assignmentNumber: nextAssignmentNumber,
    status: "Pending Submission",
  });
  const [error, setError] = useState(null);
  const [assignmentNumberEnums, setAssignmentNumberEnums] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssignmentEnums();
  }, [nextAssignmentNumber]);

  const fetchAssignmentEnums = async () => {
    try {
      const response = await getAssignmentEnums(jwt);
      setAssignmentNumberEnums(response.assignmentNumberEnums);
    } catch (error) {
      handleAuthError(error);
      setError(error.response?.data?.message || error.message);
    }
  };

  const handleAuthError = (error) => {
    if (error.message === "Session expired. Please log in again.") {
      logout();
      alert("Your session has expired. Please log in again.");
      navigate("/login");
    }
  };

  const updateAssignment = (prop, value) => {
    setAssignment((prev) => ({ ...prev, [prop]: value }));
  };

  const submitNewAssignment = async () => {
    if (!assignment.githubUrl || !assignment.branch) {
      setError("Please fill in all required fields: Github URL and Branch.");
      return;
    }

    try {
      const newAssignment = { ...assignment, assignmentNumber: nextAssignmentNumber - 1 };
      const response = await createAssignment(newAssignment, jwt);
      if (response.status === 201) {
        alert("Assignment created successfully!");
        navigate("/dashboard");
      }
    } catch (error) {
      handleAuthError(error);
      setError("Failed to create assignment: " + (error.response?.data?.message || error.message));
    }
  };

  const currentAssignmentInfo = assignmentNumberEnums.find(
    (a) => a.assignmentNumber === nextAssignmentNumber
  );

  if (!nextAssignmentNumber) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="mt-5 p-4">
      <h3 className="mb-4 text-2xl font-bold">Create New Assignment</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <FormGroup as={Row} className="mb-4">
          <Form.Label column sm="3" className="font-bold">Assignment Number:</Form.Label>
          <Col sm="9">
            <div className="py-2 px-3 bg-gray-100 rounded">
              Assignment {nextAssignmentNumber}: {currentAssignmentInfo?.name || ""}
            </div>
          </Col>
        </FormGroup>
        <FormGroup as={Row} className="mb-4" controlId="formGithubUrl">
          <Form.Label column sm="3" className="font-bold">Github URL:*</Form.Label>
          <Col sm="9">
            <Form.Control
              type="url"
              placeholder="Enter the GitHub URL"
              value={assignment.githubUrl}
              onChange={(e) => updateAssignment("githubUrl", e.target.value)}
              required
            />
          </Col>
        </FormGroup>
        <FormGroup as={Row} className="mb-4" controlId="formBranch">
          <Form.Label column sm="3" className="font-bold">Branch:*</Form.Label>
          <Col sm="9">
            <Form.Control
              type="text"
              placeholder="Enter the branch name"
              value={assignment.branch}
              onChange={(e) => updateAssignment("branch", e.target.value)}
              required
            />
          </Col>
        </FormGroup>
        <Button
          type="button"
          className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
          onClick={submitNewAssignment}
        >
          Create Assignment
        </Button>
        <div className="mt-3">
          <Link to="/dashboard">Go to dashboard</Link>
        </div>
      </Form>
    </Container>
  );
};

export default CreateAssignmentView;
