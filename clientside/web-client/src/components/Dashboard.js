import React, { useEffect, useState } from "react";
import { BaseUrl } from "../api/Constants";
import Spinner from "../util/Spinner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Card } from "react-bootstrap";
import StatusBadge from "../util/StatusBadge";
import { useAuth } from "../context/AuthContext";
import { getAssignments } from "../api/Service";

const Dashboard = () => {
  const navigate = useNavigate();
  const{jwt, logout}=useAuth();
  const [assignments, setAssignments] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCurrentAssignments();
  }, []);

  async function getCurrentAssignments() {
    try {
      setLoading(true);
      const response = await getAssignments(jwt);
      if (response.status === 200) {
        setAssignments(response.data);
      }
    } catch (error) {
      if (error.message === "Session expired. Please log in again.") {
        alert("Your session has expired. Please log in again.");
        logout();
      }
      alert(error.message);
      setError("Failed to fetch!");
    } finally {
      setLoading(false);
    }
  }

  function createAssignment() {
    const nextAssignmentNumber = assignments && assignments.length > 0
      ? Math.max(...assignments.map(a => a.assignmentNumber.assignmentNumber)) + 1
      : 1;
    
    if (nextAssignmentNumber > 9) {
      alert("You have completed all available assignments!");
      return;
    }
      navigate("/create-assignment", { state: { nextAssignmentNumber } });
  }

  return (
    <div>
      <div className="container mx-auto mt-5 p-4">
      <h1 className="text-2xl font-bold mb-2">Assignments Dashboard</h1>
      <button
        type="button"
        className="mb-5 py-2 px-4 border border-transparent rounded-md shadow-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={createAssignment}
      >
        New Assignment
      </button>
      {assignments === null ? (
        <>
        <Spinner></Spinner>
        </>
      ) : assignments?.length === 0 ? (
        <div className="text-center text-gray-500">Nothing to show yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {assignments.map((assignment) => (
            <Card key={assignment.id} className="shadow-lg transition-transform transform hover:scale-105 bg-gradient-to-r from-blue-400 to-indigo-400 text-white">
              <Card.Body className="flex flex-col">
                <Card.Title className="text-lg font-semibold">Assignment {assignment.assignmentNumber.assignmentNumber}</Card.Title>
                <div className="d-flex align-items-start mb-2 mt-1">
                <StatusBadge text={assignment.status}/>
                </div>
                <Card.Text className="text-sm">
                  <strong>Github URL:</strong> {assignment.githubUrl}
                </Card.Text>
                <Card.Text className="text-sm">
                  <strong>Branch:</strong> {assignment.branch}
                </Card.Text>
                <div className="mt-auto">
                  <Button
                    className="w-full"
                    variant="light"
                    onClick={() => {
                      navigate(`/assignments/${assignment.id}`);
                    }}
                  >
                    {assignment?.status==="Completed" ? "View" : "Edit"}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </div>
    </div>
  );
};

export default Dashboard;