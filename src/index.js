import React from "react";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import Routes from "./screens";
import { SafeAreaView } from "react-native";
import { Provider as ReduxProvider } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context";
import store from "./store";
import { MaterialCommunityIcons } from '@expo/vector-icons';


const theme = {
    ...DefaultTheme,
    dark: true,
    mode: "exact",
    roundness: 2,
    colors: {
        ...DefaultTheme.colors,
        primary: "#ff7043",
        accent: "#000",
        background: "#fff",
        text: "#000"
    }
};

const App = () => (
    <ReduxProvider store={store}>
        <SafeAreaProvider>
            <PaperProvider
                theme={theme}
                settings={{
                    icon: props => <MaterialCommunityIcons {...props} />,
                  }}
            >
                <Routes />
            </PaperProvider>
        </SafeAreaProvider>
    </ReduxProvider>
);

export default App;
