export const formatCommentTime = (createdAt) => {
    if (!createdAt) return "";

    const createdDate = new Date(createdAt);
    const now = new Date();

    if (Number.isNaN(createdDate.getTime())) {
        return "";
    }

    const diffMs = now.getTime() - createdDate.getTime();

    // Future timestamp
    if (diffMs < 0) {
        return "just now";
    }

    const diffSeconds = Math.floor(diffMs / 1000);

    if (diffSeconds < 60) {
        return "just now";
    }

    const diffMinutes = Math.floor(diffSeconds / 60);

    if (diffMinutes < 60) {
        return `${diffMinutes} ${
            diffMinutes === 1 ? "minute" : "minutes"
        } ago`;
    }

    const diffHours = Math.floor(diffMinutes / 60);

    if (diffHours < 24) {
        return `${diffHours} ${
            diffHours === 1 ? "hour" : "hours"
        } ago`;
    }

    const diffDays = Math.floor(diffHours / 24);

    if (diffDays < 7) {
        return `${diffDays} ${
            diffDays === 1 ? "day" : "days"
        } ago`;
    }

    return createdDate.toLocaleDateString();
};