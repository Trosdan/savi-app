import React from "react";
import {

  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { useState, useEffect } from "react";
import { fetchData, storeData } from "../../storage";
import { sendEmail } from "../../services/email";

export default OrgLogin = ({ navigation }) =>{
  console.log(navigation)
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [runned, setRunned] = useState(false);
  //const [isValid, setValid] = useState(false); //utilizar posteriormente na validação de email.

  const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  };

  const login = verificationCode => {
    verificationCode = getRandomInt(100000, 999999);
    storeData("code", verificationCode);
    fetchData("code").then(code => {
      console.log("codigo dentro do fetch ta:", code);
    });
    console.log("codigo de verificação:", verificationCode);
    if (email === "") {
      return null;
    }

    setIsLoading(true);
    return fetch("https://parseapi.back4app.com/graphql", {
      credentials: "omit",
      headers: {
        Accept: "*/*",
        "content-type": "application/json",
        "X-Parse-Application-Id": "47RAnYvxm7rWLUTUZYHt9SItJjd9FnmWj5ZK5g92",
        "X-Parse-Master-Key": "7qesIb1ZkUrjHEzxloP5j173OLMr8XI9u05BEeyh",
        "X-Parse-Client-Key": "jLJjTD2ATpWq6cwofTkpBBgL8Mt4nVewhugNmZX7"
      },

      body: `{"operationName":null,"variables":{},"query":"{\\n  organizations(where: {email: {equalTo: \\"${email}\\"}}) {\\n    results {\\n      email\\n    }\\n  }\\n}\\n"}`,
      method: "POST",
      mode: "cors"
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson.data.organizations.results[0].email);
        let responseEmail = responseJson.data.organizations.results[0].email;
        if (responseEmail != null) {
          sendEmail(verificationCode, responseEmail);
          console.log("response email: ", responseEmail);
          setIsLoading(false);
          navigation.navigate('OrgConfirmNumber')
        }
        //
        setIsLoading(false);
      })
      .catch(error => {
        console.error(error);
        setIsLoading(false);
      });
      
  };

  const styles = StyleSheet.create({
    button: {
      borderRadius: 4,
      borderWidth: 0.5,
      borderColor: "#d6d7da",
      height: 50,
      width: 80
    }
  });

  useEffect(() => {
    console.log(email);
  });
  if (isLoading) {
    return (
      <View style={{ flex: 1, padding: 20 }}>
        <ActivityIndicator style={{ flex: 1, width: 200 }}/>
      </View>
    );
  }
  return (
    <>
      <Text>Digite o email da sua organização.</Text>
      <TextInput label="Email" onChangeText={name => setEmail(name)} />

      <TouchableOpacity style={styles.button} onPress={() => login()} />
      <TouchableOpacity style={styles.button} onPress={navigation.navigate("OrgConfirmNumber")} />
    </>
  );
}
