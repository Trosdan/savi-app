import React, { Component } from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { Text } from "react-native";

export default function OffersList() {
  let organizarionName = "Makaia";
  const OffersQuery = gql(`
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
  `);

  const { data, loading, error } = useQuery(OffersQuery);
  if (loading) return <Text>Loading...</Text>;
  if (error) {
    console.log(error);
    return <Text>ERROR :/</Text>;
  }
  return (
    <>
      {data.offers.results.map(results => (
        <Text>{results.id}</Text>
      ))}
    </>
  );
}
