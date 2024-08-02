import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocalStorageState } from "../util/useLocalState";

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
    setAssignment((prevAssignment) => {
      const updatedAssignment = { ...prevAssignment, [prop]: value };
      console.log("Updated assignment:", updatedAssignment);
      return updatedAssignment;
    });
    // const newAssignment = {...assignment}
    // newAssignment[prop] = value;
    // setAssignment(newAssignment);
    // return newAssignment;
  }

  function submitUpdatedAssignment(){
    try {
      console.log("assignment state", assignment);
      const updatedAssignmentResponse = axios.put(`http://localhost:8888/api/assignments/update/${assignmentId}`,
        assignment,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth}`
        }
      }
      )
      console.log("response from update-->", updatedAssignmentResponse);
    } catch (error) {
      console.error("Error: ", error?.message);
    }
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!assignment) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h3>Assignment {assignmentId}</h3>
      <h2>Status: {assignment.status}</h2>
      <h3>
        Github URL:{" "}
        <input
          id="githubUrl"
          type="url"
          value={assignment.githubUrl || ""}
          onChange={(e) => updateAssignment("githubUrl", e.target.value)}
        />
      </h3>
      <h3>
        Branch:{" "}
        <input
          id="branch"
          type="text"
          value={assignment.branch || ""}
          onChange={(e) => updateAssignment("branch", e.target.value)}
        />
      </h3>
      <pre>{JSON.stringify(assignment, null, 2)}</pre>
      <button
        type="submit"
        className="mt-3 ml-3 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={()=>submitUpdatedAssignment()}
      >
        Update Assignment
      </button>
    </div>
  );
};

export default AssignmentView;