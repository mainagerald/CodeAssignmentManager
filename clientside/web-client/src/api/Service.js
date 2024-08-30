import apiClient from "./Interceptor/apiClient";

const BaseUrl = "http://localhost:8888/api";

export const logIn = async (loginRequest) => {
  try {
    const response = await apiClient.post(`${BaseUrl}/auth/signin`, loginRequest, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
console.log(error);
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

export const getAssignmentById = async (assignmentId, jwt) => {
  try {
    const response = await apiClient.get(
      `${BaseUrl}/assignments/getById/${assignmentId}`,
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
    throw new Error(error.response?.data?.message || "Fetch failed");
  }
};

export const updateAssignment = async (
  assignmentId,
  updatedAssignment,
  jwt
) => {
  try {
    const response = await apiClient.put(
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
    const response = await apiClient.get(`${BaseUrl}/assignments/fetch`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    });
    return response;
  } catch (error) {
    console.log("error--", error.response);
    
    if (error.response && error.response.status === 401) {
      throw new Error("Session expired. Please log in again.");
    }
    throw new Error(error.response?.data?.message || "Fetch failed");
  }
};

export const getAssignmentEnums = async (jwt) => {
  try {
    const response = await apiClient.get(`${BaseUrl}/assignments/enums`, {
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
    const response = await apiClient.post(
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
    const response = await apiClient.put(
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
    const response = await apiClient.put(
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
    const response = await apiClient.put(
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

export const postComment=async(comment, jwt)=>{
  try{
  const response = await apiClient.post(`${BaseUrl}/comments/create`,
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
export const getComments=async(assignmentId, jwt)=>{
  try{
  const response = await apiClient.get(`${BaseUrl}/comments/comments?id=${assignmentId}`,
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

export const deleteComment=async(commentId, jwt)=>{
  try{
  const response = await apiClient.delete(`${BaseUrl}/comments/delete/${commentId}`,
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