import api from "./api";

const API = "/project-members";

export const addProjectMember = async (request) => {
    const response = await api.post(API, request);
    return response.data;
};