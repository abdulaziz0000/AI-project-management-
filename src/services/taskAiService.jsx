import api from "./api";

export const getTaskSummary = async (taskId) => {
    const response = await api.get(`/tasks/ai/${taskId}/summary`);
    return response.data;
};

export const getTaskRisk = async (taskId) => {
    const response = await api.get(`/tasks/ai/${taskId}/risk`);
    return response.data;
};

export const getActionItems = async (taskId) => {
    const response = await api.get(`/tasks/ai/${taskId}/action-items`);
    return response.data;
};

// taskAiService.js
export const getProjectStandup = async (projectId) => {
    const response = await api.get(`/tasks/ai/project/${projectId}/standup`);
    return response.data;
};