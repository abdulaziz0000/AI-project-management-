import api from "./api";


const API="/projects";


export const createProject=(project)=>{

    return api.post(
        API,
        project
    );

};



export const getProjects=(organizationId)=>{

    return api.get(
        `${API}/organization/${organizationId}`
    );

};



export const getAllProjects=(organizationId)=>{

    return api.get(
        `${API}/organization/${organizationId}`
    );

};



export const getProjectById=(id)=>{

    return api.get(
        `${API}/${id}`
    );

};



export const updateProject=(id,project)=>{

    return api.put(
        `${API}/${id}`,
        project
    );

};



export const deleteProject=(id)=>{

    return api.delete(
        `${API}/${id}`
    );

};



export const getProjectMembers=(projectId)=>{

    return api.get(
        `/project-members/project/${projectId}`
    );

};

export const generateProjectStandup = (projectId) => {

    return api.get(
        `/tasks/ai/project/${projectId}/standup`
    );

};