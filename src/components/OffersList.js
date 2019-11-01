import React, { Component } from "react";

import { graphql } from "react-apollo";
import gql from "graphql-tag";

class OffersList extends Component {
  render() {
    console.log(this.props);
    return <></>;
  }
}

const OffersQuery = gql`
  query {
    offers(where: { name: { equalTo: "Makaia" } }) {
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

export default graphql(
  OffersQuery,
  { name: "offers_query" },
  {
    context: {
      headers: {
        "X-Parse-Application-Id": "47RAnYvxm7rWLUTUZYHt9SItJjd9FnmWj5ZK5g92",
        "X-Parse-Master-Key": "7qesIb1ZkUrjHEzxloP5j173OLMr8XI9u05BEeyh"
      }
    }
  }
)(OffersList);
