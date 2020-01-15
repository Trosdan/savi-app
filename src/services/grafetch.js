export const gfetch = async (
    graphqlEndpoint,
    initialHeaders,
    query,
    variables = {}
) => {
    const contentType = { "content-type": "application/json" };
    const headers = { ...contentType, ...initialHeaders };
    const response = await fetch(graphqlEndpoint, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ query, variables })
    });
    if (response.status == 500) {
        console.log("Request returned error 500");
    }
    return response.text();
};
