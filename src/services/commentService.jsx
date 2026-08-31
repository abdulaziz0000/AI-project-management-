import api from "./api";

const API_URL = "/comments";


export const getTaskComments = async (taskId) => {

    const response = await api.get(
        `${API_URL}/task/${taskId}`
    );

    return response.data;
};



export const addComment = async (comment) => {

    const response = await api.post(
        API_URL,
        comment
    );

    return response.data;
};



export const updateComment = async (id, comment) => {

    const response = await api.put(
        `${API_URL}/${id}`,
        comment
    );

    return response.data;
};



export const deleteComment = async (id) => {

    await api.delete(
        `${API_URL}/${id}`
    );

};