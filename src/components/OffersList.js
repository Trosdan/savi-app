import React, { Component } from "react";
import gql from "graphql-tag";
import { useQuery } from '@apollo/react-hooks';
import {Text} from 'react-native-paper'
import {StyleSheet} from 'react-native'
import { Avatar, Button, Card, Title, FAB} from 'react-native-paper';

export default OffersList = ({ navigation }) => {

  const styles = StyleSheet.create({
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
    },
    card: {
      margin: '10px'
    }
  })
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
    console.log(error)
    return <Text>ERROR :/</Text>
  }
  return (
    <>
      {data.offers.results.map(results => (
         <>
        <Title>Ofertas</Title>
        <Card >
          <Card.Title title={results.name} subtitle={results.developmentArea} left={(props) => <Avatar.Icon {...props} icon="folder" />} />

          <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
          <Card.Actions>
            <Button>Editar oferta</Button>
          </Card.Actions>
        </Card>
        <FAB 
            style={styles.fab}
            
            icon="plus"
            onPress={() => navigation.navigate("AddOffer")}/>

        </>
      ))}
    </>
  );
}




