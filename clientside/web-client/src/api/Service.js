import axios from "axios";

const BaseUrl = "http://localhost:8888/api";

export const logIn = async (loginRequest) => {
  try {
    const response = await axios.post(`${BaseUrl}/auth/signin`, loginRequest, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};


export const getAssignmentById = async (assignmentId, jwt) => {
  const response = await axios.get(`${BaseUrl}/assignments/getById/${assignmentId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  });
  return response.data;
};

export const updateAssignment = async (assignmentId, updatedAssignment, jwt) => {
  const response = await axios.put(`${BaseUrl}/assignments/update/${assignmentId}`, updatedAssignment, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  });
  return response.data;
};

export const getAssignments = async(jwt) => {
    const response = await axios.get(`${BaseUrl}/assignments/fetch`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,  
        },
    });
    return response;
}