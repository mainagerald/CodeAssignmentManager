import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useLocalStorageState } from "../util/useLocalState";
import {
  Form,
  FormGroup,
  FormControl,
  Button,
  Alert,
  Spinner,
  Container,
  Col,
  Row,
  Badge,
  DropdownButton,
  Dropdown,
  ButtonGroup,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const AssignmentView = () => {
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
        setAssignmentNumberEnums(response.data.assignmentNumberEnums ||[]);
        setAssignmentStatusEnums(response.data.assignmentStatusEnums||[]);
      }
      console.log("data", response.data)
    } catch (error) {
      console.error("Error fetching assignment:", error);
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  }

  function updateAssignment(prop, value) {
    setAssignment((prevAssignment) => ({
      ...prevAssignment,
      [prop]: value,
    }));
  }

  async function submitUpdatedAssignment() {
    try {
      const updatedAssignment = {
        ...assignment,
        status: "Submitted",
      };

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
      if (updatedAssignmentResponse.status === 200) {
        setAssignment(updatedAssignmentResponse.data);
        alert("Assignment updated and submitted successfully!");
      }
    } catch (error) {
      console.error("Error: ", error?.message);
      setError("Failed to update assignment.");
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
          <Badge pill bg={assignment.status === "Submitted" ? "success" : "info"} style={{ fontSize: "1.1rem" }}>
            {assignment.status}
          </Badge>
        </Col>
      </Row>
      <Form>
        <FormGroup as={Row} className="mb-3" controlId="formAssignmentNumber">
          <Form.Label column sm="3">
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
                updateAssignment(
                  "assignmentNumber",
                  assignmentNumbers.find(
                    (item) => item.assignmentNumber === parseInt(eventKey)
                  )
                )
              }
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
        </FormGroup>
        <FormGroup as={Row} className="mb-3" controlId="formGithubUrl">
          <Form.Label column sm="3">
            Github URL:
          </Form.Label>
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
          <Form.Label column sm="3">
            Branch:
          </Form.Label>
          <Col sm="9">
            <Form.Control
              type="text"
              placeholder="Enter the branch name"
              value={assignment.branch || ""}
              onChange={(e) => updateAssignment("branch", e.target.value)}
            />
          </Col>
        </FormGroup>
        <FormGroup as={Row} className="mb-3" controlId="formCodeReviewVideoUrl">
          <Form.Label column sm="3">
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