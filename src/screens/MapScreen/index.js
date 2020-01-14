import React, { useEffect, Fragment, useState } from "react";
import Map from "../../components/Map";
import { useSafeArea } from "react-native-safe-area-context";

import {
    View,
    Image,
    StyleSheet,
    Text,
    ScrollView,
    Animated,
} from "react-native";
import {
    Appbar,
    Surface,
    Button,
    FAB,
    ActivityIndicator,
    Card,
    Divider
} from "react-native-paper";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { useSelector, useDispatch } from "react-redux";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import axios from "axios";
import { axheaders } from "../../../creds.json";
//import { } from 'react-navigation';

// import { Container } from './styles';

export default function MapScreen({ navigation }) {
    const food = useSelector(state => state.filterActive.food);
    const documentation = useSelector(
        state => state.filterActive.documentation
    );
    const education = useSelector(state => state.filterActive.education);
    const shelter = useSelector(state => state.filterActive.shelter);
    const health = useSelector(state => state.filterActive.health);
    const clothes = useSelector(state => state.filterActive.clothes);
    const job = useSelector(state => state.filterActive.job);
    const acessibility = useSelector(state => state.filterActive.acessibility);
    const nursery = useSelector(state => state.filterActive.nursery);
    const dispatch = useDispatch();
    const filterTabActive = useSelector(state => state.filterTabActive);
    const filterTabLoading = useSelector(state => state.filterTabLoading);

    const latitude = useSelector(state => state.user.location.latitude);
    const longitude = useSelector(state => state.user.location.longitude);
    const filters = useSelector(state => state.filterActive);

    const isMarkerSelected = useSelector(state => state.isMarkerSelected);
    const markerName = useSelector(state => state.markerSelected.name);
    const markerDesc = useSelector(state => state.markerSelected.description);

    const [filterTabAnimNum] = useState(new Animated.Value(0));
    const markerCardAnimNum = useSelector(state => state.markerCardAnimNum);

    const url = "https://parseapi.back4app.com/functions/get_offer_points";
    const config = {
        headers: axheaders
    };

    function filterTabShowAnimFunc() {
        Animated.spring(filterTabAnimNum, {
            toValue: 1000
        }).start();
        console.log("abriu");
    }

    function filterTabHideAnimFunc() {
        Animated.spring(filterTabAnimNum, {
            toValue: 0
        }).start();
        console.log("fecho");
    }

    const markerCardTabAnimPerc = markerCardAnimNum.interpolate({
        inputRange: [0, 1000],
        outputRange: [hp("0%"), hp("20%")]
    });

    const filterTabAnimPerc = filterTabAnimNum.interpolate({
        inputRange: [0, 1000],
        outputRange: [hp("0%"), hp("30%")]
    });

    const MapAnimPerc = filterTabAnimNum.interpolate({
        inputRange: [0, 1000],
        outputRange: [hp("89%"), hp("59%")]
    });

    function addMarkers(markers) {
        dispatch({ type: "ADD_MARKERS", markers: markers });
    }

    function sleep(milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
            if (new Date().getTime() - start > milliseconds) {
                break;
            }
        }
    }

    async function read_offers(data) {
        if (data === 0) {
            toggleLoading();
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
            toggleLoading();
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

    function changeActive(filter) {
        dispatch({ type: "FILTER_ACTIVE", filter: filter });
    }

    function changeTabActive() {
        dispatch({ type: "FILTERTAB_ACTIVE" });
    }

    function toggleLoading() {
        dispatch({ type: "FILTER_LOADING" });
    }

    const insets = useSafeArea();

    return (
        <View style={{ backgroundColor: "#000", paddingTop: insets.top }}>
            <View
                style={{
                    backgroundColor: "#ff7043",
                    height: hp("8%"),
                    justifyContent: "center",
                    width: wp("100%"),
                    flexDirection: "row",
                    alignItems: "center"
                }}
            >
                <View style={{ width: wp("20%"), alignItems: "flex-start" }}>
                    <Appbar.Action
                        style={{ marginLeft: wp("4%") }}
                        icon="menu"
                        onPress={() => navigation.openDrawer()}
                        color="#fff"
                    />
                </View>
                <View style={{ width: wp("60%"), alignItems: "center" }}>
                    <Image
                        source={require("../../assets/images/savibrancotitle.png")}
                        resizeMode="contain"
                        resizeMethod="auto"
                        style={{ height: hp("5%"), width: hp("10%") }}
                    />
                </View>
                <View style={{ width: wp("20%"), alignItems: "flex-end" }}>
                    <Image
                        source={require("../../assets/images/savibrancoicone.png")}
                        resizeMode="contain"
                        resizeMethod="auto"
                        style={{
                            height: hp("4%"),
                            width: hp("4%"),
                            marginRight: wp("4%")
                        }}
                    />
                </View>
            </View>
            {/* 
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Image
                        source={require("../../assets/images/savibrancoicone.png")}
                        resizeMode="contain"
                        resizeMethod="auto"
                        style={{ height: hp("6%"), width: hp("5%"), position: 'absolute', top: hp("2%"), left: hp("2%"), zIndex: 10}}
                    />
                </TouchableOpacity>
            */}
            <Animated.View style={{ height: MapAnimPerc }}>
                <Map onShowAnim={() => markerCardShowAnimFunc()} />
                {filterTabActive ? (
                    <>
                        {!filterTabLoading ? (
                            <FAB
                                style={styles.fab}
                                icon="arrow-collapse-right"
                                onPress={() =>
                                    read_offers({
                                        position: 0,
                                        filter: filters
                                    })
                                }
                            />
                        ) : (
                            <View
                                style={{
                                    justifyContent: "center",
                                    alignSelf: "center",
                                    position: "absolute",
                                    bottom: 0,
                                    marginBottom: hp("2%")
                                }}
                            >
                                <ActivityIndicator
                                    style={{
                                        elevation: 10,
                                        position: "absolute",
                                        alignSelf: "center"
                                    }}
                                    animating={true}
                                    color="#fff"
                                />
                                <FAB
                                    style={{
                                        backgroundColor: "#ff7043",
                                        color: "#fff"
                                    }}
                                />
                            </View>
                        )}
                    </>
                ) : (
                    <FAB
                        style={styles.fab}
                        icon="search-web"
                        onPress={() => {
                            changeTabActive(), filterTabShowAnimFunc();
                        }}
                    ></FAB>
                )}
            </Animated.View>
            <Animated.View
                style={{
                    height: filterTabAnimPerc,
                    justifyContent: "flex-start",
                    alignItems: "center",
                    backgroundColor: "#242f3e"
                }}
            >
                <View
                    style={{
                        flexDirection: "column",
                        width: wp("90%"),
                        height: hp("30%"),
                        justifyContent: "space-between"
                    }}
                >
                    <ScrollView>
                        <Button
                            onPress={() => {
                                changeActive("food");
                            }}
                            style={
                                food == false
                                    ? styles.filterButton
                                    : styles.filterButtonActive
                            }
                            mode="outlined"
                        >
                            <Text
                                style={
                                    food == true
                                        ? styles.filterButtonTextActive
                                        : styles.filterButtonText
                                }
                            >
                                ALIMENTAÇÃO
                            </Text>
                        </Button>
                        <Button
                            onPress={() => {
                                changeActive("documentation");
                            }}
                            style={
                                documentation == false
                                    ? styles.filterButton
                                    : styles.filterButtonActive
                            }
                            mode="outlined"
                        >
                            <Text
                                style={
                                    documentation == true
                                        ? styles.filterButtonTextActive
                                        : styles.filterButtonText
                                }
                            >
                                DOCUMENTAÇÃO
                            </Text>
                        </Button>
                        <Button
                            onPress={() => {
                                changeActive("education");
                            }}
                            style={
                                education == false
                                    ? styles.filterButton
                                    : styles.filterButtonActive
                            }
                            mode="outlined"
                        >
                            <Text
                                style={
                                    education == true
                                        ? styles.filterButtonTextActive
                                        : styles.filterButtonText
                                }
                            >
                                EDUCAÇÃO
                            </Text>
                        </Button>
                        <Button
                            onPress={() => {
                                changeActive("shelter");
                            }}
                            style={
                                shelter == false
                                    ? styles.filterButton
                                    : styles.filterButtonActive
                            }
                            mode="outlined"
                        >
                            <Text
                                style={
                                    shelter == true
                                        ? styles.filterButtonTextActive
                                        : styles.filterButtonText
                                }
                            >
                                ABRIGO
                            </Text>
                        </Button>
                        <Button
                            onPress={() => {
                                changeActive("health");
                            }}
                            style={
                                health == false
                                    ? styles.filterButton
                                    : styles.filterButtonActive
                            }
                            mode="outlined"
                        >
                            <Text
                                style={
                                    health == true
                                        ? styles.filterButtonTextActive
                                        : styles.filterButtonText
                                }
                            >
                                SAUDE
                            </Text>
                        </Button>
                        <Button
                            onPress={() => {
                                changeActive("clothes");
                            }}
                            style={
                                clothes == false
                                    ? styles.filterButton
                                    : styles.filterButtonActive
                            }
                            mode="outlined"
                        >
                            <Text
                                style={
                                    clothes == true
                                        ? styles.filterButtonTextActive
                                        : styles.filterButtonText
                                }
                            >
                                ROUPA
                            </Text>
                        </Button>
                        <Button
                            onPress={() => {
                                changeActive("job");
                            }}
                            style={
                                job == false
                                    ? styles.filterButton
                                    : styles.filterButtonActive
                            }
                            mode="outlined"
                        >
                            <Text
                                style={
                                    job == true
                                        ? styles.filterButtonTextActive
                                        : styles.filterButtonText
                                }
                            >
                                EMPREGO
                            </Text>
                        </Button>
                        <Button
                            onPress={() => {
                                changeActive("acessibility");
                            }}
                            style={
                                acessibility == false
                                    ? styles.filterButton
                                    : styles.filterButtonActive
                            }
                            mode="outlined"
                        >
                            <Text
                                style={
                                    acessibility == true
                                        ? styles.filterButtonTextActive
                                        : styles.filterButtonText
                                }
                            >
                                ACESSIBILIDADE
                            </Text>
                        </Button>
                        <Button
                            onPress={() => {
                                changeActive("nursery");
                            }}
                            style={
                                nursery == false
                                    ? styles.filterButton
                                    : styles.filterButtonActive
                            }
                            mode="outlined"
                        >
                            <Text
                                style={
                                    nursery == true
                                        ? styles.filterButtonTextActive
                                        : styles.filterButtonText
                                }
                            >
                                CRECHE
                            </Text>
                        </Button>
                    </ScrollView>
                </View>
            </Animated.View>
            <Card
                style={{
                    color: "#fff",
                    position: "absolute",
                    height: markerCardTabAnimPerc,
                    width: wp("96%"),
                    alignSelf: "center",
                    bottom: wp("2%"),
                    zIndex: 100
                }}
            >
                <Card.Content>
                    {/* <Text style={{fontSize: RFPercentage(3), fontWeight: '600'}}>{markerName}</Text>
                        <Text>{markerDesc}</Text> */}
                </Card.Content>
            </Card>
        </View>
    );
}

const styles = StyleSheet.create({
    fab: {
        backgroundColor: "#ff7043",
        color: "#fff",
        //height: hp("6%"),
        //width: wp("30%"),
        //borderRadius: wp("25%"),
        alignSelf: "center",
        position: "absolute",
        margin: hp("2%"),
        bottom: 0
    },
    fabText: {
        height: hp("6%"),
        width: wp("30%"),
        color: "#fff",
        textAlign: "center",
        textAlignVertical: "center"
    },
    surface: {
        alignSelf: "center",
        position: "absolute",
        margin: hp("2%"),
        bottom: 0,
        borderRadius: wp("25%"),
        alignItems: "center",
        justifyContent: "center",
        elevation: 4
    },
    filterButton: {
        marginTop: hp("2%"),
        borderWidth: 1.5,
        borderColor: "#ff7043",
        backgroundColor: "#242f3e"
    },
    filterButtonText: {
        color: "#ff7043"
    },
    filterButtonActive: {
        marginTop: hp("2%"),
        borderWidth: 1.5,
        borderColor: "#ff7043",
        backgroundColor: "#ff7043"
    },
    filterButtonTextActive: {
        color: "#242f3e"
    },
    filterTabActive: {
        height: hp("30%"),
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "#242f3e"
    },
    filterTab: {
        height: 0,
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "#242f3e"
    }
});
