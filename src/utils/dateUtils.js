export const formatCommentTime = (createdAt) => {
if (!createdAt) {
return "";
}


const createdDate = new Date(createdAt);
const now = new Date();

if (Number.isNaN(createdDate.getTime())) {
    return "";
}

const diffInSeconds = Math.floor(
    (now.getTime() - createdDate.getTime()) / 1000
);

// Future timestamp or less than 1 minute ago
if (diffInSeconds < 60) {
    return "just now";
}

const diffInMinutes = Math.floor(diffInSeconds / 60);

if (diffInMinutes < 60) {
    return `${diffInMinutes} ${
        diffInMinutes === 1 ? "minute" : "minutes"
    } ago`;
}

const diffInHours = Math.floor(diffInMinutes / 60);

if (diffInHours < 24) {
    return `${diffInHours} ${
        diffInHours === 1 ? "hour" : "hours"
    } ago`;
}

const diffInDays = Math.floor(diffInHours / 24);

if (diffInDays < 7) {
    return `${diffInDays} ${
        diffInDays === 1 ? "day" : "days"
    } ago`;
}

return createdDate.toLocaleDateString();


};
