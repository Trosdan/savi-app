import React, { Component } from "react";
import { Text } from "react-native";
import { Avatar, Button, Card, Title, Paragraph } from "react-native-paper";
import { graphql } from "react-apollo";
import gql from "graphql-tag";

class OffersList extends Component {
  render() {
    console.log(this.props.data.offers.results);
    return (
      <>
        {this.props.data.offers.results.map(results => (
          <Text>{results.id}</Text>
        ))}
      </>
    );
  }
}

let organizarionName = "Makaia";

const OffersQuery = gql(`query {
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
  `);

export default graphql(OffersQuery, {
  options: {
    context: {
      headers: {
        "X-Parse-Application-Id": "",
        "X-Parse-Master-Key": "",
        "X-Parse-Client-Key": ""
      }
    }
  }
})(OffersList);
