import React from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import {AppRegistry} from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import OrgHub from './OrgHub';
import OffersList from '../components/OffersList';
import OrgLogin from './OrgLogin';
import OrgRegister from './OrgRegister';
import OrgConfirmNumber from './OrgConfirmNumber';

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

const Stack = createStackNavigator({
    OrgLogin: {
        screen:OrgLogin,
        navigationOptions: {
            title: 'OrgLogin',
            header: null
        },
    OrgConfirmNumber: {
        screen:OrgConfirmNumber,
        navigationOptions: {
            title: 'OrgConfirmNumber',
            header: null
        },
    },
    OrgRegister: {
        screen:OrgRegister,
        navigationOptions: {
            title: 'OrgRegister',
            header: null
        },
    },
    OrgHub: {
        screen:OrgHub,
        navigationOptions: {
            title: 'OrgHub',
            header: null
        },
    },
    OffersList: {
        screen: OffersList,
        navigationOptions:{
            title: 'OffersList',
            header:null
        }
    },
    
}})
const Routes = createAppContainer(Stack)

export default () =>

    (<PaperProvider theme={theme}>
        <Routes />
    </PaperProvider>)
