import Parse from "../../services/Parse";
import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";

export default function Teste({ navigation }) {
    const [markers, setMarkers] = useState({});
    useEffect(() => {
        const Marker = Parse.Object.extend("offer");
        let queryMarkers = new Parse.Query(Marker);
        queryMarkers.equalTo("education", true).equalTo("name", "Alpha Lumen");
        queryMarkers
            .find()
            .then(results => {
                setMarkers(results);
            })
            .catch(err => {
                console.log("deu ruim amigo: ", err);
            });
        return () => {
            console.log("cleaning up...");
        };
    }, []);
    return (
        <View>
            <Text>{JSON.stringify(markers)}</Text>
        </View>
    );
}
