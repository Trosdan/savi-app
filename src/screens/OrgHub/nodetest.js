
  const gfetch = async (graphqlEndpoint, headers, query, variables = {}) => {
      const response = await fetch(graphqlEndpoint, {
        method: 'POST',
        headers:headers,
        body: JSON.stringify({ query, variables })
      });
    
      return response.json();
    }
    
  creds = {
    "headers": {
        "accept": "*/*",
        "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
        "content-type": "application/json",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "x-parse-application-id": "47RAnYvxm7rWLUTUZYHt9SItJjd9FnmWj5ZK5g92",
        "x-parse-client-key": "WLyCpihyllj8cxhhuVZk9b15JkbMeSt5q2IURgAW",
        "x-parse-master-key": "32qb1Of9n8jESGsr3TESg9RUAxJTrZbpGVVKIk3v"
    }
  }
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
  const retorno = gfetch('https://parseapi.back4app.com/graphql', creds.headers, OffersQuery).then(response => {console.log(response)}).catch(error => console.log)