import {} from "./../../../services/backendIntegrations";
import React, { Component } from "react";
import {
    View,
    Image,
    StyleSheet,
    ScrollView,
    Animated,
    Text,
    Dimensions,
    // Keyboard,
    TouchableOpacity,
    SafeAreaView
} from "react-native";
// import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"; //Implement later...
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { Button, TextInput, Portal, Dialog, List } from "react-native-paper";
import { RFPercentage } from "react-native-responsive-fontsize";
import { gfetch } from "../../../services/grafetch";
const creds = require("../../../../creds.json");
import { storeData, fetchData, unstring } from "../../../storage";
//import {getFamilyMembersQuery, bindMemberToFamily, createFamily, addMember} from '../../../services/backendConnections' =>Possible refactoring

export default class index extends Component {
    componentDidMount() {
        if (this.checkIfisSecondaryContact() == true) {
            this.setEmail();
        }
    }
    checkIfisSecondaryContact = async () => {
        let isSecondaryContact = await fetchData("isSecondaryContact");
        if (!isSecondaryContact) {
            console.log("é contato primário");
            this.setState({ primaryContact: true });
            return true;
        } else {
            console.log("é contato secundario");
            return false;
        }
    };
    setEmail = async () => {
        let RefugeeEmail = await fetchData("RefugeeEmail");
        RefugeeEmail = unstring(RefugeeEmail);
        this.setState({ email: RefugeeEmail });
        console.log(`setting default email value: ${RefugeeEmail}`);
    };

    stringfy = array => {
        stringedArray = "";
        for (index in array) {
            item = array[index];
            item = `"${item}",`;
            stringedArray = stringedArray.concat(item);
        }
        return stringedArray;
    };

    bindMemberToFamily = async (familyID, memberID) => {
        getFamilyMembersQuery = `
            query {
                families(where: { id: { equalTo: "${familyID}"} }) {
                results {
                    members
                }
                }
            }
        `;
        let familyQueryResponse = await gfetch(
            "https://parseapi.back4app.com/graphql",
            creds.header,
            getFamilyMembersQuery
        );
        debugger;
        familyQueryResponse = JSON.parse(familyQueryResponse);
        if (
            (familyQueryResponse.data.families.results[0] == undefined) |
            (familyQueryResponse.data.families.results == [])
        ) {
            familyMembers = [];
        } else {
            familyMembers =
                familyQueryResponse.data.families.results[0].members.ids;
        }
        debugger;
        familyMembers.push(memberID);
        familyMembers = this.stringfy(familyMembers);
        updateFamilyQuery = `
        mutation {
            updateFamily(id: "${familyID}", 
              fields: {
              members: {
                  ids:[ ${familyMembers}]
                } 
            }) {
              id
              members
            }
          }
          
          `;
        let updatedFamilyInfo = await gfetch(
            "https://parseapi.back4app.com/graphql",
            creds.header,
            updateFamilyQuery
        );
        console.log(`Updated family info after bind: ${updatedFamilyInfo}`);
        await storeData("refugeeFamily", updatedFamilyInfo);
        familyDetailsFromAsyncStorage = await fetchData("refugeeFamily");
        console.log(familyDetailsFromAsyncStorage);
        updatedFamilyInfo = JSON.parse(updatedFamilyInfo);
        return updatedFamilyInfo;
    };

    createFamily = async () => {
        createFamilyQuery = `
        mutation{
            createFamily(
              fields :{
              members:{ids:[]}
            }){
              id
            }
          }
        `;
        console.log("creating family...");
        let response = await gfetch(
            "https://parseapi.back4app.com/graphql",
            creds.header,
            createFamilyQuery
        );
        response = JSON.parse(response);
        console.log(response.data.createFamily.id);
        const familyid = response.data.createFamily.id;
        console.log("Family id: " + familyid);
        const storeOutput = await storeData("familyID", familyid);
        console.log(storeOutput);
        return familyid;
    };

