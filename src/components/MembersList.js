import {
    deleteRefugee,
    getMembersFromFamily
} from "../services/backendIntegrations";
import React, { useState, useEffect } from "react";
import { ScrollView, View, Text } from "react-native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { Button } from "react-native-paper";

const MemberList = () => {
    const [membersState, setMembers] = useState();
    const [listOfMembers, setListOfMembers] = useState(null);

    const getAndSetMembers = async () => {
        let members = await getMembersFromFamily();
        console.log(`members :${members}`);
        setMembers(members);
    };

    const deleteMember = async memberid => {
        await deleteRefugee(memberid);
        let newList = membersState.filter(
            thisMember => thisMember.id !== memberid
        );
        setMembers(newList);
    };

    useEffect(() => {
        getAndSetMembers();
    }, []);

    useEffect(() => {
        console.log("lista de membros:");
        if (membersState == undefined) {
            return;
        }
        const listOfMembersJSX = membersState.map((member, i) => (
            <View style={{ flex: 1, flexDirection: "row" }} key={i}>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                        {console.log(`Rendering ${member.name}`)}
                        {member.name}
                    </Text>
                    <Text>{Math.trunc(member.age)} anos</Text>
                </View>

                <View style={{ flex: 2 }}>
                    <Button
                        style={{
                            flex: 1,
                            alignSelf: "flex-end",
                            width: 100,
                            height: 50,
                            color: "#ff6400"
                        }}
                        onPress={() => deleteMember(member.id)}
                        // onPress={() => {
                        //    console.log(`Deletando ${member.name}`);
                        // }}
                    >
                        <Text>DELETE</Text>
                    </Button>
                </View>
            </View>
        ));
        setListOfMembers(listOfMembersJSX);
    }, [membersState]);

    return (
        <ScrollView
            style={{ height: hp("66%"), marginLeft: wp("5%") }}
            horizontal={false}
        >
            {listOfMembers}
        </ScrollView>
    );
};
export default MemberList;
