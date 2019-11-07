import React, {useState} from 'react';
import { TextInput, Button, Text } from 'react-native-paper'
import gql from "graphql-tag"
import { useQuery } from '@apollo/react-hooks'
import {AsyncStorage} from 'react-native';
import { sendGridEmail } from 'react-native-sendgrid'


// import { Container } from './styles';

const OrgLogin = ({navigation}) => {

  const [email, setEmail] = useState('')

  storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      // Error saving data
    }
    };
  fetchData = async (key) => {
      try {
          const value = await AsyncStorage.getItem(key)
          if (value !== null) {
              return value
          }
      } catch (error) {

      }
  }


  getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
  }
  sendEmail = (destination) => {

  verificationCode = getRandomInt(0, 999999)  //gera um código de verificação aleatório
  storeData("verificationCode", verificationCode) //armazena localmente

  const SENDGRIDAPIKEY = "";
  const FROMEMAIL = "no-reply@savi.com";
  const TOMEMAIL = email;
  const SUBJECT = `Código de verificação:${verificationCode}`;

  const sendRequest = sendGridEmail(SENDGRIDAPIKEY, TOMEMAIL, FROMEMAIL, SUBJECT )
        sendRequest.then((response) => {
            console.log("Success")
        }).catch((error) =>{
            console.log(error)
        });
  }

  login = ({navigation}) => {
    const credentialsCheck = gql(`
    query {
      organizations(where: { email: { equalTo: "${email}"} }) {
        results {
          id
          name
        }
      }
    }
    `)
    const { data, loading, error } = useQuery(credentialsCheck)
    if (data.organizations.results==[]){
      return(
          <Text style={{color:'red'}}>
          Não achamos o seu cadastro :/
          </Text>
      )
    }
    else{ 
          sendEmail(data.organizations.results.email)
          navigation.navigate("ConfirmOrganizationNumber")
    }

    
  }

    return (
    <>
    <Text>Digite o email da sua organização.</Text>
    <TextInput
        label='Email'
        value={email}
        onChangeText={email => setEmail({ email })}
    />
    
    <Button onPress={login()}>Confirmar</Button>
    </>
    );
}

export default OrgLogin;



 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 