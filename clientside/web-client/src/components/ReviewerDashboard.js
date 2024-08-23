import React, { useEffect, useState } from "react";
import { useLocalStorageState } from "../util/useLocalState";
import { BaseUrl } from "../api/Service";
import Spinner from "../util/Spinner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Badge, Button, Card } from "react-bootstrap";
import StatusBadge from "../util/StatusBadge";


const ReviewerDashboard = () => {
  const navigate = useNavigate();
  const [auth] = useLocalStorageState("", "jwt");
  const [assignments, setAssignments] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("fetching assignments");
    getAvailableAssignments();
  }, []);

  async function getAvailableAssignments() {
    try {
      setLoading(true);
      const response = await axios.get(`${BaseUrl}/assignments/fetch`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth}`,
        },
      });
      console.log("res-->", response);

      if (response.status === 200) {
        setAssignments(response.data);
      }
    } catch (error) {
      setError("Failed to fetch assignments!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function claimAssignment(assignmentId) {
    try {
      const response = await axios.put(
        `${BaseUrl}/assignments/claim/${assignmentId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth}`,
          },
        }
      );
      if (response.status === 200) {
        setAssignments((prevAssignments) =>
          prevAssignments.map((assignment) =>
            assignment.id === assignmentId
              ? {
                  ...assignment,
                  status: "In review",
                  reviewer: response.data.reviewer,
                }
              : assignment
          )
        );
        alert("Assignment claimed successfully!");
        getAvailableAssignments();
      }
    } catch (error) {
      alert(
        "Failed to claim assignment: " + (error.response?.data?.message || error.message)
      );
      console.error(error);
    }
  }

  if (loading) return <Spinner />;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  const renderAssignments = (status) => {
    const filteredAssignments = assignments.filter((assignment) => assignment.status === status);
    return filteredAssignments.length === 0 ? (
      <div className="text-center text-gray-500">No assignments available.</div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredAssignments.map((assignment) => (
          <Card
            key={assignment.id}
            className="shadow-lg transition-transform transform hover:scale-105 bg-gradient-to-r from-blue-400 to-indigo-400 text-white"
          >
            <Card.Body className="flex flex-col">
              <Card.Title className="text-lg font-semibold">
                Assignment {assignment.assignmentNumber.assignmentNumber}
              </Card.Title>
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
                    status === "Submitted"
                      ? claimAssignment(assignment.id)
                      : navigate(`/assignments/${assignment.id}`);
                  }}
                  // disabled={status === "Completed" ? true : false}
                >
                  {status === "Submitted" ? "Claim Assignment" 
                  : status === "In review" ? "Assess"
                  : status === "Pending Submission" ? "Submit"
                  :status ==="Needs update" ? "View"
                  : status === "Completed" ? "View"
                  : ""}
                </Button>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="container mx-auto mt-5 p-4">
        <h1 className="text-2xl font-bold mb-2">Reviewer Dashboard</h1>

        <div className="assignments-section border-2 mt-2 mb-2 mr-2 ml-2 px-2 py-2 rounded">
          <h3>Awaiting Review</h3>
          {renderAssignments("Submitted")}
        </div>

        <div className="assignments-section border-2 mt-2 mb-2 mr-2 ml-2 px-2 py-2 rounded">
          <h3>In Review</h3>
          {renderAssignments("In review")}
        </div>
        <div className="assignments-section border-2 mt-2 mb-2 mr-2 ml-2 px-2 py-2 rounded">
          <h3>Needs Update</h3>
          {renderAssignments("Needs update")}
        </div>
        <div className="assignments-section border-2 mt-2 mb-2 mr-2 ml-2 px-2 py-2 rounded">
          <h3>Completed</h3>
          {renderAssignments("Completed")}
        </div>
      </div>
    </div>
  );
};

export default ReviewerDashboard;
