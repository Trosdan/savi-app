import React, { useState, useEffect } from "react";
import {
    Text,
    View,
    SafeAreaView,
    Image,
    StyleSheet,
    ScrollView
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Button, List } from "react-native-paper";
import { fetchData, storeData } from "../../../storage";
import { gfetch } from "../../../services/grafetch";
const creds = require("../../../../creds.json");

function MemberList(props) { 
    const members = props.members;
    const listOfMembers = members.map((member, i) => (
        <View style={{ flex: 1, flexDirection: "row" }} key={i}>
            <View style={{ flex: 2 }}>
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                    {member.name}
                </Text>
                <Text>{member.age} anos</Text>
            </View>
            <View style={{ flex: 2 }}>
                <Button>ADD</Button>
            </View>
        </View>
    ));
    return <ScrollView style={{height:40}} horizontal={true}>{listOfMembers}</ScrollView>;
}

export default function RegRefugeeFamily({ navigation }) {
    const [members, setMembers] = useState([]);
    const registrateDependent = () => {
        navigation.navigate("RegistrationRefugee");
    };
    const getMembersFromFamily = async () => {
        let familyResponse = await fetchData("refugeeFamily");
        console.log("family inside asyncstorage: " + familyResponse);
        const familyObject = JSON.parse(JSON.parse(familyResponse));
        familyID = familyObject.data.updateFamily.id;

        getMembersDetails = `query refugeeInfoByFamily {
                refugees(where:
                  
                  {
              Family:{equalTo:"${familyID}"}
                  }
                                ) {
                  results {
                    name
                    age
        
                  }
                }
              }
              `;
        let familyQueryResponse = await gfetch(
            "https://parseapi.back4app.com/graphql",
            creds.header,
            getMembersDetails
        );
        let familyObj = JSON.parse(familyQueryResponse);
        let membersArray = familyObj.data.refugees.results;
        storeData("membersDetails", membersArray);
        setMembers(membersArray);
        return familyObj.data.refugees.results;
    };

    useEffect(() => {
        getMembersFromFamily();
    }, []);
    return (
        <KeyboardAwareScrollView
            style={{ backgroundColor: "#FFF" }}
            resetScrollToCoords={{ x: 0, y: 0 }}
            scrollEnabled={false}
            contentContainerStyle={{
                flexGrow: 1,
                justifyContent: "space-between",
                flexDirection: "column"
            }}
        >
            <View
                style={{
                    justifyContent: "flex-start",
                    alignSelf: "center",
                    height: hp("25%")
                }}
            >
                <Image
                    resizeMethod="auto"
                    source={require("../../../assets/images/savi.png")}
                    resizeMode="contain"
                    style={style.LogoSavi}
                />
                <Text style={style.RegFamilyTitle}>Registrar Família</Text>
               
            </View>
            <ScrollView style={{ alignSelf: "center", height: hp("65%") }}>
                 <MemberList style={style.member} members={members}></MemberList>
                <Button
                    mode="outlined"
                    style={style.addMember}
                    onPress={() => {
                        registrateDependent();
                    }}
                >
                    Adicionar membro da Família
                </Button>
            </ScrollView>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between"
                }}
            >
                <Button
                    mode="text"
                    icon="chevron-left"
                    style={{
                        //height: hp('6%'),
                        width: wp("28%"),
                        marginLeft: wp("5%"),
                        marginBottom: hp("2%"),
                        alignSelf: "flex-end"
                    }}
                    //onPress={() => {}}
                >
                    <Text style={{ color: "#707070", fontSize: 12 }}>
                        Voltar
                    </Text>
                </Button>
                <Button
                    mode="contained"
                    style={{
                        //height: hp('6%'),
                        width: wp("28%"),
                        marginRight: wp("5%"),
                        marginBottom: hp("2%"),
                        alignSelf: "flex-end"
                    }}
                    onPress={() => navigation.navigate("MapScreen")}
                >
                    <Text style={{ color: "#ffffff", fontSize: 12 }}>
                        Finalizar
                    </Text>
                </Button>
            </View>
        </KeyboardAwareScrollView>
    );
}

const style = StyleSheet.create({
    LogoSavi: {
        width: wp("50%"),
        height: hp("8%"),
        marginTop: hp("5%"),
        alignSelf: "center"
    },
    RegFamilyTitle: {
        fontSize: RFPercentage(4),
        //marginLeft: wp("5%"),
        marginTop: hp("2%"),
        fontWeight: "bold",
        alignSelf: "center",
        color: "#000",
        marginBottom: hp("1%")
    },
    member: {
        fontSize: RFPercentage(3),
        //marginLeft: wp("5%"),
        marginTop: hp("2%"),
        fontWeight: "bold",
        alignSelf: "center",
        color: "#000",
        marginBottom: hp("1%")
    },
    addMember: {
        width: wp("95%")
    }
});
