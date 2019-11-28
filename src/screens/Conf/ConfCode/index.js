import React, {useState} from "react";
import { StyleSheet, Image, Text, TextInput } from "react-native";
import ButtonConfCode from "../../../components/ButtonConfCode";
import ButtonConfNotSend from "../../../components/ButtonConfNotSend";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {SafeAreaView} from 'react-native';
import {fetchData, storeData} from "../../../storage"
import { TouchableOpacity } from "react-native-gesture-handler";
import { Button } from 'react-native-paper';



ConfCode = ({ navigation }) => {

  const [inputCode, setInputCode] = useState(0)
  const [failedWarn, setFailedWarn] = useState(false)

  const checkCode = () => {

    console.log('checkcode')

    fetchData("code").then(code => {

      fetchData("loginType").then(loginType => {

        console.log("codigo dentro do fetch ta:", code);
        console.log(`foi inserido: ${inputCode}`)

        if (code === inputCode && loginType === "org") {
          console.log(`Navegando para orghub...`)
          navigation.navigate("OrgHub")
        } else if (code = !inputCode) {
          setFailedWarn(true)
        } else if (code === inputCode && loginType === "refugee") {
          console.log(`Navegando para mapscreen...`)

          navigation.navigate("MapScreen")
        }

      })
      
    });

  }
  return(
        <SafeAreaView style={styles.container} behavior="position" enabled>
          <Image
            source={require("../../../assets/images/savi.png")}
            resizeMode="contain"
            style={styles.LogoSavi}
          />
          <TextInput placeholder="Insira o Código" value={inputCode} style={styles.CodeInput}  onChangeText={code => setInputCode(code)} />
          {/* <Text style={{color:'red'}}>{failedWarn ? 'Código incorreto :/' : ""}</Text> */}
          <Button style={styles.continueButton} onPress={checkCode()}>Confirmar</Button>
          <ButtonConfNotSend style={styles.confNotSendButton} onPress={() => navigation.navigate('ConfirmationNumber')}/>
        </SafeAreaView>
    );}

export default ConfCode;

ConfCode.navigationOptions = {
    title: 'ConfirmationCode',
  }

const styles = StyleSheet.create({
  plus: {
    color: "#121212",
    fontSize: 20, 
    textAlignVertical: "center"
  },
  container: {
    //flex: 1,
    alignItems: "center",
    justifyContent: "flex-end"
  },
  LogoSavi: {
    width: wp("80%"),
    height: hp("30%"),
    alignSelf: "center",
    justifyContent: "flex-start",
    marginTop: hp("10%")
  },
  DescSavi: {
    color: "#121212",
    alignSelf: "flex-start",
    paddingRight: hp("7%"),
    paddingLeft: hp("7%"),
    fontSize: 24,
    textAlign: "center",
  },
  CodeInput: {
    color: "#121212",
    fontSize: 20,
    alignSelf: 'center'
  },
  DescNumber: {
    color: "#121212",
    alignSelf: "center",
    marginBottom: hp("2%"),
    fontSize: 20,
    textAlign: "center",
    marginTop: hp("7%"),
  },
  continueButton: {
    width: wp("40%"),
    height: hp("6%"),
    alignSelf: "center",
    marginTop: hp("5%"),
    backgroundColor:"#FF6400"
  },
  confNotSendButton: {
    alignSelf: "center",
    marginTop: hp("3%")
  },
  DescTerms: { 
    color: "#121212",
    paddingRight: wp("5%"),
    paddingLeft: wp("5%"),
    fontSize: 16,
    textAlign: "center",
    marginBottom: hp("2%")
  }
});

