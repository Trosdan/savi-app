import Parse from "parse/react-native";
import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import creds from "../../creds.json";
import { AsyncStorage } from "react-native";
Parse.setAsyncStorage(AsyncStorage);
Parse.serverURL = "https://parseapi.back4app.com/";
Parse.initialize("47RAnYvxm7rWLUTUZYHt9SItJjd9FnmWj5ZK5g92", creds.jskeys);

export default Parse;

export const getOffers = async (filters, logicalOperator = "and") => {
    const Marker = Parse.Object.extend("offer");
    let queryMarkers = new Parse.Query(Marker);
    if (logicalOperator == "and") {
        newMarkers = filters.map(filter => {
            queryMarkers = queryMarkers.equalTo(filter.key, filter.value);
        });
    } else if (logicalOperator == "or") {
        newMarkers = filters.map(filter => {
            queryMarkers = queryMarkers.orEqualTo(filter.key, filter.value);
        });
    }
    results = await newMarkers.find();
    return results;
};

export const getAllOffers = async () => {
    const Marker = Parse.Object.extend("offer");
    let queryMarkers = new Parse.Query(Marker);
    let resultsRaw = await queryMarkers.find();
    let results = resultsRaw.map(result => {
        result = result.attributes;
    });
    debugger;
    return results;
};
