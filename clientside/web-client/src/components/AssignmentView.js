import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocalStorageState } from "../util/useLocalState";
import { Form, FormGroup, FormControl, Button, Alert, Spinner, Container, Col, Row, Badge, DropdownButton, Dropdown, ButtonGroup } from "react-bootstrap";

const AssignmentView = () => {
  const [auth] = useLocalStorageState("", "jwt");
  const [assignment, setAssignment] = useState(null);
  const [error, setError] = useState(null);
  const assignmentId = window.location.href.split("/assignments/")[1];

  useEffect(() => {
    getAssignmentById();
  }, []);

  async function getAssignmentById() {
    try {
      const response = await axios.get(
        `http://localhost:8888/api/assignments/getById/${assignmentId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth}`,
          },
        }
      );
      if (response.status === 200) {
        setAssignment(response.data);
        console.log("Initial assignment data:", response.data);
      }
    } catch (error) {
      console.error("Error fetching assignment:", error);
      setError(error.response?.data?.message || error.message);
    }
  }

  function updateAssignment(prop, value) {
    setAssignment(prevAssignment => ({
      ...prevAssignment,
      [prop]: value
    }));
  }

  async function submitUpdatedAssignment() {
    try {
      console.log("assignment state", assignment);
      const updatedAssignmentResponse = await axios.put(
        `http://localhost:8888/api/assignments/update/${assignmentId}`,
        assignment,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth}`,
          },
        }
      );
      console.log("response from update-->", updatedAssignmentResponse);
      alert("Assignment updated successfully!");
    } catch (error) {
      console.error("Error: ", error?.message);
      setError("Failed to update assignment.");
    }
  }

  if (error) {
    return <Alert variant="danger">Error: {error}</Alert>;
  }

  if (!assignment) {
    return (
      <Container className="d-flex justify-content-center mt-5">
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  const allAssignmentNumbers = [
    { name: "ASSIGNMENT_1", assignmentNumber: 1, description: "simple" },
    { name: "ASSIGNMENT_2", assignmentNumber: 2, description: "mid-medium" },
    { name: "ASSIGNMENT_3", assignmentNumber: 3, description: "medium" },
    { name: "ASSIGNMENT_4", assignmentNumber: 4, description: "mid-hard" },
    { name: "ASSIGNMENT_5", assignmentNumber: 5, description: "hard" },
    { name: "ASSIGNMENT_6", assignmentNumber: 6, description: "professional" },
    { name: "ASSIGNMENT_7", assignmentNumber: 7, description: "world-class" },
    { name: "ASSIGNMENT_8", assignmentNumber: 8, description: "legendary" },
    { name: "ASSIGNMENT_9", assignmentNumber: 9, description: "ultimate" }
  ];

  return (
    <Container className="mt-10">
      <Row className="d-flex align-items-center">
        <Col><h3>Assignment {assignmentId}</h3></Col>
        <Col>
          <Badge pill bg="info" style={{ fontSize: "1.1rem" }}>
            {assignment.status}
          </Badge>
        </Col>
      </Row>
      <FormGroup as={Row} className="my-3" controlId="formPlainTextEmail">
        <Form.Label column sm="3" md="2">Assignment #:</Form.Label>
        <Col sm="9" md="8" lg="6">
          <DropdownButton 
            as={ButtonGroup} 
            id="assignmentNumber" 
            variant="info" 
            title={`Assignment ${assignment.assignmentNumberWrapper.assignmentNumber}: ${assignment.assignmentNumberWrapper.name}`}
            onSelect={(eventKey) => updateAssignment("assignmentNumber", JSON.parse(eventKey))}
          >
            {allAssignmentNumbers.map((item) => (
              <Dropdown.Item key={item.name} eventKey={JSON.stringify(item)}>
                Assignment {item.assignmentNumber}: {item.description}
              </Dropdown.Item>
            ))}
          </DropdownButton>
        </Col>
      </FormGroup>
      <FormGroup>
        <Col sm="9" md="8" lg="6">
          <Form.Label htmlFor="githubUrl">Github URL:</Form.Label>
          <FormControl
            id="githubUrl"
            type="url"
            placeholder="Enter the GitHub URL"
            value={assignment.githubUrl || ""}
            onChange={(e) => updateAssignment("githubUrl", e.target.value)}
          />
        </Col>
      </FormGroup>
      <FormGroup>
        <Col sm="9" md="8" lg="6">
          <Form.Label htmlFor="branch">Branch:</Form.Label>
          <FormControl
            id="branch"
            type="text"
            placeholder="Enter the branch name"
            value={assignment.branch || ""}
            onChange={(e) => updateAssignment("branch", e.target.value)}
          />
        </Col>
      </FormGroup>
      <Button
        type="submit"
        className="mt-3"
        variant="primary"
        onClick={submitUpdatedAssignment}
      >
        Update Assignment
      </Button>
    </Container>
  );
};

export default AssignmentView;