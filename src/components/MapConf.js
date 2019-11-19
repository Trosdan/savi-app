navigator.geolocation = require('@react-native-community/geolocation');

//import Geolocation from '@react-native-community/geolocation';
import React, { Component } from 'react';
import MapView from 'react-native-maps';

export default class MapConf extends Component{
    state = {
        region: null,
    };

    async componentDidMount(){
        navigator.geolocation.getCurrentPosition(
            ({ coords: { latitude, longitude } }) => {
               this.setState({
                   region: {
                       latitude,
                       longitude,
                       latitudeDelta: 0.1,
                       longitudeDelta: 0.1
                   }
               });
               console.log(latitude, longitude); 
            },
            () => {},
            {
                timeout: 20000,
                enableHighAccuracy: false,
                maximumAge: 10000,
            }
        );
        //console.log('envio');
    }

    render () {
        const { region } = this.state;

        return (
            <MapView 
                style={{ flex: 1 }} 
                region={region} 
                showsUserLocation
                loadingEnabled
            />
        );
    }
}