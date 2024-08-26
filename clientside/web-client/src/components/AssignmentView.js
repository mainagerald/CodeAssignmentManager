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
  DropdownButton,
  Dropdown,
  ButtonGroup,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import StatusBadge from "../util/StatusBadge";
import { useAuth } from "../context/AuthContext";
import { getAssignmentById, updateAssignment } from '../api/Service';

const AssignmentView = () => {
  const { jwt } = useAuth();
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
    const fetchAssignment = async () => {
      try {
        setLoading(true);
        const data = await getAssignmentById(assignmentId, jwt);
        setAssignment(data);
        setAssignmentNumberEnums(data.assignmentNumberEnums || []);
        setAssignmentStatusEnums(data.assignmentStatusEnums || []);
      } catch (error) {
        console.error("Error fetching assignment:", error);
        setError(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignment();
  }, [assignmentId, jwt]);

  useEffect(() => {
    prevAssignment.current = assignment;
  }, [assignment]);

  function updateAssignmentState(prop, value) {
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

      const updatedAssignmentResponse = await updateAssignment(assignmentId, updatedAssignment, jwt);
      setAssignment(updatedAssignmentResponse);
      alert("Assignment updated and submitted successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error: ", error?.message);
      setError("Failed to update assignment.");
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
      <div className="justify-content-end mt-1"></div>
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
        <div>
          <Form>
            <FormGroup as={Row} className="mb-3" controlId="formAssignmentNumber">
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
            </FormGroup>
            <FormGroup as={Row} className="mb-3" controlId="formGithubUrl">
              <Form.Label column sm="3" className="font-semibold">
                Github URL:
              </Form.Label>
              <Col sm="9">
                <Form.Control
                  type="url"
                  placeholder="Enter the GitHub URL"
                  value={assignment.githubUrl || ""}
                  onChange={(e) =>
                    updateAssignmentState("githubUrl", e.target.value)
                  }
                  className="border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  placeholder="Enter the branch name"
                  value={assignment.branch || ""}
                  onChange={(e) => updateAssignmentState("branch", e.target.value)}
                  className="border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </Col>
            </FormGroup>
            <div>
              {assignment.status === "Completed" ? (
                <FormGroup as={Row} className="mb-3" controlId="formCodeReviewVideoUrl">
                  <Form.Label column sm="3" className="font-semibold">
                    Review Video URL:
                  </Form.Label>
                  <Col sm="9" className="d-flex align-items-center font-semibold text-lg">
                    <Link to={assignment.codeReviewVideoUrl}>
                      {assignment.codeReviewVideoUrl}
                    </Link>
                  </Col>
                </FormGroup>
              ) : null}
            </div>
            <div>
              {assignment.status === "Completed" ? null : (
                <Button
                  type="button"
                  className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={submitUpdatedAssignment}
                >
                  Submit Assignment
                </Button>
              )}
            </div>
          </Form>
        </div>
      </Container>
    </div>
  );
};

export default AssignmentView;
