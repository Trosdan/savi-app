import MapScreen from "./MapScreen";
import CustomDrawer from "../components/CustomDrawer";
import { createStackNavigator } from "react-navigation-stack";
import { createDrawerNavigator } from "react-navigation-drawer";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import SearchMarker from "./MarkerSearch";
import MarkerPage from "./Marker/MarkerPage";
import Welcome from "./Welcome";
/*
const Routes = createAppContainer(
    createStackNavigator({
        ConfirmationNumber: {
            screen: ConfNumber,
            navigationOptions: {
                title: 'ConfirmationNumber',
                header: null
            },
        },
        ConfirmationCode: {
            screen: ConfCode,
            navigationOptions: {
                title: 'ConfirmationCode',
                header: null 
            },
        },
        ConfirmationMap: {
            screen: ConfMap,
            navigationOptions: {
                title: 'ConfirmationMap',
                header: null
            }
        },
        ConfirmationWho: {
            screen: ConfWho,
            navigationOptions: {
                title: "ConfirmationWho",
                header: null
            }
        },
        RegistrationRefugee: {
            screen: RegRefugee,
            navigationOptions: {
                title: "RegistrationRefugee",
                header: null
            }
        },
        RegistrationRefugeeContinue: {
            screen: RegRefugeeCont,
            navigationOptions: {
                title: "RegistrationRefugeeContinue",
                header: null
            }
        },
        RegistrationRefugeeFamily: {
            screen: RegRefugeeFamily,
            navigationOptions: {
                title: "RegistrationRefugeeFamily",
                header: null
            }
        }
    })*/

const Drawer = createDrawerNavigator(
    {
        MapScreen: {
            screen: MapScreen,
            navigationOptions: {
                title: "MapScreen"
            }
        },

        SearchMarker: {
            screen: SearchMarker,
            navigationOptions: {
                title: "SearchMaker"
            }
        },
        MarkerPage: {
            screen: MarkerPage,
            navigationOptions: {
                title: "MarkerPage"
            }
        }
    },
    {
        initialRouteName: "MapScreen",
        contentComponent: CustomDrawer,
        contentOptions: {
            activeTintColor: "#000000",
            activeBackgroundColor: "#e6e6e6"
        }
    }
);

const Stack = createStackNavigator({
    // AuthLoading: {
    //     screen: AuthLoading,
    //     navigationOptions: {
    //         title: "AuthLoading",
    //         header: null
    //     }
    // },
    MapScreen: {
        screen: MapScreen,
        navigationOptions: {
            title: "MapScreen",
            header: null
        }
    }
    // Teste: {
    //     screen: Teste,
    //     navigationOptions: {
    //         title: "Teste",
    //         header: null
    //     }
    // },
});

const Switch = createSwitchNavigator({ Stack, Drawer });

const Routes = createAppContainer(Switch);

export default Routes;
