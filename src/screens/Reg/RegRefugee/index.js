import React, { Component } from 'react';
import { View, Image, StyleSheet, ScrollView, Animated, Text, Dimensions, Keyboard, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Button, TextInput, Portal, Dialog, List } from 'react-native-paper';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { TouchableHighlight } from 'react-native-gesture-handler';
// import { Container } from './styles';

export default class index extends Component {
    registrate = () => {
        fetch(`https://parseapi.back4app.com/graphql",{"credentials":"omit","headers":{"accept":"*/*","accept-language":"pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7","content-type":"application/json","sec-fetch-mode":"cors","sec-fetch-site":"same-site","x-parse-application-id":"47RAnYvxm7rWLUTUZYHt9SItJjd9FnmWj5ZK5g92","x-parse-client-key":"WLyCpihyllj8cxhhuVZk9b15JkbMeSt5q2IURgAW","x-parse-master-key":"32qb1Of9n8jESGsr3TESg9RUAxJTrZbpGVVKIk3v"},"referrer":"https://parse-dashboard.back4app.com/apps/2e02d985-4038-4b1e-91e7-09d9e451c149/api_console/graphql","referrerPolicy":"no-referrer-when-downgrade","body":"{\"operationName\":null,\"variables\":{},\"query\":\"mutation {\\n  createRefugee(fields: {name: \\\"${this.state.firstName}\\\", age: \\\"${this.state.age}\\\", job: \\\"${this.state.job}\\\", gender: \\\"${this.state.selectedGender}\\\", identificationDocumentType: \\\"${this.state.docType}\\\", familyID: 1, primaryContact: true, scholarity: \\\"${this.state.scholarity}\\\", email: \\\"${this.state.email}\\\", needs: \\\"${this.state.needs}\\\", identificationDocument: \\\"${this.state.doc}\\\"}) {\\n    name\\n  }\\n}\\n\"}","method":"POST","mode":"cors"});
        navigate("RegistrationRefugeeFamily`)
    }
    state = {
        firstName:'',
        lastName:'',
        docType: '',
        doc: '',
        selectedGender:'',
        age:'',
        selectedYear:'',
        selectedDay:'',
        fadeAnim: new Animated.Value(0),
        scrollRef: null,
        isMonthSelectorVisible: false,
        selectedMonth: '',
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
            outputRange: [hp('-10%'), hp('-30%')]
        }); 
        const hideAnimPercView = fadeAnim.interpolate({
            inputRange: [0, 100],
            outputRange: [hp('45%'), hp('25%')]
        }); 
        const extendFormView = fadeAnim.interpolate({
            inputRange: [0, 100],
            outputRange: [hp('50%'), hp('70%')]
        }); 
        return (
            <KeyboardAwareScrollView
                style={{ backgroundColor: "#FFF" }}
                resetScrollToCoords={{ x: 0, y: 0 }}
                scrollEnabled={false}
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between', flexDirection: 'column' }}
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
                <Animated.View style={{ justifyContent: 'flex-start', alignSelf: 'center', height: hideAnimPercView}}>
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
                                backgroundColor: '#fff', 
                                height: hp("50%"), 
                                //justifyContent: 'space-between' 
                                }} 
                            index={0}
                        >
                            <View style={{
                                width: SCREEN_WIDTH, 
                                backgroundColor: '#fff', 
                                height: hp("10%"),
                                justifyContent: 'flex-start' 
                            }}>
                                <Text style={style.RegFamilySubtitle}>Registrar contato principal da Familia</Text>
                            </View>  
                            <View style={{
                                width: SCREEN_WIDTH, 
                                backgroundColor: '#fff', 
                                height: hp("40%"),
                                justifyContent: 'flex-end' 
                            }}>
                                <TextInput
                                    style={style.NameInput}
                                    label='Nome'
                                    mode='outlined'
                                    onChangeText={firstName => this.setState({firstName:firstName})}
                                    value={this.state.firstName}
                                />
                                <TextInput
                                    style={style.LastnameInput}
                                    label='Sobrenome'
                                    mode='outlined'
                                    onChangeText={lastName => this.setState({lastName:lastName})}
                                    value={this.state.lastName}
                                />
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <Button
                                        mode="text"  
                                        icon="chevron-left"
                                        style={{
                                        //height: hp('6%'),
                                        width: wp("28%"),
                                        marginLeft: wp("5%"),
                                        marginBottom: hp("2%"),
                                        alignSelf:'flex-end',                                    
                                        }}
                                        onPress={() => this.scroll.getNode().scrollTo({x: 0})}
                                    >
                                        <Text style={{ color: '#707070', fontSize: 12 }}>Voltar</Text>
                                    </Button>
                                    <Button
                                        mode="contained"  
                                        style={{
                                        //height: hp('6%'),
                                        width: wp("28%"),
                                        marginRight: wp("5%"),
                                        marginBottom: hp("2%"),
                                        alignSelf:'flex-end'
                                        }}
                                        onPress={() => {this.scroll.getNode().scrollTo({x: SCREEN_WIDTH}), hideAnimFunc()}}
                                    >
                                        <Text style={{ color: '#ffffff', fontSize: 12 }}>Continuar</Text>
                                    </Button>
                                </View>
                            </View>
                        </View>
                        <Animated.View 
                            style={{ 
                                width: SCREEN_WIDTH, 
                                backgroundColor: '#fff', 
                                height: extendFormView, 
                                justifyContent: 'flex-end' 
                                }} 
                            index={1}
                        >
                            <View style={{
                                width: SCREEN_WIDTH, 
                                backgroundColor: '#fff', 
                                height: hp("10%"),
                                justifyContent: 'flex-start' 
                            }}>
                                <Text style={style.RegFamilySubtitle}>Precisamos de mais informações</Text>
                            </View>
                            <View style={{
                                width: SCREEN_WIDTH, 
                                backgroundColor: '#fff', 
                                height: hp("60%"),
                                justifyContent: 'flex-end' 
                            }}>
                                <TextInput
                                    style={style.NameInput}
                                    label='Documento de Identidade'
                                    mode='outlined'
                                    onChangeText={doc => this.setState({doc:doc})}
                                    value={this.state.doc}
                                />
                                <TextInput
                                    style={style.TextInput}
                                    label='Tipo de Documento de Identidade'
                                    mode='outlined'
                                    onChangeText={docType => this.setState({docType:docType})}
                                    value={this.state.docType}
                                />
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginLeft: wp("5%"),
                                    marginRight: wp("5%"),
                                    marginBottom: hp("2%")
                                }}>
                                    <TextInput
                                        style={style.DayInput}
                                        label='Dia'
                                        mode='outlined'
                                        onChangeText={selectedDay => this.setState({selectedDay:selectedDay})}
                                        value={this.state.selectedDay}
                                    />
                                    <TouchableOpacity
                                        onPress={this._showDialog}
                                    >
                                        <TextInput
                                            style={style.MonthInput}
                                            label='Mês'
                                            mode='outlined'
                                            editable={false}
                                            disabled={true}
                                            //onFocus={ Keyboard.dismiss(), this._showDialog}
                                            value={selectedMonth}
                                            theme={{ colors: {
                                                disabled: '#707070',
                                                placeholder: '#000'
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
                                                            onPress={() => this.setState({ selectedMonth: 'Janeiro'})}
                                                            style={selectedMonth=='Janeiro'?{backgroundColor: '#ccc'}:{backgroundColor: '#FFF'}}
                                                        />
                                                        <List.Item
                                                            title="Fevereiro"
                                                            onPress={() => this.setState({ selectedMonth: 'Fevereiro'})}
                                                            style={selectedMonth=='Fevereiro'?{backgroundColor: '#ccc'}:{backgroundColor: '#FFF'}}
                                                        />
                                                        <List.Item
                                                            title="Março"
                                                            onPress={() => this.setState({ selectedMonth: 'Março'})}
                                                            style={selectedMonth=='Março'?{backgroundColor: '#ccc'}:{backgroundColor: '#FFF'}}
                                                        />
                                                        <List.Item
                                                            title="Abril"
                                                            onPress={() => this.setState({ selectedMonth: 'Abril'})}
                                                            style={selectedMonth=='Abril'?{backgroundColor: '#ccc'}:{backgroundColor: '#FFF'}}
                                                        />
                                                        <List.Item
                                                            title="Maio"
                                                            onPress={() => this.setState({ selectedMonth: 'Maio'})}
                                                            style={selectedMonth=='Maio'?{backgroundColor: '#ccc'}:{backgroundColor: '#FFF'}}
                                                        />
                                                        <List.Item
                                                            title="Junho"
                                                            onPress={() => this.setState({ selectedMonth: 'Junho'})}
                                                            style={selectedMonth=='Junho'?{backgroundColor: '#ccc'}:{backgroundColor: '#FFF'}}
                                                        />
                                                        <List.Item
                                                            title="Julho"
                                                            onPress={() => this.setState({ selectedMonth: 'Julho'})}
                                                            style={selectedMonth=='Julho'?{backgroundColor: '#ccc'}:{backgroundColor: '#FFF'}}
                                                        />
                                                        <List.Item
                                                            title="Agosto"
                                                            onPress={() => this.setState({ selectedMonth: 'Agosto'})}
                                                            style={selectedMonth=='Agosto'?{backgroundColor: '#ccc'}:{backgroundColor: '#FFF'}}
                                                        />
                                                        <List.Item
                                                            title="Setembro"
                                                            onPress={() => this.setState({ selectedMonth: 'Setembro'})}
                                                            style={selectedMonth=='Setembro'?{backgroundColor: '#ccc'}:{backgroundColor: '#FFF'}}
                                                        />
                                                        <List.Item
                                                            title="Outubro"
                                                            onPress={() => this.setState({ selectedMonth: 'Outubro'})}
                                                            style={selectedMonth=='Outubro'?{backgroundColor: '#ccc'}:{backgroundColor: '#FFF'}}
                                                        />
                                                        <List.Item
                                                            title="Novembro"
                                                            onPress={() => this.setState({ selectedMonth: 'Novembro'})}
                                                            style={selectedMonth=='Novembro'?{backgroundColor: '#ccc'}:{backgroundColor: '#FFF'}}
                                                        />
                                                        <List.Item
                                                            title="Dezembro"
                                                            onPress={() => this.setState({ selectedMonth: 'Dezembro'})}
                                                            style={selectedMonth=='Dezembro'?{backgroundColor: '#ccc'}:{backgroundColor: '#FFF'}}
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
                                        label='Ano'
                                        mode='outlined'
                                    />
                                </View>
                                    <TouchableOpacity
                                            //onPress={this._showDialog}
                                    >        
                                        <TextInput
                                            style={style.LastnameInput}                                            label='Mês'
                                            mode='outlined'
                                            editable={false}
                                            disabled={true}
                                            label='Gênero'
                                            //onFocus={ Keyboard.dismiss(), this._showDialog}
                                            theme={{ colors: {
                                                disabled: '#707070',
                                                placeholder: '#000'
                                            }}}
                                        />
                                    </TouchableOpacity>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <Button
                                        mode="text"  
                                        icon="chevron-left"
                                        style={{
                                        //height: hp('6%'),
                                        width: wp("28%"),
                                        marginLeft: wp("5%"),
                                        marginBottom: hp("2%"),
                                        alignSelf:'flex-end',                                    
                                        }}
                                        onPress={() => {this.scroll.getNode().scrollTo({x: 0}), showAnimFunc()}}
                                    >
                                        <Text style={{ color: '#707070', fontSize: 12 }}>Voltar</Text>
                                    </Button>
                                    <Button
                                        mode="contained"  
                                        style={{
                                        //height: hp('6%'),
                                        width: wp("28%"),
                                        marginRight: wp("5%"),
                                        marginBottom: hp("2%"),
                                        alignSelf:'flex-end'
                                        }}
                                        onPress={() => this.scroll.getNode().scrollTo({x: SCREEN_WIDTH*2})}
                                    >
                                        <Text style={{ color: '#ffffff', fontSize: 12 }}>Continuar</Text>
                                    </Button>
                                </View>
                            </View>
                        </Animated.View>
                        <Animated.View 
                            style={{ 
                                width: SCREEN_WIDTH, 
                                backgroundColor: '#fff', 
                                height: extendFormView, 
                                justifyContent: 'flex-end' 
                                }} 
                            index={2}
                        >
                            <View style={{
                                width: SCREEN_WIDTH, 
                                backgroundColor: '#fff', 
                                height: hp("10%"),
                                justifyContent: 'flex-start' 
                            }}>
                                <Text style={style.RegFamilySubtitle}>Só mais algumas coisinhas</Text>
                            </View>
                            <View style={{
                                width: SCREEN_WIDTH, 
                                backgroundColor: '#fff', 
                                height: hp("60%"),
                                justifyContent: 'flex-end' 
                            }}>
                                <TextInput
                                    style={style.NameInput}
                                    label='Data de Nascimento'
                                    mode='outlined'
                                />
                                <TextInput
                                    style={style.LastnameInput}
                                    label='Genero'
                                    mode='outlined'
                                />
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <Button
                                        mode="text"  
                                        icon="chevron-left"
                                        style={{
                                        //height: hp('6%'),
                                        width: wp("28%"),
                                        marginLeft: wp("5%"),
                                        marginBottom: hp("2%"),
                                        alignSelf:'flex-end',                                    
                                        }}
                                        onPress={() => this.scroll.getNode().scrollTo({x: SCREEN_WIDTH})}
                                    >
                                        <Text style={{ color: '#707070', fontSize: 12 }}>Voltar</Text>
                                    </Button>
                                    <Button
                                        mode="contained"  
                                        style={{
                                        //height: hp('6%'),
                                        width: wp("28%"),
                                        marginRight: wp("5%"),
                                        marginBottom: hp("2%"),
                                        alignSelf:'flex-end'
                                        }}
                                        onPress={registrate()}
                                    >
                                        <Text style={{ color: '#ffffff', fontSize: 12 }}>Continuar</Text>
                                    </Button>
                                </View>
                            </View>
                        </Animated.View>  
                </Animated.ScrollView>
            </KeyboardAwareScrollView>
        )
    }
}

