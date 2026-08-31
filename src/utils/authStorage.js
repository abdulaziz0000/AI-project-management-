export const getAuthStorage = () => {

    const localToken =
        localStorage.getItem("accessToken");

    const sessionToken =
        sessionStorage.getItem("accessToken");


    if(localToken){
        return localStorage;
    }


    if(sessionToken){
        return sessionStorage;
    }


    return null;
};