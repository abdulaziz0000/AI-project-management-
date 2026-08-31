import api from "./api";
const API_URL = "/tasks";

export const getTasks = async () => {
    const response = await api.get(API_URL);
    return response.data;
};

export const getTaskById = async (id) => {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
};

export const getTasksByProject = async (id) => {
    const response = await api.get(`${API_URL}/project/${id}`);
    return response.data;
};

export const createTask = async (task) => {
    const response = await api.post(API_URL, task);
    return response.data;
};

export const updateTask = async (id, task) => {
    const response = await api.put(`${API_URL}/${id}`, task);
    return response.data;
};

export const updateTaskStatus = async (id, status) => {
    const response = await api.put(`${API_URL}/${id}/status?status=${status}`);
    return response.data;
};

export const deleteTask = async (id) => {
    const response = await api.delete(`${API_URL}/${id}`);
    return response.data;
};