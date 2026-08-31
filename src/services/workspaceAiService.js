import api from "./api";

export const askWorkspace = async (
    organizationId,
    conversationId,
    question
) => {

    const response = await api.post(
        `/ai/workspace/ask`,
        {
            conversationId: conversationId,
            question: question
        },
        {
            params: {
                organizationId: organizationId
            }
        }
    );

    return response.data;
};