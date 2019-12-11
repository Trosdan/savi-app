import React, { Component } from "react";
import { View, Image, StyleSheet, ScrollView, Animated, Text, Dimensions, Keyboard, TouchableOpacity, SafeAreaView } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";
import { Button, TextInput, Portal, Dialog, List } from "react-native-paper";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { TouchableHighlight } from "react-native-gesture-handler";
import { gfetch } from "../../../services/grafetch"
const  creds = require("../../../../creds.json")
import {storeData, fetchData} from "../../../storage"

export default class index extends Component {

    stringfy = (array) =>{
        stringedArray = ""
        for(index in array){
            item=array[index]
            item = `"${item}",`
            stringedArray = stringedArray.concat(item)
        }
        return stringedArray
    }

    bindMemberToFamily = async (familyID, member) => {
        getFamilyMembersQuery = `
            query {
                families(where: { id: { equalTo: "${familyID}"} }) {
                results {
                    
                    members
                }
                }
            }
        `
        let familyQueryResponse = await gfetch("https://parseapi.back4app.com/graphql", creds.headers, getFamilyMembersQuery)
        familyQueryResponse = JSON.parse(familyQueryResponse)
        let familyMembers = familyQueryResponse.data.families.results[0].members.ids
        familyMembers.push(member)
        familyMembers = this.stringfy(familyMembers)
        updateFamilyQuery = `
        mutation {
            updateFamily(id: "${familyID}", 
              fields: {
              members: {
                  ids:[  {ids:[${familyMembers}]}  ]
                } 
            }) {
              id
              members
            }
          }
          
          `
          let updateFamilyResponse = await gfetch("https://parseapi.back4app.com/graphql", creds.headers, updateFamilyQuery)
          console.log(updateFamilyResponse) 
          updateFamilyResponse = JSON.parse(updateFamilyResponse)
          return  updateFamilyResponse
        //   "{"errors":[{"message":"Syntax Error: Expected :, found Name \"fields\"","locations":[{"line":4,"column":15}],"extensions":{"code":"GRAPHQL_PARSE_FAILED","exception":{"stacktrace":["GraphQLError: Syntax Error: Expected :, found Name \"fields\"","    at syntaxError (/usr/src/app/node_modules/graphql/error/syntaxError.js:15:10)","    at Parser.expectToken (/usr/src/app/node_modules/graphql/language/parser.js:1404:40)","    at Parser.parseArgument (/usr/src/app/node_modules/graphql/language/parser.js:329:10)","    at Parser.optionalMany (/usr/src/app/node_modules/graphql/language/parser.js:1497:28)","    at Parser.parseArguments (/usr/src/app/node_modules/graphql/language/parser.js:319:17)","    at Parser.parseField (/usr/src/app/node_modules/graphql/language/parser.js:306:23)","    at Parser.parseSelection (/usr/src/app/node_modules/graphql/language/parser.js:280:81)","    at Parser.many (/usr/src/app/node_modules/graphql/language/parser.js:1518:26)","    at Parser.parseSelectionSet (/usr/src/app/node_modules/graphql/language/parser.js:267:24)","    at Parser.parseOperationDefinition (/usr/src/app/node_modules/graphql/language/parser.js:195:26)"]}}}]}

    }
    createFamily = async ( ) =>{
        createFamilyQuery = `
        mutation{
            createFamily(
              fields :{
              members:{ids:[]}
            }){
              id
              
            }
          }
        `
        console.log("creating family...")
        let response = await gfetch("https://parseapi.back4app.com/graphql", creds.headers, createFamilyQuery)
        response = JSON.parse(response)
        console.log(response.data.createFamily.id)
        const familyid =  response.data.createFamily.id
        console.log("Family id: "+familyid)
        const  storeOutput = await storeData("familyID", familyid)
        console.log(storeOutput)
        return familyid
    }


