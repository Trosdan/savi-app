import React, { useState, useEffect } from "react";
import { DrawerActions } from "react-navigation-drawer";
import { View, Text, Image, ScrollView } from "react-native";
import { Appbar, Searchbar, Card } from "react-native-paper";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useSelector, useDispatch } from "react-redux";
import { fetchData } from "../../storage";
// import { Container } from './styles';

export default function MarkerSearch({ navigation }) {
    const dispatch = useDispatch();
    const [keyword, setKeyword] = useState("");
    const [markers, setMarkers] = useState([]);
    const [connectionStatus, setConnectionStatus] = useState(200);
    const verifyConnection = async () => {
        let response = await fetch("https://ifconfig.me/");
        console.log("connection status: ", response.status);
        return response.status;
    };

    const getMarkersAndFilter = async () => {
        let markersFromAsyncStorage = await fetchData("markers");

        markersFromAsyncStorage = JSON.parse(markersFromAsyncStorage);
        debugger;
        const keywordInLowercase = keyword.toLowerCase();
        let newMarkers = markersFromAsyncStorage.filter(marker => {
            if (
                marker.description.portuguese
                    .toLocaleLowerCase()
                    .includes(keywordInLowercase) |
                marker.description.english
                    .toLocaleLowerCase()
                    .includes(keywordInLowercase) |
                marker.description.spanish
                    .toLocaleLowerCase()
                    .includes(keywordInLowercase) |
                marker.name.toLocaleLowerCase().includes(keywordInLowercase)
            ) {
                return marker;
            }
        });
        debugger;
        return newMarkers;
    };

    const markersFromRedux = useSelector(state => state.markers);

    useEffect(() => {
        let connectionStatus = verifyConnection();
        setConnectionStatus(connectionStatus);
    }, []);

    useEffect(() => {
        setMarkers(markersFromRedux);
    }, []);

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: "#242f3e",
                width: wp("100%")
            }}
        >
            <Image
                source={require("../../assets/images/LeftGradient.png")}
                //resizeMode="contain"
                resizeMethod="auto"
                style={{
                    height: hp("100%"),
                    width: wp("2%"),
                    alignSelf: "flex-start",
                    position: "absolute"
                }}
            />
            <View
                style={{
                    backgroundColor: "#242f3e",
                    width: wp("98%"),
                    alignSelf: "flex-end"
                }}
            >
                <Appbar.Action
                    style={{ marginLeft: wp("4%") }}
                    icon={{ source: "menu", color: "#fff" }}
                    onPress={() =>
                        navigation.dispatch(DrawerActions.openDrawer())
                    }
                    color="#fff"
                />

                <Searchbar
                    placeholder="Search"
                    onIconPress={async () => {
                        let newMarkers;
                        newMarkers = await getMarkersAndFilter();
                        setMarkers(newMarkers);
                    }}
                    onChangeText={async query => {
                        setKeyword(query);
                    }}
                    onSubmitEditing={async () => {
                        let newMarkers;
                        newMarkers = await getMarkersAndFilter();
                        setMarkers(newMarkers);
                    }}
                    value={keyword}
                    style={{
                        width: wp("94%"),
                        alignSelf: "center",
                        backgroundColor: "#66707d"
                    }}
                />
                {/* <Button
                    contentStyle={{
                        //borderRadius: hp("4%"),
                        height: hp("4%")
                    }}
                    style={{
                        borderRadius: hp("4%"),
                        width: wp("35%"),
                        marginTop: hp("1.5%"),
                        alignSelf: "flex-end",
                        marginRight: wp("2%")
                    }}
                    contentStyle={{
                        borderRadius: hp("4%")
                    }}
                    mode="contained"
                    //small={true}
                    icon="menu"
                    onPress={() => console.log("Pressed")}
                >
                    <Text style={{ color: "#fff" }}>FILTRAR</Text>
                </Button> */}
            </View>
            <ScrollView
                style={{
                    flex: 1,
                    marginTop: hp("3%"),
                    height: hp("100%"),
                    width: wp("98%"),
                    alignSelf: "flex-end"
                }}
            >
                {markers.map((marker, i) => (
                    <Card
                        key={i}
                        style={{
                            width: wp("92%"),
                            //alignSelf: 'center',
                            //marginLeft: wp('2%'),
                            backgroundColor: "#394351",
                            //height: hp("16%"),
                            alignSelf: "center",
                            //marginLeft: wp('2%'),
                            //alignItems: 'center',
                            justifyContent: "center",
                            elevation: 5,
                            borderRadius: 3,
                            backgroundColor: "#394351",
                            marginBottom: hp("2%")
                        }}
                        onPress={() => {}}
                    >
                        <Card.Content>
                            <Text
                                style={{
                                    fontSize: RFPercentage(3),
                                    color: "#fff",
                                    fontWeight: "700"
                                }}
                            >
                                {marker.name}
                            </Text>
                            <Text
                                style={{
                                    fontSize: RFPercentage(2),
                                    color: "#fff",
                                    marginTop: hp(".5%")
                                }}
                            >
                                {marker.description.portuguese}
                            </Text>
                            <Text
                                style={{
                                    fontSize: RFPercentage(1.5),
                                    color: "#aaa",
                                    marginTop: hp("2%"),
                                    marginBottom: hp("2%")
                                }}
                            >
                                Está a {marker.distance.toFixed(2)} kilómetros
                                de aquí.
                            </Text>
                        </Card.Content>
                    </Card>
                ))}
            </ScrollView>
        </View>
    );
}
