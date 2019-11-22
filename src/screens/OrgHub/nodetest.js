
const gfetch = async (graphqlEndpoint, headers, query, variables = {}) => {
    const response = await fetch(graphqlEndpoint, {
      method: 'POST',
      headers:headers,
      body: JSON.stringify({ query, variables })
    });
  
    return response.json();
  }
  
creds = require('../../../creds.json')
let organizarionName = "Makaia";
const OffersQuery = `
    query {
    offers(where: { name: { equalTo: "${organizarionName}" } }) {
      results {
        id
        offerResponsable
        nursery
        shelter
        clothes
        developmentArea
        education
        name
        local {
          id
        }
      } 
    }
  }
`;
gfetch('https://parseapi.back4app.com/graphql', creds.headers, OffersQuery).then(response => {console.log(response)}).catch(error => console.log)