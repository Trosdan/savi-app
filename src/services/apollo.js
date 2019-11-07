import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { setContext } from 'apollo-link-context';

const httpLink = new HttpLink({
  uri: "https://parseapi.back4app.com/graphql"
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      "X-Parse-Application-Id": "",
      "X-Parse-Master-Key": "",
      "X-Parse-Client-Key": ""
      }
  }
});
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

export default client;