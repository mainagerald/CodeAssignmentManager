import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocalStorageState } from "../util/useLocalState";
import { Form, FormGroup, Button, Alert, Container, Col, Row, DropdownButton, Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const CreateAssignmentView = () => {
  const [auth] = useLocalStorageState("", "jwt");
  const [assignment, setAssignment] = useState({
    branch: "",
    githubUrl: "",
    codeReviewVideoUrl: "",
    assignmentNumber: null,
    status: "Pending Submission",
  });
  const [error, setError] = useState(null);
  const [assignmentNumberEnums, setAssignmentNumberEnums] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssignmentEnums();
  }, []);

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
    if (!assignment.assignmentNumber || !assignment.githubUrl || !assignment.branch) {
      setError("Please fill in all required fields: Assignment Number, Github URL, and Branch.");
      return;
    }

    try {
      const assignmentToSubmit = {
        ...assignment,
        assignmentNumber: parseInt(assignment.assignmentNumber, 10),
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
      setError("Failed to create assignment: " + (error.response?.data?.message || error.message));
    }
  }

  return (
    <Container className="mt-5">
      <h3>Create New Assignment</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form>
        <FormGroup as={Row} className="mb-3" controlId="formAssignmentNumber">
          <Form.Label column sm="3">Assignment Number:*</Form.Label>
          <Col sm="9">
            <DropdownButton
              id="dropdown-assignment-number"
              title={assignment.assignmentNumber ? `Assignment ${assignment.assignmentNumber}` : "Select Assignment Number"}
              onSelect={(eventKey) => updateAssignment("assignmentNumber", eventKey)}
            >
              {assignmentNumberEnums.map((item) => (
                <Dropdown.Item key={item.assignmentNumber} eventKey={item.assignmentNumber}>
                  Assignment {item.assignmentNumber}: {item.name}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </Col>
        </FormGroup>
        <FormGroup as={Row} className="mb-3" controlId="formGithubUrl">
          <Form.Label column sm="3">Github URL:*</Form.Label>
          <Col sm="9">
            <Form.Control
              type="url"
              placeholder="Enter the GitHub URL"
              value={assignment.githubUrl || ""}
              onChange={(e) => updateAssignment("githubUrl", e.target.value)}
              required
            />
          </Col>
        </FormGroup>
        <FormGroup as={Row} className="mb-3" controlId="formBranch">
          <Form.Label column sm="3">Branch:*</Form.Label>
          <Col sm="9">
            <Form.Control
              type="text"
              placeholder="Enter the branch name"
              value={assignment.branch || ""}
              onChange={(e) => updateAssignment("branch", e.target.value)}
              required
            />
          </Col>
        </FormGroup>
        <FormGroup as={Row} className="mb-3" controlId="formCodeReviewVideoUrl">
          <Form.Label column sm="3">Code Review Video URL:</Form.Label>
          <Col sm="9">
            <Form.Control
              type="url"
              placeholder="Enter the code review video URL"
              value={assignment.codeReviewVideoUrl || ""}
              onChange={(e) => updateAssignment("codeReviewVideoUrl", e.target.value)}
            />
          </Col>
        </FormGroup>
        <Button
          type="button"
          className="mt-3"
          variant="primary"
          onClick={submitNewAssignment}
        >
          Create Assignment
        </Button>
      </Form>
    </Container>
  );
};

export default CreateAssignmentView;