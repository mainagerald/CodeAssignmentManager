import React, { useEffect, useState } from "react";
import { useLocalStorageState } from "../util/useLocalState";
import { BaseUrl } from "../api/Service";
import Spinner from "../util/Spinner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Badge, Button, Card } from "react-bootstrap";
import Navbar from "./Navbar";

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
            const response = await axios.get(
                `${BaseUrl}/assignments/fetch`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${auth}`,
                    },
                }
            );
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
                // Todo: use enums for status
                setAssignments(prevAssignments => 
                    prevAssignments.map(assignment => 
                        assignment.id === assignmentId 
                            ? { ...assignment, status: "In Review", reviewer: response.data.reviewer }
                            : assignment
                    )
                );
                alert("Assignment claimed successfully!");
            }
        } catch (error) {
            alert("Failed to claim assignment: " + error.response?.data?.message || error.message);
            console.error(error);
        }
    }

    if (loading) return <Spinner />;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    return (
        <div>
            <Navbar />
            <div className="container mx-auto mt-5 p-4">
                <h1 className="text-2xl font-bold mb-2">Reviewer Dashboard</h1>
                {assignments?.length === 0 ? (
                    <div className="text-center text-gray-500">No assignments available.</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {assignments.map((assignment) => (
                            <Card key={assignment.id} className="shadow-lg transition-transform transform hover:scale-105 bg-gradient-to-r from-blue-400 to-indigo-400 text-white">
                                <Card.Body className="flex flex-col">
                                    <Card.Title className="text-lg font-semibold">Assignment {assignment.assignmentNumber.assignmentNumber}</Card.Title>
                                    <div className="d-flex align-items-start mb-2 mt-1">
                                        <Badge
                                            pill
                                            className={`text-white ${assignment.status === "Submitted" ? "bg-green-500" : "bg-yellow-500"}`}
                                            style={{ fontSize: "1em", padding: "0.5em 1em" }}
                                        >
                                            {assignment.status}
                                        </Badge>
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
                                            onClick={() => claimAssignment(assignment.id)}
                                            disabled={assignment.status !== "Submitted"}
                                        >
                                            {assignment.status === "Submitted" ? "Claim Assignment" : "Already Claimed"}
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

export default ReviewerDashboard;