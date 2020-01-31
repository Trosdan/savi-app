import { createStore } from "redux";
import { Animated } from "react-native";

const INITIAL_STATE = {
    drawerActive: "Minha Localização",
    user: {
        gender: "Masculino",
        occupation: "Programador",
        name: "Guilherme",
        lastname: "Salvo",
        location: {
            latitude: -10,
            longitude: -40,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1
        },
        birthYear: new Date(),
        email: "ggelmisalvo@gmail.com",
        numero: null
    },
    markers: [],
    filterActive: {
        food: false,
        documentation: false,
        education: false,
        shelter: false,
        health: false,
        clothes: false,
        job: false,
        acessibility: false,
        nursery: false
    },
    filterTabActive: false,
    filterTabLoading: false,
    editProfileActive: false,
    isAddMemberDialogOpen: false,
    filterTabAnim: new Animated.Value(0),
    isMarkerSelected: false,
    markerSelected: {
        name: "",
        description: ""
    },
    markerCardAnimNum: new Animated.Value(0),
    isInitialRegion: false
};

function markerCardShowAnimFunc(markerCardAnimNum) {
    Animated.spring(markerCardAnimNum, {
        toValue: 1000
    }).start();
    //console.log('abriu');
}

function markerCardHideAnimFunc(markerCardAnimNum) {
    Animated.spring(markerCardAnimNum, {
        toValue: 0
    }).start();
    //console.log('fecho');
}

function reducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case "DRAWER_ACTIVE":
            return { ...state, drawerActive: action.title };
        case "UPDATE_LOCATION":
            //console.log('ASODASD'+action.latitude)
            return {
                ...state,
                user: {
                    ...state.user,
                    location: {
                        ...state.user.location,
                        latitude: action.latitude,
                        longitude: action.longitude
                    }
                }
            };
        case "ADD_MARKERS":
            console.log(action.markers);
            return { ...state, markers: action.markers };
        case "FILTER_ACTIVE":
            const filterA = action.filter;
            console.log(state.filterActive);
            console.log(filterA);
            let newState = state;
            newState.filterActive[filterA] = !state.filterActive[filterA];
            return newState;
        case "FILTERTAB_ACTIVE":
            return { ...state, filterTabActive: !state.filterTabActive };
        case "FILTER_LOADING":
            return { ...state, filterTabLoading: !state.filterTabLoading };
        case "FILTERTAB_ANIM":
            return { ...state, filterTabAnim: action.filterTabAnimNum };
        case "SELECT_MARKER":
            console.log("selecionou");
            //markerCardShowAnimFunc(state.markerCardAnimNum);
            return {
                ...state,
                markerSelected: {
                    ...state.markerSelected,
                    name: action.name,
                    description: action.description
                },
                isMarkerSelected: true
            };
        case "DESELECT_MARKER":
            //markerCardHideAnimFunc(state.markerCardAnimNum);
            console.log("deselecionou");
            return {
                ...state,
                isMarkerSelected: false
            };
        case "INITIAL_REGION":
            console.log("Initial Region");
            return {
                ...state,
                isInitialRegion: true
            };
        default:
            return state;
    }
}

const store = createStore(reducer);

export default store;
