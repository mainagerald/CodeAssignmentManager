import apiClient from "./Interceptor/apiClient";

const BaseUrl = "http://localhost:8888/api";

const handleResponse = async (promise) => {
  try {
    const response = await promise;
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error("Session expired. Please log in again.");
    }
    throw new Error(error.response?.data?.message || "Request failed");
  }
};

const createHeaders = (jwt) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${jwt}`,
});

export const logIn = (loginRequest) =>
  handleResponse(
    apiClient.post(`${BaseUrl}/auth/signin`, loginRequest, {
      headers: { "Content-Type": "application/json" },
    })
  );

export const getAssignmentById = (assignmentId, jwt) =>
  handleResponse(
    apiClient.get(`${BaseUrl}/assignments/getById/${assignmentId}`, {
      headers: createHeaders(jwt),
    })
  );

export const updateAssignment = (assignmentId, updatedAssignment, jwt) =>
  handleResponse(
    apiClient.put(`${BaseUrl}/assignments/update/${assignmentId}`, updatedAssignment, {
      headers: createHeaders(jwt),
    })
  );

export const getAssignments = (jwt) =>
  handleResponse(
    apiClient.get(`${BaseUrl}/assignments/fetch`, {
      headers: createHeaders(jwt),
    })
  );

export const getAssignmentEnums = (jwt) =>
  handleResponse(
    apiClient.get(`${BaseUrl}/assignments/enums`, {
      headers: createHeaders(jwt),
    })
  );

export const createAssignment = (newAssignment, jwt) =>
  handleResponse(
    apiClient.post(`${BaseUrl}/assignments/create`, newAssignment, {
      headers: createHeaders(jwt),
    })
  );

export const reviewAssignment = (reviewedAssignment, assignmentId, jwt) =>
  handleResponse(
    apiClient.put(`${BaseUrl}/assignments/review/${assignmentId}`, reviewedAssignment, {
      headers: createHeaders(jwt),
    })
  );

export const rejectAssignment = (rejectedAssignment, assignmentId, jwt) =>
  handleResponse(
    apiClient.put(`${BaseUrl}/assignments/review/${assignmentId}`, rejectedAssignment, {
      headers: createHeaders(jwt),
    })
  );

export const claimAssignment = (assignmentId, jwt) =>
  handleResponse(
    apiClient.put(`${BaseUrl}/assignments/claim/${assignmentId}`, {}, {
      headers: createHeaders(jwt),
    })
  );

export const postComment = (comment, jwt) =>
  handleResponse(
    apiClient.post(`${BaseUrl}/comments/create`, comment, {
      headers: createHeaders(jwt),
    })
  );

export const getComments = (assignmentId, jwt) =>
  handleResponse(
    apiClient.get(`${BaseUrl}/comments/comments?id=${assignmentId}`, {
      headers: createHeaders(jwt),
    })
  );

export const editComment = (commentId, jwt) =>
  handleResponse(
    apiClient.put(`${BaseUrl}/comments/edit/${commentId}`, {
      headers: createHeaders(jwt),
    })
  );

export const deleteComment = (commentId, jwt)=>
  handleResponse(
    apiClient.delete(`${BaseUrl}/comments/delete/${commentId}`,
      {
        headers: createHeaders(jwt),
      }
    )
  );
