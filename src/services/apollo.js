import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { setContext } from "apollo-link-context";
const creds = require("../../creds.json");
const httpLink = new HttpLink({
    uri: "https://parseapi.back4app.com/graphql"
});

const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            "X-Parse-Application-Id": creds.appid,
            "X-Parse-Master-Key": creds.masterkey,
            "X-Parse-Client-Key": creds.clientkey
        }
    };
});
const apolloClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});

export default apolloClient;
