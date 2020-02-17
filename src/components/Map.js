import React from "react";
import MapView, { Marker } from "react-native-maps";
import { useSelector, useDispatch } from "react-redux";
import MapStyle from "../components/MapStyle";

export default function components() {
    function selectMarker(name, description) {
        dispatch({
            type: "SELECT_MARKER",
            name: name,
            description: description
        });
    }

    function deselectMarker() {
        dispatch({ type: "DESELECT_MARKER" });
    }

    const dispatch = useDispatch();
    const region = useSelector(state => state.user.location);
    let markers = useSelector(state => state.markers);
    markers == null ? (markers = []) : console.log;
    return (
        <MapView
            style={{ flex: 1 }}
            initialRegion={region}
            showsUserLocation
            loadingEnabled
            customMapStyle={MapStyle}
            onPress={() => deselectMarker()}
        >
            {markers.map(marker => (
                <Marker
                    key={marker.objectId}
                    coordinate={{
                        latitude: marker.latitude,
                        longitude: marker.longitude
                    }}
                    title={marker.name}
                    description={marker.description.portuguese}
                    onPress={() => {
                        selectMarker(
                            marker.name,
                            marker.description.portuguese
                        );
                    }}
                />
            ))}
        </MapView>
    );
}
