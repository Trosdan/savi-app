export const gfetch = async (graphqlEndpoint, headers, query, variables = {}) => {
    
    const response = await fetch(graphqlEndpoint, {
      method: 'POST',
      headers:headers,
      body: JSON.stringify({ query, variables })
    });
    return response.json();
  }