    addMember = async (name="", age="", job="", gender="", docType="", familyID="", primaryContact="", scholarity="", email="", needs="", identificationDocument="") =>{
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
          `
          console.log("Adding member...")
          let response = await gfetch("https://parseapi.back4app.com/graphql", creds.headers, createRefugee)
          response = JSON.parse(response)
          console.log(response.data.createRefugee.id)
          return response.data.createRefugee.id
    }
    
    registrate = async (navigation) => {
        console.log("register")
        const familyid = await this.createFamily()
        console.log("created family")
        this.setState({familyID:familyid})
        const member = await this.addMember(this.state.name, this.state.age, this.state.job, this.state.gender, this.state.docType, familyid, this.state.primaryContact, this.state.scholarity, this.state.email, this.state.needs, this.state.doc)
        
        console.log("Added member")
        this.bindMemberToFamily(familyid, member)
        console.log("binded member to family")
        storeData("isNotPrimaryContact", true)
        navigation.navigate(`RegistrationRefugeeFamily`)

    }

    decideWhichFunctionToUseOnRegisterButton = async () =>{
        
        if(await fetchData("isNotPrimaryContact")){
            this.setState({"primaryContact":false});
            this.addMember(this.state.name, this.state.age, this.state.job, this.state.gender, this.state.docType, this.state.familyid, this.state.primaryContact, this.state.scholarity, this.state.email, this.state.needs, this.state.doc)
            console.log(`additional member`)
        }else{
            this.setState({"primaryContact":true});    
            console.log("primary contact")         
             this.registrate(this.props.navigation)

        }
    }

    state = {
        familyID:"",
        name: "Breno",
        lastName: "Bertone",
        doc: "386731652",
        docType: "RG",
        gender: "Masculino",
        age: "18",
        selectedYear: "2001",
        selectedDay: "26",
        fadeAnim: new Animated.Value(0),
        scrollRef: null,
        isMonthSelectorVisible: false,
        selectedMonth: "February",
    };

    _showDialog = () => this.setState({ isMonthSelectorVisible: true });

    _hideDialog = () => this.setState({ isMonthSelectorVisible: false });

    _selectRadioButton = (value) => this.setState({ checked: value });

    render() {
        const {navigate} = this.props.navigation;
        const SCREEN_WIDTH = Dimensions.get("window").width;
        this.state.scrollRef = React.createRef();

        const { fadeAnim, isMonthSelectorVisible, selectedMonth } = this.state;
        function hideAnimFunc () {
            Animated.spring(
                fadeAnim,
                {
                    toValue: 100,
                },
            ).start();
            console.log(hideAnimPerc);
        };
        function showAnimFunc () {
            Animated.spring(
                fadeAnim,
                {
                    toValue: 0,
                },
            ).start();
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
        return (
            <SafeAreaView
                style={{ backgroundColor: "#FFF" }}
                resetScrollToCoords={{ x: 0, y: 0 }}
                scrollEnabled={false}
                contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between", flexDirection: "column" }}
            >
                <Animated.Image
                    source={require("../../../assets/images/formback.png")}
                    resizeMode="stretch"
                    resizeMethod="auto"
                    style={{
                        width: "100%",
                        height: hp("55%"),
                        position: "absolute",
                        top:  hideAnimPerc
                        //transform: [{translateY: fadeAnim._value}]          
                    }}
                />
                <Animated.View style={{ justifyContent: "flex-start", alignSelf: "center", height: hideAnimPercView}}>
                    <Image
                        resizeMethod="auto"
                        source={require("../../../assets/images/savibranco.png")}
                        resizeMode="contain"
                        style={style.LogoSavi}
                    />
                    <Text style={style.RegFamilyTitle}>Registrar Família</Text>
                    <Text style={style.RegFamilyText} >Todos os membros da familia devem estar no mesmo lugar, se estão em localizações diferentes devem se registrar em celulares diferentes</Text>
                </Animated.View>
                <Animated.ScrollView 
                    style={{height: extendFormView}}
                    horizontal
                    pagingEnabled
                    scrollEnabled={false}
                    showsHorizontalScrollIndicator={false}
                    ref={(c) => {this.scroll = c}}
                    onScroll={Animated.event( [{ nativeEvent: { contentOffset: { x: this.animation, }, }, },], { useNativeDriver: true } )}
                    >
                        <View 
                            style={{ 
                                width: SCREEN_WIDTH, 
                                backgroundColor: "#fff", 
                                height: hp("50%"), 
                                //justifyContent: "space-between" 
                                }} 
                            index={0}
                        >
                            <View style={{
                                width: SCREEN_WIDTH, 
                                backgroundColor: "#fff", 
                                height: hp("10%"),
                                justifyContent: "flex-start" 
                            }}>
                                <Text style={style.RegFamilySubtitle}>Registrar contato principal da Familia</Text>
                            </View>  
                            <View style={{
                                width: SCREEN_WIDTH, 
                                backgroundColor: "#fff", 
                                height: hp("40%"),
                                justifyContent: "flex-end" 
                            }}>
                                <TextInput
                                    style={style.NameInput}
                                    label="Nome"
                                    mode="outlined"
                                    onChangeText={name => this.setState({name:name})}
                                    value={this.state.name}
                                />
                                <TextInput
                                    style={style.LastnameInput}
                                    label="Sobrenome"
                                    mode="outlined"
                                    onChangeText={lastName => this.setState({lastName:lastName})}
                                    value={this.state.lastName}
                                />
                                <View style={{ flexDirection: "row", justifyContent: "space-between"}}>
                                    <Button
                                        mode="text"  
                                        icon="chevron-left"
                                        style={{
                                        //height: hp("6%"),
                                        width: wp("28%"),
                                        marginLeft: wp("5%"),
                                        marginBottom: hp("2%"),
                                        alignSelf:"flex-end",                                    
                                        }}
                                        onPress={() => this.scroll.getNode().scrollTo({x: 0})}
                                    >
                                        <Text style={{ color: "#707070", fontSize: 12 }}>Voltar</Text>
                                    </Button>
                                    <Button
                                        mode="contained"  
                                        style={{
                                        //height: hp("6%"),
                                        width: wp("28%"),
                                        marginRight: wp("5%"),
                                        marginBottom: hp("2%"),
                                        alignSelf:"flex-end"
                                        }}
                                        onPress={() => {this.scroll.getNode().scrollTo({x: SCREEN_WIDTH}), hideAnimFunc()}}
                                    >
                                        <Text style={{ color: "#ffffff", fontSize: 12 }}>Continuar</Text>
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
                            <View style={{
                                width: SCREEN_WIDTH, 
                                backgroundColor: "#fff", 
                                height: hp("10%"),
                                justifyContent: "flex-start" 
                            }}>
                                <Text style={style.RegFamilySubtitle}>Precisamos de mais informações</Text>
                            </View>
                            <View style={{
                                width: SCREEN_WIDTH, 
                                backgroundColor: "#fff", 
                                height: hp("60%"),
                                justifyContent: "flex-end" 
                            }}>
                                <TextInput
                                    style={style.NameInput}
                                    label="Documento de Identidade"
                                    mode="outlined"
                                    onChangeText={doc => this.setState({doc:doc})}
                                    value={this.state.doc}
                                />
                                <TextInput
                                    style={style.TextInput}
                                    label="Tipo de Documento de Identidade"
                                    mode="outlined"
                                    onChangeText={docType => this.setState({docType:docType})}
                                    value={this.state.docType}
                                />
                                <View style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    marginLeft: wp("5%"),
                                    marginRight: wp("5%"),
                                    marginBottom: hp("2%")
                                }}>
                                    <TextInput
                                        style={style.DayInput}
                                        label="Dia"
                                        mode="outlined"
                                        onChangeText={selectedDay => this.setState({selectedDay:selectedDay})}
                                        value={this.state.selectedDay}
                                    />
                                    <TouchableOpacity
                                        onPress={this._showDialog}
                                    >
                                        <TextInput
                                            style={style.MonthInput}
                                            label="Mês"
                                            mode="outlined"
                                            editable={false}
                                            disabled={true}
                                            //onFocus={ Keyboard.dismiss(), this._showDialog}
                                            value={selectedMonth}
                                            theme={{ colors: {
                                                disabled: "#707070",
                                                placeholder: "#000"
                                            }}}
                                        />
                                    </TouchableOpacity>
                                    <Portal>
                                        <Dialog
                                            visible={isMonthSelectorVisible}
                                            onDismiss={this._hideDialog}
                                            style={{height: hp("50%")}}
                                        >    
                                            <Dialog.Title>Mês</Dialog.Title>
                                                <Dialog.ScrollArea>
                                                    <ScrollView >
                                                        <List.Item
                                                            title="Janeiro"
                                                            onPress={() => this.setState({ selectedMonth: "Janeiro"})}
                                                            style={selectedMonth=="Janeiro"?{backgroundColor: "#ccc"}:{backgroundColor: "#FFF"}}
                                                        />
                                                        <List.Item
                                                            title="Fevereiro"
                                                            onPress={() => this.setState({ selectedMonth: "Fevereiro"})}
                                                            style={selectedMonth=="Fevereiro"?{backgroundColor: "#ccc"}:{backgroundColor: "#FFF"}}
                                                        />
                                                        <List.Item
                                                            title="Março"
                                                            onPress={() => this.setState({ selectedMonth: "Março"})}
                                                            style={selectedMonth=="Março"?{backgroundColor: "#ccc"}:{backgroundColor: "#FFF"}}
                                                        />
                                                        <List.Item
                                                            title="Abril"
                                                            onPress={() => this.setState({ selectedMonth: "Abril"})}
                                                            style={selectedMonth=="Abril"?{backgroundColor: "#ccc"}:{backgroundColor: "#FFF"}}
                                                        />
                                                        <List.Item
                                                            title="Maio"
                                                            onPress={() => this.setState({ selectedMonth: "Maio"})}
                                                            style={selectedMonth=="Maio"?{backgroundColor: "#ccc"}:{backgroundColor: "#FFF"}}
                                                        />
                                                        <List.Item
                                                            title="Junho"
                                                            onPress={() => this.setState({ selectedMonth: "Junho"})}
                                                            style={selectedMonth=="Junho"?{backgroundColor: "#ccc"}:{backgroundColor: "#FFF"}}
                                                        />
                                                        <List.Item
                                                            title="Julho"
                                                            onPress={() => this.setState({ selectedMonth: "Julho"})}
                                                            style={selectedMonth=="Julho"?{backgroundColor: "#ccc"}:{backgroundColor: "#FFF"}}
                                                        />
                                                        <List.Item
                                                            title="Agosto"
                                                            onPress={() => this.setState({ selectedMonth: "Agosto"})}
                                                            style={selectedMonth=="Agosto"?{backgroundColor: "#ccc"}:{backgroundColor: "#FFF"}}
                                                        />
                                                        <List.Item
                                                            title="Setembro"
                                                            onPress={() => this.setState({ selectedMonth: "Setembro"})}
                                                            style={selectedMonth=="Setembro"?{backgroundColor: "#ccc"}:{backgroundColor: "#FFF"}}
                                                        />
                                                        <List.Item
                                                            title="Outubro"
                                                            onPress={() => this.setState({ selectedMonth: "Outubro"})}
                                                            style={selectedMonth=="Outubro"?{backgroundColor: "#ccc"}:{backgroundColor: "#FFF"}}
                                                        />
                                                        <List.Item
                                                            title="Novembro"
                                                            onPress={() => this.setState({ selectedMonth: "Novembro"})}
                                                            style={selectedMonth=="Novembro"?{backgroundColor: "#ccc"}:{backgroundColor: "#FFF"}}
                                                        />
                                                        <List.Item
                                                            title="Dezembro"
                                                            onPress={() => this.setState({ selectedMonth: "Dezembro"})}
                                                            style={selectedMonth=="Dezembro"?{backgroundColor: "#ccc"}:{backgroundColor: "#FFF"}}
                                                        />
                                                    </ScrollView>
                                                </Dialog.ScrollArea>
                                            <Dialog.Actions>
                                                <Button onPress={this._hideDialog}>Ok</Button>
                                            </Dialog.Actions>
                                        </Dialog>
                                    </Portal>
                                    <TextInput
                                        style={style.YearInput}
                                        label="Ano"
                                        mode="outlined"
                                        value={this.state.selectedYear}
                                    />
                                </View>
                                    <TouchableOpacity
                                            //onPress={this._showDialog}
                                    >        
                                        <TextInput
                                            value={this.state.gender}
                                            style={style.LastnameInput}                                            label="Mês"
                                            mode="outlined"
                                            editable={false}
                                            disabled={true}
                                            label="Gênero"
                                            //onFocus={ Keyboard.dismiss(), this._showDialog}
                                            theme={{ colors: {
                                                disabled: "#707070",
                                                placeholder: "#000"
                                            }}}
                                        />
                                    </TouchableOpacity>
                                <View style={{ flexDirection: "row", justifyContent: "space-between"}}>
                                    <Button
                                        mode="text"  
                                        icon="chevron-left"
                                        style={{
                                        //height: hp("6%"),
                                        width: wp("28%"),
                                        marginLeft: wp("5%"),
                                        marginBottom: hp("2%"),
                                        alignSelf:"flex-end",                                    
                                        }}
                                        onPress={() => {this.scroll.getNode().scrollTo({x: 0}), showAnimFunc()}}
                                    >
                                        <Text style={{ color: "#707070", fontSize: 12 }}>Voltar</Text>
                                    </Button>
                                    <Button
                                        mode="contained"  
                                        style={{
                                        //height: hp("6%"),
                                        width: wp("28%"),
                                        marginRight: wp("5%"),
                                        marginBottom: hp("2%"),
                                        alignSelf:"flex-end"
                                        }}
                                        onPress={() => this.scroll.getNode().scrollTo({x: SCREEN_WIDTH*2})}
                                    >
                                        <Text style={{ color: "#ffffff", fontSize: 12 }}>Continuar</Text>
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
                            <View style={{
                                width: SCREEN_WIDTH, 
                                backgroundColor: "#fff", 
                                height: hp("10%"),
                                justifyContent: "flex-start" 
                            }}>
                                <Text style={style.RegFamilySubtitle}>Só mais algumas coisinhas</Text>
                            </View>
                            <View style={{
                                width: SCREEN_WIDTH, 
                                backgroundColor: "#fff", 
                                height: hp("60%"),
                                justifyContent: "flex-end" 
                            }}>
                                <TextInput
                                    style={style.NameInput}
                                    label="Data de Nascimento"
                                    mode="outlined"
                                />
                                <TextInput
                                    style={style.LastnameInput}
                                    label="Genero"
                                    mode="outlined"
                                />
                                <View style={{ flexDirection: "row", justifyContent: "space-between"}}>
                                    <Button
                                        mode="text"  
                                        icon="chevron-left"
                                        style={{
                                        //height: hp("6%"),
                                        width: wp("28%"),
                                        marginLeft: wp("5%"),
                                        marginBottom: hp("2%"),
                                        alignSelf:"flex-end",                                    
                                        }}
                                        onPress={() => this.scroll.getNode().scrollTo({x: SCREEN_WIDTH})}
                                    >
                                        <Text style={{ color: "#707070", fontSize: 12 }}>Voltar</Text>
                                    </Button>
                                    <Button
                                        mode="contained"  
                                        style={{
                                        //height: hp("6%"),
                                        width: wp("28%"),
                                        marginRight: wp("5%"),
                                        marginBottom: hp("2%"),
                                        alignSelf:"flex-end"
                                        }}
                                        onPress={() => this.decideWhichFunctionToUseOnRegisterButton()}
                                    >
                                        <Text style={{ color: "#ffffff", fontSize: 12 }}>Continuar</Text>
                                    </Button>
                                </View>
                            </View>
                        </Animated.View>  
                </Animated.ScrollView>
            </SafeAreaView>
        )
    }
}

const style = StyleSheet.create({
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
        marginTop: hp("4%"),
      },
      LastnameInput: { 
        marginLeft: wp("5%"),
        marginRight: wp("5%"),
        marginBottom: hp("7%")
      },
      TextInput: {
        marginLeft: wp("5%"),
        marginRight: wp("5%"),
        marginBottom: hp("2%"),
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
        marginRight: wp("3%"),
      },
      YearInput: {
        width: wp("28%"),
      },
      RegFamilyTitle: { 
        fontSize: RFPercentage(4),
        //marginLeft: wp("5%"),
        marginTop: hp("2%"),
        fontWeight: "bold",
        alignSelf: "center",
        color: "#FFF",
        marginBottom: hp("1%"),
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
    },
});