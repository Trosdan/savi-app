import React from "react";
import { SafeAreaView, Text, StyleSheet } from "react-native";
import styled from "styled-components";
export default ContactUs = () => {
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

    return (
        <SafeAreaView style={styles.container}>
            <MainTitle>ENTRE EN CONTACTO CON:</MainTitle>
            <EmailText>colombia@savi.app</EmailText>
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
