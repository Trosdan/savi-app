import React, { useState, useEffect } from "react";
import { Text, StyleSheet } from "react-native";
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import {gfetch} from '../../services/grafetch'
keys = require("./creds")

export default function OffersList() {
  const creds = keys
  const [result, setResult] = useState([]);

  const organizarionName = "Makaia";
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


 
useEffect(()=>{
  debugger;
  console.log('xablau!')
  gfetch("https://parseapi.back4app.com/graphql", creds.headers, OffersQuery)
    .then(response => {
      console.log("response: " + JSON.stringify(response.data.offers.results));
      console.log(typeof(response.data.offers.results))
      response.data.offers.results.forEach((item)=>{
        setResult(result.push(item))
      })
      console.log(`result: ${result}`)
    })

    .catch(error => console.log);
  
},[])

   return (
    <>
    
      {result.map(results => (

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