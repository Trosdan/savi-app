export const gfetch = async (graphqlEndpoint, headers, query, variables = {}) => {
    
    const response = await fetch(graphqlEndpoint, {
      method: "POST",
      headers:{headers, "Content-Type": "application/graphql"},
      body: JSON.stringify({ query, variables })
    });
    return response.text();
  }

