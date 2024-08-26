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
    if (error.response && error.response.status === 401) {
      throw new Error("Session expired. Please log in again.");
    }
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

export const getAssignmentById = async (assignmentId, jwt) => {
  try {
    const response = await axios.get(
      `${BaseUrl}/assignments/getById/${assignmentId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error("Session expired. Please log in again.");
    }
    throw new Error(error.response?.data?.message || "Fetch failed");
  }
};

export const updateAssignment = async (
  assignmentId,
  updatedAssignment,
  jwt
) => {
  try {
    const response = await axios.put(
      `${BaseUrl}/assignments/update/${assignmentId}`,
      updatedAssignment,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error("Session expired. Please log in again.");
    }
    throw new Error(error.response?.data?.message || "Update failed");
  }
};

export const getAssignments = async (jwt) => {
  try {
    const response = await axios.get(`${BaseUrl}/assignments/fetch`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    });
    return response;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error("Session expired. Please log in again.");
    }
    throw new Error(error.response?.data?.message || "Fetch failed");
  }
};

export const getAssignmentEnums = async (jwt) => {
  try {
    const response = await axios.get(`${BaseUrl}/assignments/enums`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    });
    return response;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error("Session expired. Please log in again.");
    }
    throw new Error(error.response?.data?.message || "Fetch failed");
  }
};

export const CreateAssignment = async (newAssignment, jwt) => {
  try {
    const response = await axios.post(
      `${BaseUrl}/assignments/create`,
      newAssignment,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    return response;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error("Session expired. Please log in again.");
    }
    throw new Error(error.response?.data?.message || "Post failed");
  }
};

export const putReviewAssignment = async (
  reviewedAssignment,
  assignmentId,
  jwt
) => {
  try {
    const response = await axios.put(
      `${BaseUrl}/assignments/review/${assignmentId}`,
      reviewedAssignment,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    return response;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error("Session expired. Please log in again.");
    }
    throw new Error(error.response?.data?.message || "Put failed");
  }
};

export const putRejectAssignment = async (
  rejectedAssignment,
  assignmentId,
  jwt
) => {
  try {
    const response = await axios.put(
      `${BaseUrl}/assignments/review/${assignmentId}`,
      rejectedAssignment,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    return response;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error("Session expired. Please log in again.");
    }
    throw new Error(error.response?.data?.message || "Put failed");
  }
};

export const putClaimAssignment = async (assignmentId, jwt) => {
  try {
    const response = await axios.put(
      `${BaseUrl}/assignments/claim/${assignmentId}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    return response;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error("Session expired. Please log in again.");
    }
    throw new Error(error.response?.data?.message || "Put failed");
  }
};

export const postComment=async(comment, assignmentId, jwt)=>{
  try{
  const response = await axios.post(`${BaseUrl}/assignments/comment/${assignmentId}`,
    comment,
    {
      headers:{
        "Content-Type" : "application/json",
        Authorization: `Bearer ${jwt}`
      }
    }
  )
  return response;
} catch (error) {
  if (error.response && error.response.status === 401) {
    throw new Error("Session expired. Please log in again.");
  }
  throw new Error(error.response?.data?.message || "Put failed");
}
}