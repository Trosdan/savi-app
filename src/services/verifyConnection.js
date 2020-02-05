export const verifyConnection = async () => {
    response = await fetch("https://ifconfig.me/");
    console.log("connection status: ", response.status);
    return response.status;
};
