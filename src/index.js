import React from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import Routes from './screens'
import {KeyboardAvoidingView} from 'react-native';
import { Provider as ReduxProvider } from 'react-redux';
import store from './store';

const theme = {
    ...DefaultTheme,
    dark: true,
    mode: 'exact',
    roundness: 2,
    colors: {
      ...DefaultTheme.colors,
      primary: '#ff7043',
      accent: '#000',
      background: '#fff',
      text: '#000',
    }
};

const App = () => (

        <PaperProvider theme={theme}>
                <ReduxProvider store={store}>
            <Routes />
            </ReduxProvider>
        </PaperProvider>
);

export default App;
