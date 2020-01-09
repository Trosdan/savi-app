import React from "react";
import { List } from "react-native-paper";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { View, Image, StyleSheet, Text, SafeAreaView } from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { fetchData } from "../../../storage";
// import { Container } from './styles';

const ConfWho = ({ navigation }) => {
    const handleLoginEvent = async () => {
        const isLogged = await fetchData("loginType");

        if (isLogged) {
            navigation.navigate("MapScreen");
            console.log("Navegando para MapScreen");
        }
        console.log("Navegando para RegRefugee");
        navigation.navigate("RefugeeLogin");
    };
    return (
        <SafeAreaView
            style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "flex-end"
            }}
        >
            <Image
                source={require("../../../assets/images/savi.png")}
                resizeMode="contain"
                style={styles.LogoSavi}
            />
            <Text style={styles.PageTitle}>Quem és?</Text>
            <View
                style={{
                    backgroundColor: "#f0f0f0",
                    height: ".125%",
                    width: "80%"
                }}
            />
            <List.Section style={styles.List}>
                <List.Item
                    title="Refugiado"
                    description="Busque ajuda agora!"
                    onPress={() => handleLoginEvent()}
                    titleStyle={styles.ListTitle}
                    descriptionStyle={styles.ListDesc}
                />
                <View style={{ backgroundColor: "#f0f0f0", height: ".25%" }} />
                <List.Item
                    title="Organizações"
                    description="Ajude milhões!"
                    onPress={() => navigation.navigate("ContactUs")}
                    titleStyle={styles.ListTitle}
                    descriptionStyle={styles.ListDesc}
                />
                <View style={{ backgroundColor: "#f0f0f0", height: ".25%" }} />
                <List.Item
                    title="Doadores"
                    description="Contribua com a causa!"
                    onPress={() => navigation.navigate("ContactUs")}
                    titleStyle={styles.ListTitle}
                    descriptionStyle={styles.ListDesc}
                />
                <View style={{ backgroundColor: "#f0f0f0", height: ".25%" }} />
                <List.Item
                    title="Voluntários"
                    description="Colabore conosco!"
                    onPress={() => navigation.navigate("ContactUs")}
                    titleStyle={styles.ListTitle}
                    descriptionStyle={styles.ListDesc}
                />
            </List.Section>
            <View
                style={{
                    backgroundColor: "#f0f0f0",
                    height: ".125%",
                    width: "80%",
                    marginBottom: hp("5%")
                }}
            />
        </SafeAreaView>
    );
};
ConfWho.navigationOptions = {
    title: "ConfirmationWho"
};

export default ConfWho;

const styles = StyleSheet.create({
    LogoSavi: {
        width: wp("80%"),
        height: hp("30%"),
        alignSelf: "center",
        justifyContent: "flex-start",
        marginTop: hp("6%")
    },
    List: {
        width: wp("70%"),
        //alignItems: 'center',
        marginTop: 0,
        marginBottom: 0
    },
    ListTitle: {
        fontWeight: "bold",
        fontSize: RFPercentage(2)
    },
    PageTitle: {
        fontWeight: "bold",
        fontSize: RFPercentage(3),
        marginBottom: "10%"
    },
    ListDesc: {
        fontSize: RFPercentage(1.5)
    }
});