    addMember = async (
        name = "",
        age = "",
        job = "",
        gender = "",
        docType = "",
        familyID = "",
        primaryContact = "",
        scholarity = "",
        email = "",
        needs = "",
        identificationDocument = ""
    ) => {
        const createRefugee = `
        mutation {
            createRefugee(
              fields: {
                name: "${name}"
                age: "${age}"
                job: "${job}"
                gender: "${gender}"
                identificationDocumentType: "${docType}" 
                Family: {
                    link: "${familyID}"
                            }
                primaryContact: ${primaryContact}
                scholarity: "${scholarity}" 
                email: "${email}"
                needs: "${needs}" 
                identificationDocument: "${identificationDocument}" 
              }
            ) {
              id
            }
          }
          `;
        console.log("Adding memberID...");
        let response = await gfetch(
            "https://parseapi.back4app.com/graphql",
            creds.header,
            createRefugee
        );
        response = JSON.parse(response);
        return response;
    };

    registrate = async () => {
        this.setState({ primaryContact: true });
        console.log("primary contact");
        const familyid = await this.createFamily();
        console.log("created family");
        this.setState({ familyID: familyid });
        const memberIDResponse = await this.addMember(
            this.state.name,
            this.state.age,
            this.state.job,
            this.state.gender,
            this.state.docType,
            familyid,
            this.state.primaryContact,
            this.state.scholarity,
            this.state.email,
            this.state.needs,
            this.state.doc
        );
        let memberID = memberIDResponse.data.createRefugee.id;
        console.log("Added memberID");
        console.log(memberID);

        await this.bindMemberToFamily(familyid, memberID);
        console.log("binded memberID to family");
        await storeData("isSecondaryContact", true);
    };

