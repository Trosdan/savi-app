import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { setContext } from "apollo-link-context";

const httpLink = new HttpLink({
  uri: "https://parseapi.back4app.com/graphql"
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      "X-Parse-Application-Id": "47RAnYvxm7rWLUTUZYHt9SItJjd9FnmWj5ZK5g92",
      "X-Parse-Master-Key": "7qesIb1ZkUrjHEzxloP5j173OLMr8XI9u05BEeyh",
      "X-Parse-Client-Key": "jLJjTD2ATpWq6cwofTkpBBgL8Mt4nVewhugNmZX7"
    }
  };
});
const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

export default apolloClient;