const style = StyleSheet.create({
    LogoSavi: {
        width: wp("70%"),
        height: hp("10%"),
        marginTop: hp("5%"),
        alignSelf: 'center'
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
        alignSelf: 'center',
        color: '#000',
        textAlign: 'center',
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
        alignSelf: 'center',
        color: '#FFF',
        marginBottom: hp('1%'),
    },
    RegFamilyText: {
        fontSize: RFPercentage(2.2), 
        alignSelf: "center",
        marginLeft: wp("10%"),
        marginRight: wp("10%"),
        marginTop: hp("5%"),
        color: '#FFF',
        textAlign: 'center',
        marginBottom: hp('3%')
    },
});fetch("https://parseapi.back4app.com/graphql", {"credentials":"omit","headers":{"accept":"*/*","accept-language":"pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7","content-type":"application/json","sec-fetch-mode":"cors","sec-fetch-site":"same-site","x-parse-application-id":"47RAnYvxm7rWLUTUZYHt9SItJjd9FnmWj5ZK5g92","x-parse-client-key":"WLyCpihyllj8cxhhuVZk9b15JkbMeSt5q2IURgAW","x-parse-master-key":"32qb1Of9n8jESGsr3TESg9RUAxJTrZbpGVVKIk3v"},"referrer":"https://parse-dashboard.back4app.com/apps/2e02d985-4038-4b1e-91e7-09d9e451c149/api_console/graphql","referrerPolicy":"no-referrer-when-downgrade","body":"{\"operationName\":null,\"variables\":{},\"query\":\"mutation {\\n  createRefugee(fields: {name: \\\"Teste\\\", age: \\\"21\\\", job: \\\"motorista de uber\\\", gender: \\\"masculino\\\", identificationDocumentType: \\\"teste\\\", familyID: 1, primaryContact: true, scholarity: \\\"ensino teste completo\\\", email: \\\"teste@teste.com\\\", needs: \\\"comida e teste\\\", identificationDocument: \\\"436696134776\\\"}) {\\n    name\\n  }\\n}\\n\"}","method":"POST","mode":"cors"});