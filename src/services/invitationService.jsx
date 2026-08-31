import api from "./api";

const API = "/invitations";

export const validateInvitation = async (token) => {
    const response = await api.get(`${API}/validate`, {
        params: { token }
    });

    return response.data;
};

export const acceptInvitation = async (request) => {
    const response = await api.post(`${API}/accept`, request);
    return response.data;
};

export const inviteEmployee = async (request) => {
    const response = await api.post(API, request);
    return response.data;
};