import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card } from "react-bootstrap";
import Spinner from "../util/Spinner";
import StatusBadge from "../util/StatusBadge";
import { useAuth } from "../context/AuthContext";
import { claimAssignment, getAssignments } from "../api/Service";

const ReviewerDashboard = () => {
  const navigate = useNavigate();
  const { jwt, logout } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAvailableAssignments();
  }, []);

  const fetchAvailableAssignments = async () => {
    setLoading(true);
    try {
      const response = await getAssignments(jwt);
      setAssignments(response);
    } catch (error) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthError = (error) => {
    if (error.message === "Session expired. Please log in again.") {
      logout();
      alert("Your session has expired. Please log in again.");
      navigate("/login");
    } else {
      alert("Failed to fetch assignments!");
      console.error(error);
    }
  };

  const claimAssignmentHandler = async (assignmentId) => {
    try {
      const response = await claimAssignment(assignmentId, jwt);
      if (response.status === 200) {
        setAssignments((prevAssignments) =>
          prevAssignments.map((assignment) =>
            assignment.id === assignmentId
              ? { ...assignment, status: "In review", reviewer: response.data.reviewer }
              : assignment
          )
        );
        alert("Assignment claimed successfully!");
        fetchAvailableAssignments();
      }
    } catch (error) {
      alert("Failed to claim assignment: " + (error.response?.data?.message || error.message));
      console.error(error);
    }
  };

  const renderAssignments = (status) => {
    const filteredAssignments = assignments.filter((assignment) => assignment.status === status);
    
    if (filteredAssignments.length === 0) {
      return <div className="text-center text-gray-500">No assignments available.</div>;
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <p>TODO: add dateTime for assignment creation. reviewed at, etc</p>
        {filteredAssignments.map((assignment) => (
          <Card key={assignment.id} className="shadow-lg transition-transform transform hover:scale-105 bg-gradient-to-r from-blue-400 to-indigo-400 text-white">
            <Card.Body className="flex flex-col">
              <Card.Title className="text-lg font-semibold">
              {console.log("number", assignment.assignmentNumber.assignmentNumber)
                }
                Assignment {assignment.assignmentNumber.assignmentNumber}
                
              </Card.Title>
              <StatusBadge text={assignment.status} />
              <Card.Text className="text-sm">
                <strong>Github URL:</strong> {assignment.githubUrl}
              </Card.Text>
              <Card.Text className="text-sm">
                <strong>Branch:</strong> {assignment.branch}
              </Card.Text>
              <Button
                className="mt-auto w-full"
                variant="light"
                onClick={() => {
                  status === "Submitted"
                    ? claimAssignmentHandler(assignment.id)
                    : navigate(`/assignments/${assignment.id}`);
                }}
              >
                {getButtonLabel(status)}
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>
    );
  };

  const getButtonLabel = (status) => {
    switch (status) {
      case "Submitted":
        return "Claim Assignment";
      case "In review":
        return "Assess";
      case "Needs update":
      case "Completed":
        return "View";
      default:
        return "";
    }
  };

  if (loading) return <Spinner />;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto mt-5 p-4">
      <h1 className="text-2xl font-bold mb-2">Reviewer Dashboard</h1>
      {["Submitted", "In review", "Needs update", "Completed"].map((status) => (
        <div key={status} className="assignments-section border-2 mt-2 mb-2 px-2 py-2 rounded">
          <h3>{status}</h3>
          {renderAssignments(status)}
        </div>
      ))}
    </div>
  );
};

export default ReviewerDashboard;
