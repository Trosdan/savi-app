import React from "react";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { RFPercentage } from "react-native-responsive-fontsize";

import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    SafeAreaView
} from "react-native";
import { TextInput, Button, Title } from "react-native-paper";
import { useState, useEffect } from "react";
import { fetchData, storeData } from "../../storage";
import { sendEmail } from "../../services/email";
import client from "../../services/client";

export default RefugeeLogin = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    //const [isValid, setValid] = useState(false); //utilizar posteriormente na validação de email.

    const getRandomInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    };

    const storeFamilyDetails = async email => {
        console.log("storing family details...");
        getFamilyIDQuery = `
        query{
        refugees(limit:1, where:{email:{equalTo:"${email}"}}){
            results{
                Family {
                    id
                }
            }
        }
        }`;

        let queryResponse = await client.gfetch(getFamilyIDQuery);

        if (JSON.parse(queryResponse).data.refugees.results.length == 0) {
            return 0;
        }
        const familyID = JSON.parse(queryResponse).data.refugees.results[0]
            .Family.id;

        const getFamilyDetailsQuery = `
        query{
        families(where:{id:{equalTo:"${familyID}"}}){
            results{
            id 
            members
            }
        }
        }`;
        queryResponse = await client.gfetch(getFamilyDetailsQuery);

        storeData(
            "refugeeFamily",
            JSON.parse(queryResponse).data.families.results
        );
    };

    const login = async navigation => {
        storeData("RefugeeEmail", email);

        let verificationCode = getRandomInt(100000, 999999);
        verificationCode = verificationCode.toString();
        await storeData("code", verificationCode);
        storeData("loginType", "refugee");
        // const code = await fetchData("code"); //debugging only! do NOT use in production.
        // console.log("codigo dentro do fetch ta:", code);
        console.log("codigo de verificação:", verificationCode);

        if (email === "") return null;
        setIsLoading(true);
        const verifyRefugeeEmailQuery = `
        query {
            refugees(where: {email: {equalTo: "${email}"}}) {
                 results {
                    email
                 }
    
            }
        }
        `;
        const response = await client.gfetch(verifyRefugeeEmailQuery);

        let responseJson = JSON.parse(response);
        console.log(`full json response: ${responseJson}`);
        console.log("response: " + responseJson.data.refugees.results[0]);
        if (responseJson.data.refugees.results[0] == undefined) {
            //verificando se o email existe no banco de dados
            console.log(
                "Email não existe no banco de dados. Redirecionando para tela de registro."
            );
            navigation.navigate("RegistrationRefugee");
        } else {
            let responseEmail = responseJson.data.refugees.results[0].email;
            if (responseEmail != null) {
                const emailApiResponse = await sendEmail(
                    verificationCode,
                    responseEmail
                );
                if (emailApiResponse != undefined) {
                    const emailReponseJson = await emailApiResponse.json();
                    console.log(`Email response: ${emailReponseJson}`);

                    console.log("response email: ", responseEmail);
                }

                setIsLoading(false);
                storeFamilyDetails(email);
                storeData("isSecondaryContact", true);
                navigation.navigate("ConfirmationCode");
            }
        }
        //
        setIsLoading(false);
    };

    useEffect(() => {
        console.log(email);
    });

    if (isLoading) {
        return (
            <View style={{ flex: 1, padding: 20 }}>
                <ActivityIndicator
                    style={{ flex: 1, width: 500, alignSelf: "center" }}
                />
            </View>
        );
    }
    return (
        <SafeAreaView>
            <View style={styles.container}>
                <Title style={styles.title}>
                    Ingrese su correo eletrónico aquí
                </Title>
                <TextInput
                    mode="outlined"
                    style={styles.email}
                    label="Email"
                    onChangeText={name => setEmail(name)}
                />

                <Button style={styles.button} onPress={() => login(navigation)}>
                    Enviar
                </Button>
            </View>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    button: {
        width: wp("28%"),
        marginLeft: wp("5%"),
        marginBottom: hp("2%"),
        alignSelf: "center",
        color: "black"
    },
    email: {
        width: wp("84%"),
        marginLeft: wp("8%")
    },
    title: {
        fontSize: RFPercentage(3),
        marginLeft: wp("7%"),
        marginRight: wp("7%"),
        alignSelf: "center",
        color: "#000",
        textAlign: "center",
        marginTop: hp("10%")
    },
    container: {}
});
