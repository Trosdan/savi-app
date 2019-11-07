import React, { Component } from "react";
import { ApolloProvider } from "react-apollo";

import apolloClient from "./apollo";
import OffersList from "./components/OffersList";

class App extends Component {
  render() {
    return (
      <ApolloProvider client={apolloClient}>
        <OffersList />
      </ApolloProvider>
    );
  }
}

export default App;
