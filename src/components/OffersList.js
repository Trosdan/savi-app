import React, { Component } from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { Text, StyleSheet } from "react-native";
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';

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

        <Card style={styles.card}>
        <Card.Title title="Card Title" subtitle="Card Subtitle" left={(props) => <Avatar.Icon {...props} icon="folder" />} />
        <Card.Content>
          <Title>{results.name}</Title>
          <Paragraph>{results.developmentArea}</Paragraph>
        </Card.Content>
        <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
        <Card.Actions>
          <Button>Pausar oferta</Button>
        </Card.Actions>
      </Card>
      ))}
    </>
  );
}
 const styles = StyleSheet.create({
   card:{
     margin:'19px'
   }
 })