    registrateAdditionalMember = async () => {
        console.log(`additional member`);
        this.setState({ primaryContact: false });
        let familyData = await fetchData("refugeeFamily"); //fetching refugeeFamily:[{"id":"oAgsC9Dymy","members":{"ids":[]}}]

        let familyDataParsed = JSON.parse(familyData);
        if (typeof (familyDataParsed != "object")) {
            console.log("type error: response is not an object, parsing...");
            familyDataParsed = JSON.parse(familyDataParsed);
            try {
                this.setState({ familyID: familyDataParsed[0].id });
            } catch (error) {
                console.log("catching...");
                console.log(`ID: ${familyDataParsed.data.updateFamily.id}`);
                const familyIDFromObj = familyDataParsed.data.updateFamily.id;
                debugger;
                this.setState({
                    familyID: familyIDFromObj
                });
            }
        }
        const addMemberResponse = await this.addMember(
            this.state.name,
            this.state.age,
            this.state.job,
            this.state.gender,
            this.state.docType,
            this.state.familyID,
            this.state.primaryContact,
            this.state.scholarity,
            this.state.email,
            this.state.needs,
            this.state.doc
        );
        let memberid;
        if (typeof (addMemberResponse != "string")) {
            console.log(
                "response from addmember:" + JSON.stringify(addMemberResponse)
            );
            debugger;
            memberid = addMemberResponse.data.createRefugee.id;
        } else {
            console.error("Wrong type of member ID");
        }
        this.bindMemberToFamily(this.state.familyID, memberid);
    };
    calcAge = () => {
        const birthDate = new Date(
            this.state.selectedYear,
            this.state.selectedMonth,
            this.state.selectedDay
        );
        const now = new Date();
        const diffTime = Math.abs(now - birthDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const diffYears = diffDays / 365;
        this.setState({ age: diffYears });
    };

    decideWhichFunctionToUseOnRegisterButton = async () => {
        const { navigate } = this.props.navigation;
        this.calcAge();
        let isSecondaryContact = await fetchData("isSecondaryContact");
        console.log(isSecondaryContact);

        if (isSecondaryContact) {
            await this.registrateAdditionalMember();

            navigate(`RegistrationRefugeeFamily`);
        } else {
            await this.registrate();
            if (!this.state.email) navigate("ConfirmationCode");
            navigate(`RegistrationRefugeeFamily`);
        }
    };

    state = {
        isSecondaryContact: null,
        job: "teste",
        scholarity: "teste",
        needs: "teste",
        primaryContact: null,
        email: "teste",
        familyID: "",
        name: "teste",
        lastName: "",
        doc: "",
        docType: "",
        gender: "",
        age: "",
        selectedYear: "1988",
        selectedDay: "31",
        fadeAnim: new Animated.Value(0),
        scrollRef: null,
        isMonthSelectorVisible: false,
        selectedMonth: 9,
        nullForms: "",
        error: ""
    };

    _showDialog = () => this.setState({ isMonthSelectorVisible: true });

    _hideDialog = () => this.setState({ isMonthSelectorVisible: false });

    _selectRadioButton = value => this.setState({ checked: value });

    render() {
        const { navigate } = this.props.navigation;
        const SCREEN_WIDTH = Dimensions.get("window").width;
        this.state.scrollRef = React.createRef();
        let text;
        let error = this.state.nullForms;
        this.state.isSecondaryContact
            ? (text = "Registrar el contacto principal de la familia.")
            : (text = "Registrar un contacto secundario de la familia.");
        const { fadeAnim, isMonthSelectorVisible, selectedMonth } = this.state;
        function hideAnimFunc() {
            Animated.spring(fadeAnim, {
                toValue: 100
            }).start();
            console.log(hideAnimPerc);
        }
        function showAnimFunc() {
            Animated.spring(fadeAnim, {
                toValue: 0
            }).start();
        }
        const hideAnimPerc = fadeAnim.interpolate({
            inputRange: [0, 100],
            outputRange: [hp("-10%"), hp("-30%")]
        });
        const hideAnimPercView = fadeAnim.interpolate({
            inputRange: [0, 100],
            outputRange: [hp("45%"), hp("25%")]
        });
        const extendFormView = fadeAnim.interpolate({
            inputRange: [0, 100],
            outputRange: [hp("50%"), hp("70%")]
        });
        const checkFirstForm = () => {
            if (this.state.email != "" && this.state.name != "") {
                this.scroll.getNode().scrollTo({ x: SCREEN_WIDTH }),
                    hideAnimFunc();
            } else if (this.state.email != "" && this.state.name == "") {
                this.setState({ error: "nos informe seu primeiro nome" });
            } else if (this.state.email == "" && this.state.name != "") {
                this.setState({ error: "nos informe seu melhor email" });
            } else {
                this.setState({ error: "preencha os campos de email e nome" });
            }
        };
        const checkSecondForm = () => {
            if (
                this.state.selectedYear != "" &&
                this.state.selectedMonth != ""
            ) {
                this.scroll.getNode().scrollTo({ x: SCREEN_WIDTH * 2 });
            } else if (
                this.state.selectedDay != "" &&
                this.state.selectedMonth == ""
            ) {
                this.setState({
                    error: "nos informe seu primeiro nome"
                });
            } else if (this.state.email == "" && this.state.name != "") {
                this.setState({
                    error: "nos informe seu melhor email"
                });
            } else {
                this.setState({
                    error: "preencha os campos de email e nome"
                });
            }
        };
        return (
            <SafeAreaView
                style={{ backgroundColor: "#FFF" }}
                resetScrollToCoords={{ x: 0, y: 0 }}
                scrollEnabled={false}
                contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: "space-between",
                    flexDirection: "column"
                }}
            >
                <Animated.Image
                    source={require("../../../assets/images/formback.png")}
                    resizeMode="stretch"
                    resizeMethod="auto"
                    style={{
                        width: "100%",
                        height: hp("55%"),
                        position: "absolute",
                        top: hideAnimPerc
                        //transform: [{translateY: fadeAnim._value}]
                    }}
                />
                <Animated.View
                    style={{
                        justifyContent: "flex-start",
                        alignSelf: "center",
                        height: hideAnimPercView
                    }}
                >
                    <Image
                        resizeMethod="auto"
                        source={require("../../../assets/images/savibranco.png")}
                        resizeMode="contain"
                        style={style.LogoSavi}
                    />
                    <Text style={style.RegFamilyTitle}>Registrar Familia</Text>
                    <Text style={style.RegFamilyText}>
                        Todos los miembros de la familia deben estar en el mismo
                        lugar, si están en diferentes lugares deben registrarse
                        en diferentes teléfonos.
                    </Text>
                </Animated.View>
                <Animated.ScrollView
                    style={{ height: extendFormView }}
                    horizontal
                    pagingEnabled
                    scrollEnabled={false}
                    showsHorizontalScrollIndicator={false}
                    ref={c => {
                        this.scroll = c;
                    }}
                    onScroll={Animated.event(
                        [
                            {
                                nativeEvent: {
                                    contentOffset: { x: this.animation }
                                }
                            }
                        ],
                        { useNativeDriver: true }
                    )}
                >
                    <View
                        style={{
                            width: SCREEN_WIDTH,
                            backgroundColor: "#fff",
                            height: hp("50%")
                            //justifyContent: "space-between"
                        }}
                        index={0}
                    >
                        <View
                            style={{
                                width: SCREEN_WIDTH,
                                backgroundColor: "#fff",
                                height: hp("10%"),
                                justifyContent: "flex-start"
                            }}
                        >
                            <Text style={style.RegFamilySubtitle}>{text}</Text>
                        </View>
                        <Text
                            style={{
                                color: "red",
                                fontWeight: "bold",
                                marginLeft: wp("5%"),
                                fontSize: 12,
                                lineHeight: 12,
                                height: 12
                            }}
                        >
                            {this.state.error}
                        </Text>
                        <View
                            style={{
                                width: SCREEN_WIDTH,
                                backgroundColor: "#fff",
                                height: hp("40%"),
                                justifyContent: "flex-end"
                            }}
                        >
                            <TextInput
                                style={style.EmailInput}
                                label="Correo electrónico."
                                mode="outlined"
                                onChangeText={inputValue =>
                                    this.setState({ email: inputValue })
                                }
                                value={this.state.email}
                            />
                            <TextInput
                                style={style.NameInput}
                                label="Primer nombre"
                                mode="outlined"
                                onChangeText={name =>
                                    this.setState({ name: name })
                                }
                                value={this.state.name}
                            />
                            <TextInput
                                style={style.LastnameInput}
                                label="Apellido - opcional"
                                mode="outlined"
                                onChangeText={lastName =>
                                    this.setState({ lastName: lastName })
                                }
                                value={this.state.lastName}
                            />

                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between"
                                }}
                            >
                                <Button
                                    mode="text"
                                    icon="chevron-left"
                                    style={{
                                        //height: hp("6%"),
                                        width: wp("28%"),
                                        marginLeft: wp("5%"),
                                        marginBottom: hp("2%"),
                                        alignSelf: "flex-end"
                                    }}
                                    onPress={() =>
                                        this.scroll.getNode().scrollTo({ x: 0 })
                                    }
                                >
                                    <Text
                                        style={{
                                            color: "#707070",
                                            fontSize: 12
                                        }}
                                    >
                                        Voltar
                                    </Text>
                                </Button>
                                <Button
                                    mode="contained"
                                    style={{
                                        //height: hp("6%"),
                                        width: wp("32%"),
                                        marginRight: wp("5%"),
                                        marginBottom: hp("2%"),
                                        alignSelf: "flex-end"
                                    }}
                                    onPress={() => checkFirstForm()}
                                >
                                    <Text
                                        style={{
                                            color: "#ffffff",
                                            fontSize: 12
                                        }}
                                    >
                                        Continuar
                                    </Text>
                                </Button>
                            </View>
                        </View>
                    </View>

                    <Animated.View
                        style={{
                            width: SCREEN_WIDTH,
                            backgroundColor: "#fff",
                            height: extendFormView,
                            justifyContent: "flex-end"
                        }}
                        index={1}
                    >
                        <View
                            style={{
                                width: SCREEN_WIDTH,
                                backgroundColor: "#fff",
                                height: hp("10%"),
                                justifyContent: "flex-start"
                            }}
                        >
                            <Text style={style.RegFamilySubtitle}>
                                Informaciones adicionales.
                            </Text>
                        </View>
                        <View
                            style={{
                                width: SCREEN_WIDTH,
                                backgroundColor: "#fff",
                                height: hp("60%"),
                                justifyContent: "flex-end"
                            }}
                        >
                            <TextInput
                                style={style.NameInput}
                                label="Documento de Identidade - opcional"
                                mode="outlined"
                                onChangeText={doc =>
                                    this.setState({ doc: doc })
                                }
                                value={this.state.doc}
                            />
                            <TextInput
                                style={style.TextInput}
                                label="Tipo de Documento de Identidade - opcional"
                                mode="outlined"
                                onChangeText={docType =>
                                    this.setState({ docType: docType })
                                }
                                value={this.state.docType}
                            />
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    marginLeft: wp("5%"),
                                    marginRight: wp("5%"),
                                    marginBottom: hp("2%")
                                }}
                            >
                                <TextInput
                                    style={style.DayInput}
                                    label="Dia"
                                    mode="outlined"
                                    onChangeText={selectedDay =>
                                        this.setState({
                                            selectedDay: selectedDay
                                        })
                                    }
                                    value={this.state.selectedDay}
                                />
                                <TouchableOpacity onPress={this._showDialog}>
                                    <TextInput
                                        style={style.MonthInput}
                                        label="Mês"
                                        mode="outlined"
                                        editable={false}
                                        disabled={true}
                                        //onFocus={ Keyboard.dismiss(), this._showDialog}
                                        value={`${selectedMonth}`}
                                        theme={{
                                            colors: {
                                                disabled: "#707070",
                                                placeholder: "#000"
                                            }
                                        }}
                                    />
                                </TouchableOpacity>
                                <Portal>
                                    <Dialog
                                        visible={isMonthSelectorVisible}
                                        onDismiss={this._hideDialog}
                                        style={{ height: hp("50%") }}
                                    >
                                        <Dialog.Title>Mês</Dialog.Title>
                                        <Dialog.ScrollArea>
                                            <ScrollView>
                                                <List.Item
                                                    title="Janeiro"
                                                    value={2}
                                                    onPress={() =>
                                                        this.setState({
                                                            selectedMonth: 0
                                                        })
                                                    }
                                                    style={
                                                        selectedMonth == 0
                                                            ? {
                                                                  backgroundColor:
                                                                      "#ccc"
                                                              }
                                                            : {
                                                                  backgroundColor:
                                                                      "#FFF"
                                                              }
                                                    }
                                                />
                                                <List.Item
                                                    title="Fevereiro"
                                                    onPress={() =>
                                                        this.setState({
                                                            selectedMonth: 1
                                                        })
                                                    }
                                                    style={
                                                        selectedMonth == 1
                                                            ? {
                                                                  backgroundColor:
                                                                      "#ccc"
                                                              }
                                                            : {
                                                                  backgroundColor:
                                                                      "#FFF"
                                                              }
                                                    }
                                                />
                                                <List.Item
                                                    title="Março"
                                                    onPress={() =>
                                                        this.setState({
                                                            selectedMonth: 2
                                                        })
                                                    }
                                                    style={
                                                        selectedMonth == 2
                                                            ? {
                                                                  backgroundColor:
                                                                      "#ccc"
                                                              }
                                                            : {
                                                                  backgroundColor:
                                                                      "#FFF"
                                                              }
                                                    }
                                                />
                                                <List.Item
                                                    title="Abril"
                                                    onPress={() =>
                                                        this.setState({
                                                            selectedMonth: 3
                                                        })
                                                    }
                                                    style={
                                                        selectedMonth == 3
                                                            ? {
                                                                  backgroundColor:
                                                                      "#ccc"
                                                              }
                                                            : {
                                                                  backgroundColor:
                                                                      "#FFF"
                                                              }
                                                    }
                                                />
                                                <List.Item
                                                    title="Maio"
                                                    onPress={() =>
                                                        this.setState({
                                                            selectedMonth: 4
                                                        })
                                                    }
                                                    style={
                                                        selectedMonth == 4
                                                            ? {
                                                                  backgroundColor:
                                                                      "#ccc"
                                                              }
                                                            : {
                                                                  backgroundColor:
                                                                      "#FFF"
                                                              }
                                                    }
                                                />
                                                <List.Item
                                                    title="Junho"
                                                    onPress={() =>
                                                        this.setState({
                                                            selectedMonth: 5
                                                        })
                                                    }
                                                    style={
                                                        selectedMonth == 5
                                                            ? {
                                                                  backgroundColor:
                                                                      "#ccc"
                                                              }
                                                            : {
                                                                  backgroundColor:
                                                                      "#FFF"
                                                              }
                                                    }
                                                />
                                                <List.Item
                                                    title="Julho"
                                                    onPress={() =>
                                                        this.setState({
                                                            selectedMonth: 6
                                                        })
                                                    }
                                                    style={
                                                        selectedMonth == 6
                                                            ? {
                                                                  backgroundColor:
                                                                      "#ccc"
                                                              }
                                                            : {
                                                                  backgroundColor:
                                                                      "#FFF"
                                                              }
                                                    }
                                                />
                                                <List.Item
                                                    title="Agosto"
                                                    onPress={() =>
                                                        this.setState({
                                                            selectedMonth: 7
                                                        })
                                                    }
                                                    style={
                                                        selectedMonth == 7
                                                            ? {
                                                                  backgroundColor:
                                                                      "#ccc"
                                                              }
                                                            : {
                                                                  backgroundColor:
                                                                      "#FFF"
                                                              }
                                                    }
                                                />
                                                <List.Item
                                                    title="Setembro"
                                                    onPress={() =>
                                                        this.setState({
                                                            selectedMonth: 8
                                                        })
                                                    }
                                                    style={
                                                        selectedMonth == 8
                                                            ? {
                                                                  backgroundColor:
                                                                      "#ccc"
                                                              }
                                                            : {
                                                                  backgroundColor:
                                                                      "#FFF"
                                                              }
                                                    }
                                                />
                                                <List.Item
                                                    title="Outubro"
                                                    onPress={() =>
                                                        this.setState({
                                                            selectedMonth: 9
                                                        })
                                                    }
                                                    style={
                                                        selectedMonth == 9
                                                            ? {
                                                                  backgroundColor:
                                                                      "#ccc"
                                                              }
                                                            : {
                                                                  backgroundColor:
                                                                      "#FFF"
                                                              }
                                                    }
                                                />
                                                <List.Item
                                                    title="Novembro"
                                                    onPress={() =>
                                                        this.setState({
                                                            selectedMonth: 10
                                                        })
                                                    }
                                                    style={
                                                        selectedMonth == 10
                                                            ? {
                                                                  backgroundColor:
                                                                      "#ccc"
                                                              }
                                                            : {
                                                                  backgroundColor:
                                                                      "#FFF"
                                                              }
                                                    }
                                                />
                                                <List.Item
                                                    title="Dezembro"
                                                    onPress={() =>
                                                        this.setState({
                                                            selectedMonth: 11
                                                        })
                                                    }
                                                    style={
                                                        selectedMonth == 11
                                                            ? {
                                                                  backgroundColor:
                                                                      "#ccc"
                                                              }
                                                            : {
                                                                  backgroundColor:
                                                                      "#FFF"
                                                              }
                                                    }
                                                />
                                            </ScrollView>
                                        </Dialog.ScrollArea>
                                        <Dialog.Actions>
                                            <Button onPress={this._hideDialog}>
                                                Ok
                                            </Button>
                                        </Dialog.Actions>
                                    </Dialog>
                                </Portal>
                                <TextInput
                                    keyboardType="numeric"
                                    maxLength={4}
                                    style={style.YearInput}
                                    label="Ano"
                                    mode="outlined"
                                    value={`${this.state.selectedYear}`}
                                    onChangeText={year => {
                                        this.setState({ selectedYear: year });
                                    }}
                                />
                            </View>
                            <TouchableOpacity
                            //onPress={this._showDialog}
                            >
                                <TextInput
                                    value={this.state.gender}
                                    style={style.LastnameInput}
                                    label="Mes"
                                    mode="outlined"
                                    editable={false}
                                    disabled={true}
                                    label="Gênero"
                                    //onFocus={ Keyboard.dismiss(), this._showDialog}
                                    theme={{
                                        colors: {
                                            disabled: "#707070",
                                            placeholder: "#000"
                                        }
                                    }}
                                />
                            </TouchableOpacity>
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between"
                                }}
                            >
                                <Button
                                    mode="text"
                                    icon="chevron-left"
                                    style={{
                                        //height: hp("6%"),
                                        width: wp("28%"),
                                        marginLeft: wp("5%"),
                                        marginBottom: hp("2%"),
                                        alignSelf: "flex-end"
                                    }}
                                    onPress={() => {
                                        this.scroll
                                            .getNode()
                                            .scrollTo({ x: 0 }),
                                            showAnimFunc();
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: "#707070",
                                            fontSize: 12
                                        }}
                                    >
                                        Voltar
                                    </Text>
                                </Button>
                                <Button
                                    mode="contained"
                                    style={{
                                        //height: hp("6%"),
                                        width: wp("28%"),
                                        marginRight: wp("5%"),
                                        marginBottom: hp("2%"),
                                        alignSelf: "flex-end"
                                    }}
                                    onPress={() => {
                                        checkSecondForm();
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: "#ffffff",
                                            fontSize: 12
                                        }}
                                    >
                                        Continuar
                                    </Text>
                                </Button>
                            </View>
                        </View>
                    </Animated.View>
                    <Animated.View
                        style={{
                            width: SCREEN_WIDTH,
                            backgroundColor: "#fff",
                            height: extendFormView,
                            justifyContent: "flex-end"
                        }}
                        index={2}
                    >
                        <View
                            style={{
                                width: SCREEN_WIDTH,
                                backgroundColor: "#fff",
                                height: hp("10%"),
                                justifyContent: "flex-start"
                            }}
                        >
                            <Text style={style.RegFamilySubtitle}>
                                Alguma necessidade que queira nos informar?
                            </Text>
                        </View>
                        <View
                            style={{
                                width: SCREEN_WIDTH,
                                backgroundColor: "#fff",
                                height: hp("60%"),
                                justifyContent: "flex-end"
                            }}
                        >
                            <TextInput
                                style={style.NameInput}
                                label="Necessidade"
                                mode="outlined"
                                value={this.state.needs}
                                onChangeText={need => {
                                    this.setState({ needs: need });
                                }}
                            />

                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between"
                                }}
                            >
                                <Button
                                    mode="text"
                                    icon="chevron-left"
                                    style={{
                                        //height: hp("6%"),
                                        width: wp("28%"),
                                        marginLeft: wp("5%"),
                                        marginBottom: hp("2%"),
                                        alignSelf: "flex-end"
                                    }}
                                    onPress={() =>
                                        this.scroll
                                            .getNode()
                                            .scrollTo({ x: SCREEN_WIDTH })
                                    }
                                >
                                    <Text
                                        style={{
                                            color: "#707070",
                                            fontSize: 12
                                        }}
                                    >
                                        Voltar
                                    </Text>
                                </Button>
                                <Button
                                    mode="contained"
                                    style={{
                                        //height: hp("6%"),
                                        width: wp("28%"),
                                        marginRight: wp("5%"),
                                        marginBottom: hp("2%"),
                                        alignSelf: "flex-end"
                                    }}
                                    onPress={() =>
                                        this.decideWhichFunctionToUseOnRegisterButton()
                                    }
                                >
                                    <Text
                                        style={{
                                            color: "#ffffff",
                                            fontSize: 12
                                        }}
                                    >
                                        Continuar
                                    </Text>
                                </Button>
                            </View>
                        </View>
                    </Animated.View>
                </Animated.ScrollView>
            </SafeAreaView>
        );
    }
}

