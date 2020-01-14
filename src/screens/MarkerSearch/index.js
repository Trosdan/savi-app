import React, { useState } from "react";
import { View, Text, Image, ScrollView } from "react-native";
import {
    Appbar,
    Searchbar,
    Button,
    Card,
    Title,
    Paragraph,
    Surface,
    Caption,
    FAB
} from "react-native-paper";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useSelector, useDispatch } from "react-redux";

// import { Container } from './styles';

export default function MarkerSearch({ navigation }) {
    const latitude = useSelector(state => state.user.location.latitude);
    const longitude = useSelector(state => state.user.location.longitude);
    const dispatch = useDispatch();
    const [keyword, setKeyword] = useState("");
    const markers = useSelector(state => state.markers);

    const search = async keyword => {
        const results = await fetch()
        
    };
    async function read_offers(data) {
        if (data === 0) {
            return await axios.post(url, {}, config).then(res => {
                console.log(res.data.result);
                return (
                    addMarkers(res.data.result),
                    changeTabActive(),
                    toggleLoading(),
                    filterTabHideAnimFunc()
                );
            });
        } else {
            return await axios.post(url, data, config).then(res => {
                console.log(res.data.result);
                sleep(2000);
                return (
                    addMarkers(res.data.result),
                    changeTabActive(),
                    toggleLoading(),
                    filterTabHideAnimFunc()
                );
            });
        }
    }

    function addMarkers(markers) {
        dispatch({ type: "ADD_MARKERS", markers: markers });
    }

    function selectMarker(name, description) {
        dispatch({
            type: "SELECT_MARKER",
            name: name,
            description: description
        });
    }

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
                    onPress={() => navigation.openDrawer()}
                    color="#fff"
                />
                <Searchbar
                    placeholder="Search"
                    //onChangeText={query => {  }}
                    //value={firstQuery}
                    style={{
                        width: wp("94%"),
                        alignSelf: "center",
                        backgroundColor: "#66707d"
                    }}
                />
                <Button
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
                </Button>
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
                {markers.map(marker => (
                    <Card
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
                                categoria, categoria
                            </Text>
                        </Card.Content>
                        <FAB
                            style={{
                                position: "absolute",
                                marginRight: wp("3%"),
                                marginBottom: hp("1.5%"),
                                right: 0,
                                bottom: 0,
                                backgroundColor: "#ff7043"
                            }}
                            small
                            icon="arro-collapse-right"
                            onPress={() => {
                                navigation.navigate("MarkerPage"),
                                    selectMarker(
                                        marker.name,
                                        marker.description.portuguese
                                    );
                            }}
                        />
                    </Card>
                ))}
            </ScrollView>
        </View>
    );
}
