import React, { useEffect, useState } from "react";
import { useLocalStorageState } from "../util/useLocalState";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

const Dashboard = () => {
  const navigate = useNavigate();
  const [auth] = useLocalStorageState("", "jwt");
  const [assignments, setAssignments] = useState(null);

  useEffect(() => {
    getCurrentAssignments();
  }, []);

  async function getCurrentAssignments() {
    try {
      const response = await axios.get(
        "http://localhost:8888/api/assignments/fetch",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth}`,
          },
        }
      );
      if (response.status === 200) {
        setAssignments(response.data);
      }
    } catch (error) {
      alert(error.message);
    }
  }

  function createAssignment() {
    navigate('/create-assignment');
  }

  return (
    <div className="container mx-auto mt-5 p-4">
      <button
        type="button"
        className="mb-5 py-2 px-4 border border-transparent rounded-md shadow-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={createAssignment}
      >
        New Assignment
      </button>
      {assignments ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {assignments.map((assignment) => (
            <Card key={assignment.id} className="shadow-lg transition-transform transform hover:scale-105">
              <Card.Body>
                <Card.Title className="text-lg font-semibold">Assignment #{assignment.id}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Status: {assignment.status}</Card.Subtitle>
                <Card.Text className="text-sm">
                  <strong>Github URL:</strong> {assignment.githubUrl}
                </Card.Text>
                <Card.Text className="text-sm">
                  <strong>Branch:</strong> {assignment.branch}
                </Card.Text>
                <Button
                  variant="primary"
                  onClick={() => {
                    window.location.href = `/assignments/${assignment.id}`;
                  }}
                >
                  Edit
                </Button>
              </Card.Body>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">Nothing to show yet.</div>
      )}
    </div>
  );
};

export default Dashboard;