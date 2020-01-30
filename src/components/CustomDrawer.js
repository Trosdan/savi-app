import SafeAreaView from "react-native-safe-area-view";
import { DrawerNavigatorItems } from "react-navigation-drawer";
import { ScrollView, StyleSheet, View, Text, AsyncStorage } from "react-native";
import React, { useEffect, useState } from "react";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { Surface, Divider, List, Button } from "react-native-paper";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { NavigationActions } from "react-navigation";
import { useSelector, useDispatch } from "react-redux";
import { storeData, fetchData } from "../storage";
import { getMembersFromFamily } from "../services/backendIntegrations";
navigateToScreen = route => () => {
    const navigateAction = NavigationActions.navigate({
        routeName: route
    });
    this.props.navigation.dispatch(navigateAction);
};

export default function CustomDrawer({ navigation }) {
    const [userData, setUserData] = useState({ name: "", email: "" });
    useEffect(() => {
        setMembersFromFamilyAsync();
    }, []);
    setMembersFromFamilyAsync = async () => {
        let membersDetails = await getMembersFromFamily();

        console.log(`memberDetails in custom drawer ${membersDetails}`);
        setUserData(membersDetails[0]);
    };
    const drawerActive = useSelector(state => state.drawerActive);
    const dispatch = useDispatch();
    console.log(`user data: ${userData}`);
    function changeActive(title) {
        dispatch({ type: "DRAWER_ACTIVE", title: title });
    }

    return (
        <View style={{ flex: 1, justifyContent: "space-between" }}>
            <View
                style={{
                    height: hp("15%"),
                    backgroundColor: "#171f23",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <Text
                    style={{
                        fontWeight: "bold",
                        fontSize: RFPercentage(2.5),
                        color: "#fff",
                        alignSelf: "center"
                    }}
                >
                    Hola, {userData.name}!
                </Text>
                <Text style={{ color: "#fff", alignSelf: "center" }}>
                    {userData.email}
                </Text>
            </View>
            <View style={{ height: hp(".05%"), backgroundColor: "#171f23" }}>
                <View
                    style={{
                        height: hp(".05%"),
                        backgroundColor: "#444444",
                        width: "90%",
                        alignSelf: "center"
                    }}
                ></View>
            </View>
            <View
                style={{
                    backgroundColor: "#171f23",
                    justifyContent: "center"
                    //alignItems: 'center'
                }}
            >
                <List.Section>
                    <List.Item
                        onPress={() => {
                            navigation.navigate("UserProfile"),
                                changeActive("Minha Conta");
                        }}
                        title="Minha Conta"
                        style={
                            drawerActive == "Minha Conta"
                                ? styles.myAccountListActive
                                : styles.myAccountList
                        }
                        titleStyle={styles.myAccountListTitle}
                    />
                    <List.Item
                        // onPress={() => {
                        //     changeActive("Minha Familia");
                        // }}
                        onPress={() => {
                            storeData(
                                "lastScreen",
                                "RegistrationRefugeeFamily"
                            );

                            navigation.navigate("RegistrationRefugeeFamily");
                        }}
                        title="Minha Familia"
                        style={
                            drawerActive == "Minha Familia"
                                ? styles.myFamilyListActive
                                : styles.myFamilyList
                        }
                        titleStyle={styles.myFamilyListTitle}
                    />
                </List.Section>
            </View>
            <ScrollView style={{ backgroundColor: "#242f3e" }}>
                <SafeAreaView
                    style={styles.container}
                    forceInset={{ top: "always", horizontal: "never" }}
                >
                    <List.Section>
                        <List.Item
                            onPress={() => {
                                changeActive("Minha Localização");
                            }}
                            title="Minha Localização"
                            style={
                                drawerActive == "Minha Localização"
                                    ? styles.myLocalizationListActive
                                    : styles.myLocalizationList
                            }
                            titleStyle={styles.myLocalizationListTitle}
                        />
                        <List.Item
                            onPress={() => {
                                changeActive("Procurar Ajuda"),
                                    navigation.navigate("SearchMarker");
                            }}
                            title="Procurar Ajuda"
                            style={
                                drawerActive == "Procurar Ajuda"
                                    ? styles.searchListActive
                                    : styles.searchList
                            }
                            titleStyle={styles.searchTitle}
                        />
                        <List.Item
                            onPress={() => {
                                changeActive("Convidar Amigos");
                            }}
                            title="Convidar Amigos"
                            style={
                                drawerActive == "Convidar Amigos"
                                    ? styles.inviteFriendsListActive
                                    : styles.inviteFriendsList
                            }
                            titleStyle={styles.inviteFriendsTitle}
                        />
                        <List.Item
                            /*onPress={()=>{changeActive('Noticias')}}*/ title="Noticias"
                            style={
                                drawerActive == "Noticias"
                                    ? styles.newsListActive
                                    : styles.newsList
                            }
                            titleStyle={styles.newsTitle}
                        />
                    </List.Section>
                </SafeAreaView>
            </ScrollView>
            <View
                style={{
                    height: hp("8%"),
                    backgroundColor: "#171f23",
                    //flexDirection: 'row',
                    justifyContent: "center",
                    //width: '100%',
                    alignItems: "center"
                }}
            >
                <View style={{ flexDirection: "row" }}>
                    <Text
                        onPress={() => {
                            changeActive("Ajuda");
                        }}
                        style={styles.helpList}
                        titleStyle={styles.myAccountListTitle}
                    >
                        Ajuda
                    </Text>
                    <Text
                        onPress={() => {
                            changeActive("Contato");
                        }}
                        style={styles.contactList}
                        titleStyle={styles.myFamilyListTitle}
                    >
                        Contato
                    </Text>
                    <Text
                        onPress={() => {
                            AsyncStorage.clear();
                            navigation.navigate("ConfirmationWho");
                        }}
                        style={styles.contactList}
                        titleStyle={styles.myFamilyListTitle}
                    >
                        Sair
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#242f3e"
    },
    surface: {
        elevation: 3,
        flex: 1
    },
    myAccountListTitle: {
        color: "#fff",
        fontSize: RFPercentage(2),
        fontWeight: "500"
    },
    myFamilyListTitle: {
        color: "#fff",
        fontSize: RFPercentage(2),
        fontWeight: "500"
    },
    myLocalizationListTitle: {
        color: "#fff",
        fontSize: RFPercentage(2.1),
        fontWeight: "bold"
    },
    inviteFriendsTitle: {
        color: "#fff",
        fontSize: RFPercentage(2.1),
        fontWeight: "bold"
    },
    newsTitle: {
        color: "#aaa",
        fontSize: RFPercentage(2.1),
        fontWeight: "bold"
    },
    searchTitle: {
        color: "#fff",
        fontSize: RFPercentage(2.1),
        fontWeight: "bold"
    },
    helpTitle: {
        color: "#fff",
        fontSize: RFPercentage(1.5),
        fontWeight: "500",
        alignSelf: "center"
    },
    contactTitle: {
        color: "#fff",
        fontSize: RFPercentage(1.5),
        fontWeight: "500",
        alignSelf: "center"
    },
    myAccountList: {
        backgroundColor: "#171f23"
    },
    myFamilyList: {
        backgroundColor: "#171f23"
    },
    myLocalizationList: {
        backgroundColor: "#242f3e"
    },
    inviteFriendsList: {
        backgroundColor: "#242f3e"
    },
    newsList: {
        backgroundColor: "#242f3e"
    },
    searchList: {
        backgroundColor: "#242f3e"
    },
    helpList: {
        backgroundColor: "#171f23",
        //width: '30%',
        height: hp("5%"),
        textAlignVertical: "center",
        marginRight: wp("4%"),
        textDecorationLine: "underline",
        color: "#fff",
        fontWeight: "500"
    },
    contactList: {
        backgroundColor: "#171f23",
        //width: '30%'
        height: hp("5%"),
        textAlignVertical: "center",
        marginLeft: wp("4%"),
        textDecorationLine: "underline",
        color: "#fff",
        fontWeight: "500"
    },
    myAccountListActive: {
        backgroundColor: "#e65c00"
    },
    myFamilyListActive: {
        backgroundColor: "#e65c00"
    },
    myLocalizationListActive: {
        backgroundColor: "#ddd"
    },
    inviteFriendsListActive: {
        backgroundColor: "#ddd"
    },
    newsListActive: {
        backgroundColor: "#ddd"
    },
    searchListActive: {
        backgroundColor: "#ddd"
    }
});
