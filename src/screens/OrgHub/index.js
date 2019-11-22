import React, { useState } from "react";
import { Text, StyleSheet } from "react-native";
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import {gfetch} from '../../services/grafetch'
keys = require("./creds")

export default function OffersList() {
  
  const creds = keys

  const [result, setResult] = useState(null)

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
  gfetch('https://parseapi.back4app.com/graphql', creds.headers, OffersQuery)
  .then(response => response.json())
    .then(responseJson =>{
    console.log('rjsondata: '+responseJson.data)
    console.log('aaaaa')
    console.log(JSON.stringify(creds))
    console.log('response: '+(responseJson))
    setResult(responseJson)
    console.log(result)
  }).catch(error => console.log)
  
   return (
    <>
    
      {result.data.offers.results.map(results => (

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