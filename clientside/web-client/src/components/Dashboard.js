import React, { useEffect, useState } from "react";
import { useLocalStorageState } from "../util/useLocalState";
import axios from 'axios';
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [auth] = useLocalStorageState("", "jwt");
  const [assignments, setAssignments] = useState(null);
  const [githubUrl] = useState("");
  const [codeReviewVideoUrl] = useState("");
  const [branch] = useState("");

  const createAssgnmntRequest = {
    githubUrl: githubUrl,
    codeReviewVideoUrl: codeReviewVideoUrl,
    branch: branch
  }

  useEffect(()=> {
      getCurrentAssignments();
  },[])

  async function getCurrentAssignments(){
    try {
      const assignments = await axios.get("http://localhost:8888/api/assignments/fetch",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth}`
          },
        }
      )
      console.log("assignmentssss---->",assignments.data);
      if(assignments.status===200){
        setAssignments(assignments.data);
      }
    } catch (error) {
      alert(error.message);
    }
  }

  async function createAssignment(){
    try {
      const responseData = await axios.post("http://localhost:8888/api/assignments/create",
        createAssgnmntRequest,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth}`
          },
        }
      )
      console.log("response pre--->",responseData)
      if(responseData.status===200){
        alert("Assignment Created!")
        const id = responseData.data.id;
        // console.log("data id--->", data.id)
        return window.location.href=`/assignments/assignment=${id}`;
      }
    } catch (error) {
      alert(error.message);
      console.error(error.message);
    }
  }
  return (
    <div>
      {assignments ? assignments.map((assignment)=>(
        <div key={assignment.id}>
          <Link to={`/assignments/${assignment.id}`}>Assignment: {assignment.id}</Link>
        </div>
      )) : (<>Nothing to show yet:/</>) }
      <button
        type="submit"
        className="mt-3 ml-3 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={()=>createAssignment()}
      >
        Submit Assignment
      </button>
    </div>
  );
};

export default Dashboard;
