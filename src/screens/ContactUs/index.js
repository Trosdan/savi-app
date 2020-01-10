import React, { useState } from "react";
// import { Title, TextInput, Button, Text } from "react-native-paper";
import {
    SafeAreaView,
    Text,
    StyleSheet,
    TouchableOpacity,
    AsyncStorage
} from "react-native";
import styled from "styled-components";
export default ContactUs = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const handlePress = () => {
        navigation.navigate(" ");
    };
    const MainTitle = styled(Text)`
        margin-left: 25px;
        margin-right: 5px;
        margin-top: 35px;

        font-family: Roboto;
        font-style: normal;
        font-weight: bold;
        font-size: 60px;
        line-height: 75px;

        color: #ffffff;
    `;
    const EmailText = styled(Text)`
        font-family: Roboto;
        font-style: normal;
        font-weight: bold;
        font-size: 36px;
        line-height: 75px;
        margin-left: 25px;
        color: #ffffff;
    `;
    // const SubmitButton = styled(Button)`
    //     margin: 35px;
    //     color: white;
    // `;
    // const Input = styled(TextInput)`
    //     margin: 35px;
    // `;
    // const EmailInput = styled(TextInput)`
    //     margin-bottom: 35px;
    //     margin-left: 25px;
    //     margin-right: 35px;

    //     background: #ffffff;
    // `;
    //     const SInput = styled(Input)`
    //     position: absolute;
    // width: 339px;
    // height: 242px;
    // left: 35px;
    // top: 339px;

    // background: #FFFFFF;
    // border-radius: 3px;`
    // const SubmitButton = styled(TouchableOpacity)`

    // position: absolute;
    // width: 195px;
    // height: 63px;
    // left: 101px;
    // top: 643px;

    // background: #FFFFFF;
    // border-radius: 5px;`
    return (
        <SafeAreaView style={styles.container}>
            <MainTitle>ENTRE EN CONTACTO CON:</MainTitle>
            <EmailText>colombia@savi.app</EmailText>
            {/* <Input label='Email'
            value={email}
            mode='flat'

            onChangeText={text => setEmail({ text })} />
            <EmailInput
                        mode='flat'

            label='Message'
            value={message}
            onChangeText={text => setMessage({ text })}/>
              <SubmitButton  mode="contained" onPress={()=>handlePress()}>
    Enviar
  </SubmitButton> */}
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: {
        backgroundColor: "#ff6400",
        flex: 1
    },
    submit: {
        width: 60,
        height: 60
    }
});
