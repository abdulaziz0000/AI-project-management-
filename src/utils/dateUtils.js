export const formatCommentTime = (createdAt) => {
    if (!createdAt) return "";

    const createdTimestamp = Date.parse(createdAt);

    if (Number.isNaN(createdTimestamp)) {
        return "";
    }

    const diffSeconds = Math.floor(
        (Date.now() - createdTimestamp) / 1000
    );

    if (diffSeconds < 60) {
        return "just now";
    }

    const minutes = Math.floor(diffSeconds / 60);

    if (minutes < 60) {
        return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
        return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    }

    const days = Math.floor(hours / 24);

    if (days < 7) {
        return `${days} ${days === 1 ? "day" : "days"} ago`;
    }

    return new Date(createdTimestamp).toLocaleDateString();
};