const style = StyleSheet.create({
    EmailInput: {
        marginLeft: wp("5%"),
        marginRight: wp("5%"),
        marginTop: hp("4%"),
        marginBottom: hp("-2%")
    },
    LogoSavi: {
        width: wp("70%"),
        height: hp("10%"),
        marginTop: hp("5%"),
        alignSelf: "center"
    },
    NameInput: {
        marginLeft: wp("5%"),
        marginRight: wp("5%"),
        marginBottom: hp("2%"),
        marginTop: hp("4%")
    },
    LastnameInput: {
        marginLeft: wp("5%"),
        marginRight: wp("5%"),
        marginBottom: hp("2%")
    },
    TextInput: {
        marginLeft: wp("5%"),
        marginRight: wp("5%"),
        marginBottom: hp("2%")
    },
    RegFamilySubtitle: {
        fontSize: RFPercentage(3),
        marginLeft: wp("7%"),
        marginRight: wp("7%"),
        alignSelf: "center",
        color: "#000",
        textAlign: "center",
        marginTop: hp("2%")
    },
    DayInput: {
        width: wp("28%"),
        marginRight: wp("3%")
    },
    MonthInput: {
        width: wp("28%"),
        marginRight: wp("3%")
    },
    YearInput: {
        width: wp("28%")
    },
    RegFamilyTitle: {
        fontSize: RFPercentage(4),
        //marginLeft: wp("5%"),
        marginTop: hp("2%"),
        fontWeight: "bold",
        alignSelf: "center",
        color: "#FFF",
        marginBottom: hp("1%")
    },
    RegFamilyText: {
        fontSize: RFPercentage(2.2),
        alignSelf: "center",
        marginLeft: wp("10%"),
        marginRight: wp("10%"),
        marginTop: hp("5%"),
        color: "#FFF",
        textAlign: "center",
        marginBottom: hp("3%")
    }
});
