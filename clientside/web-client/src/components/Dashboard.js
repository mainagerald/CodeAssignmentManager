import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card } from "react-bootstrap";
import Spinner from "../util/Spinner";
import StatusBadge from "../util/StatusBadge";
import { useAuth } from "../context/AuthContext";
import { getAssignments } from "../api/Service";

const Dashboard = () => {
  const navigate = useNavigate();
  const { jwt, logout } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await getAssignments(jwt);
      setAssignments(response);
    } catch (error) {
      handleAuthError(error);
      setError("Failed to fetch assignments!");
    } finally {
      setLoading(false);
    }
  };

  const handleAuthError = (error) => {
    if (error.message === "Session expired. Please log in again.") {
      alert("Your session has expired. Please log in again.");
      logout();
    } else {
      alert(error.message);
    }
  };

  const createAssignment = () => {
   
    const nextAssignmentNumber = assignments.length > 0
      ? Math.max(...assignments.map(a => a.assignmentNumber.assignmentNumber)) + 1
      : 1;

    if (nextAssignmentNumber > 9) {
      alert("You have completed all available assignments!");
      return;
    }
    navigate("/create-assignment", { state: { nextAssignmentNumber } });
  };

  if (loading) return <Spinner />;

  return (
    <div className="container mx-auto mt-5 p-4">
              <p>TODO: add dateTime for assignment creation. reviewed at, etc</p>
      <h1 className="text-2xl font-bold mb-2">Assignments Dashboard</h1>
      <Button onClick={createAssignment} className="mb-5">
        New Assignment
      </Button>
      {!assignments ? (
        <div className="text-center text-gray-500">Nothing to show yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {assignments.map((assignment) => (
            <Card key={assignment.id} className="shadow-lg transition-transform transform hover:scale-105 bg-gradient-to-r from-blue-400 to-indigo-400 text-white">
              <Card.Body className="flex flex-col">
                <Card.Title className="text-lg font-semibold">Assignment {assignment.assignmentNumber.assignmentNumber}</Card.Title>
                <StatusBadge text={assignment.status} />
                <Card.Text className="text-sm">
                  <strong>Github URL:</strong> {assignment.githubUrl}
                </Card.Text>
                <Card.Text className="text-sm">
                  <strong>Branch:</strong> {assignment.branch}
                </Card.Text>
                <Button variant="light" onClick={() => navigate(`/assignments/${assignment.id}`)} className="w-full">
                  {assignment.status === "Completed" ? "View" : "Edit"}
                </Button>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
