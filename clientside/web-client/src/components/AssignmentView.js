import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useLocalStorageState } from "../util/useLocalState";
import { Form, FormGroup, FormControl, Button, Alert, Spinner, Container, Col, Row, Badge, DropdownButton, Dropdown, ButtonGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AssignmentView = () => {
  const [auth] = useLocalStorageState("", "jwt");
  const [assignment, setAssignment] = useState({
    branch: "",
    githubUrl: "",
    assignmentNumber: null,
    status: null,
    codeReviewVideoUrl: ""
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assignmentNumbers, setAssignmentNumbers] = useState([]);
  const [assignmentStatuses, setAssignmentStatuses] = useState([]);
  const assignmentId = window.location.href.split("/assignments/")[1];
  const navigate = useNavigate();
  const prevAssignment = useRef(assignment);

  useEffect(() => {
    getAssignmentById();
  }, [assignmentId]);

  useEffect(()=>{
    console.log("previous-->", prevAssignment.current);
    prevAssignment.current=assignment;
    console.log("current-->", assignment);
    
  },[assignment]);

  async function getAssignmentById() {
    try {
      setLoading(true);
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
        setAssignmentNumbers(response.data.assignmentNumberEnums || []);
        setAssignmentStatuses(response.data.assignmentStatusEnums || []);
        console.log("Assignment data:", response.data);
      }
    } catch (error) {
      console.error("Error fetching assignment:", error);
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  }

  function updateAssignment(prop, value) {
    setAssignment(prevAssignment => ({
      ...prevAssignment,
      [prop]: value
    }));
  }

  async function submitUpdatedAssignment() {
    console.log("updating--");
    
    try {
      if (assignment.status === null && assignmentStatuses.length > 1) {
        updateAssignment("status", assignmentStatuses[1].status);
      }
      const updatedAssignment = {
        status: assignment.status,
        githubUrl: assignment.githubUrl,
        branch: assignment.branch,
        codeReviewVideoUrl: assignment.codeReviewVideoUrl,
        // assignmentNumber: assignment.assignmentNumber?.name
      };

      console.log("Sending to backend:", updatedAssignment);
      
      const updatedAssignmentResponse = await axios.put(
        `http://localhost:8888/api/assignments/update/${assignmentId}`,
        updatedAssignment,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth}`,
          },
        }
      );
      console.log("Update response:", updatedAssignmentResponse);
      alert("Assignment updated successfully!");
    } catch (error) {
      console.error("Error: ", error?.message);
      setError("Failed to update assignment.");
    }
  }

  async function handleAssignmentSelect(selectedAssignmentNumber) {
    try {
      const selectResponse = await axios.get(
        `http://localhost:8888/api/assignments/getByNumber/${selectedAssignmentNumber}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth}`,
          },
        }
      );
      if (selectResponse.status === 200 && selectResponse.data) {
        navigate(`/assignments/${selectResponse.data.id}`);
      } else {
        setError("Selected assignment does not exist.");
      }
    } catch (error) {
      console.error("Error fetching assignment:", error);
      setError("Failed to fetch the selected assignment.");
    }
  }

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
    <Container className="mt-5">
      <Row className="d-flex align-items-center mb-4">
        <Col>
          <h3>Assignment {assignment.assignmentNumber?.assignmentNumber}</h3>
        </Col>
        <Col>
          <Badge pill bg="info" style={{ fontSize: "1.1rem" }}>
            {assignment.status}
          </Badge>
        </Col>
      </Row>
      <Form>
        <FormGroup as={Row} className="mb-3" controlId="formAssignmentNumber">
          <Form.Label column sm="3">Assignment:</Form.Label>
          <Col sm="9">
            <DropdownButton 
              as={ButtonGroup} 
              id="assignmentNumber" 
              variant="info" 
              title={assignment.assignmentNumber ? `Assignment ${assignment.assignmentNumber.assignmentNumber}` : "Select Assignment"}
              onSelect={(eventKey) => updateAssignment("assignmentNumber", assignmentNumbers.find(item => item.assignmentNumber === parseInt(eventKey)))}
            >
              {assignmentNumbers.map((item) => (
                <Dropdown.Item key={item.assignmentNumber} eventKey={item.assignmentNumber}>
                  Assignment {item.assignmentNumber}: {item.name}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </Col>
        </FormGroup>
        {/* Rest of the form fields remain the same */}
        <FormGroup as={Row} className="mb-3" controlId="formGithubUrl">
          <Form.Label column sm="3">Github URL:</Form.Label>
          <Col sm="9">
            <Form.Control
              type="url"
              placeholder="Enter the GitHub URL"
              value={assignment.githubUrl || ""}
              onChange={(e) => updateAssignment("githubUrl", e.target.value)}
            />
          </Col>
        </FormGroup>
        <FormGroup as={Row} className="mb-3" controlId="formBranch">
          <Form.Label column sm="3">Branch:</Form.Label>
          <Col sm="9">
            <Form.Control
              type="text"
              placeholder="Enter the branch name"
              value={assignment.branch || ""}
              onChange={(e) => updateAssignment("branch", e.target.value)}
            />
          </Col>
        </FormGroup>
        <FormGroup as={Row} className="mb-3" controlId="formStatus">
          <Form.Label column sm="3">Status:</Form.Label>
          <Col sm="9">
            <Form.Select
              value={assignment.status || ""}
              onChange={(e) => updateAssignment("status", e.target.value)}
            >
              {assignmentStatuses.map((status) => (
                <option key={status.step} value={status.status}>
                  {status.status}
                </option>
              ))}
            </Form.Select>
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
          onClick={submitUpdatedAssignment}
        >
          Submit Assignment
        </Button>
      </Form>
    </Container>
  );
};

export default AssignmentView;