import {
    deleteRefugee,
    getMembersFromFamily
} from "../services/backendIntegrations";
import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, Alert } from "react-native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { Button, Dialog, Portal } from "react-native-paper";
import { fetchData } from "../storage";
import { RadioButton } from "react-native-paper";

const MemberList = () => {
    const [membersState, setMembers] = useState([]);
    const [dialogVisibility, setDialogVisibility] = useState(false);
    const [newPrimaryContact, setPrimaryContact] = useState(null);
    const showAlert = () => {
        Alert.alert(
            "Exclusão de conta",
            "Tem certeza que quer excluir a conta principal deste aparelho?",
            [
                {
                    text: "Si",
                    onPress: () => {
                        setDialogVisibility(true);
                    }
                },
                { text: "Cancelar", onPress: () => console.log("cancelar") }
            ]
        );
    };
    const [listOfMembers, setListOfMembers] = useState(null);

    const getAndSetMembers = async () => {
        let members = await getMembersFromFamily();
        console.log(`members :${members}`);
        setMembers(members);
    };
    const deleteMainMember = memberid => {
        if (showAlert() == true) {
            deleteMember(memberid);
            deleteFamily();
        }
    };
    const deleteMember = async memberid => {
        if (memberid) await deleteRefugee(memberid);
        let newList = membersState.filter(
            thisMember => thisMember.id !== memberid
        );
        setMembers(newList);
    };

    const verifyMemberInStorage = async member => {
        let refugeeFamily = await fetchData("refugeeFamily");
        refugeeFamily = JSON.parse(refugeeFamily);
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
                    {member.primaryContact == true ? (
                        <Button
                            style={{
                                flex: 1,
                                alignSelf: "flex-end",
                                width: 100,
                                height: 50,
                                color: "#ff6400"
                            }}
                            onPress={() => deleteMainMember(member.id)}
                            // onPress={() => {
                            //    console.log(`Deletando ${member.name}`);
                            // }}
                        >
                            <Text>DELETE</Text>
                        </Button>
                    ) : (
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
                    )}
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
            <Portal>
                {
                    <Dialog
                        visible={dialogVisibility}
                        onDismiss={() => setDialogVisibility(false)}
                    >
                        <Dialog.Title>
                            Selecione um novo contacto principal
                        </Dialog.Title>
                        <Dialog.Content>
                            {membersState.map((member, i) => {
                                return (
                                    <View
                                        key={i}
                                        style={{
                                            flexDirection: "row"
                                        }}
                                    >
                                        <RadioButton
                                            value={member.id}
                                            status={
                                                newPrimaryContact === member.id
                                                    ? "checked"
                                                    : "unchecked"
                                            }
                                            onPress={() => {
                                                setPrimaryContact(member.id);
                                            }}
                                        />
                                        <Text
                                            style={{
                                                fontSize: 25
                                            }}
                                        >
                                            {member.name}
                                        </Text>
                                    </View>
                                );
                            })}
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={() => setDialogVisibility(false)}>
                                Done
                            </Button>
                        </Dialog.Actions>
                    </Dialog>
                }
            </Portal>
        </ScrollView>
    );
};
export default MemberList;
