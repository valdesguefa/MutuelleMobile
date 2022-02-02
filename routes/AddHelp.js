import { View, Platform, Dimensions, StyleSheet, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from '@mdi/react'
import { mdiAccount } from '@mdi/js'
import * as ImagePicker from "expo-image-picker";
//import { Icon } from 'react-native-vector-icons/icon';
import { TextInput } from "react-native-paper";

import Input from "../screens/adminScreens/Input"
import Constants from 'expo-constants';
import axios from "axios";
import React, { useEffect, useState, useRef, useContext } from "react";
import * as Animatable from "react-native-animatable";

// You can import from local files
//import DropDownPicker from 'react-native-dropdown-picker'
import ModalDropdown from '@monchilin/react-native-dropdown';
import headerObj from "../shared/token";
import URL from "../shared/URL";
import { AuthContext } from "../contexts/AuthContext";
import Button from '../screens/adminScreens/Button';

export const AddHelp = () => {
    const [date, setDate] = useState(new Date(1598051730000));
    const [idHelp, setidHelp] = useState(0);
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [helpTypeTitle, sethelpTypeTitle] = useState({});
    const [concern, setconcern] = useState({});
    const [limitDate, setlimitDate] = useState("");
    const [comment, setcomment] = useState("");
    const [helpType, sethelpType] = useState([]);
    const [users, setusers] = useState([]);
    const [members, setmembers] = useState([]);
    const { auth, dispatch } = useContext(AuthContext);

    //loadingSubmit
    const [loadingSubmit, setloadingSubmit] = useState(false);
    useEffect(() => {
        axios
            .get(URL + `help_types/`, headerObj)
            .then((response) => {
                var val = [];
                // console.log('donner recu',response.data)
                for (let obj of response.data) {
                    val.push(obj);
                }
                //console.log('donner recu',val)
                sethelpType(val);
            })
            .catch((error) => {
                console.log("voici l'erreur", error);
            });

        axios
            .get(URL + `users/`, headerObj)
            .then((response) => {
                var val1 = [];
                // console.log('donner recu',response.data)
                for (let obj of response.data) {
                    val1.push(obj);
                }
                //console.log('donner recu',val)
                setusers(val1);
            })
            .catch((error) => {
                console.log("voici l'erreur", error);
            });

        axios
            .get(URL + `members/`, headerObj)
            .then((response) => {
                var val2 = [];
                // console.log('donner recu',response.data)
                for (let obj of response.data) {
                    val2.push(obj);
                }
                //console.log('donner recu',val)
                setmembers(val2);
            })
            .catch((error) => {
                console.log("voici l'erreur", error);
            });
    }, []);

    const getNameMember = (membeId) => {
        // if (saving) {
        var us = { name: '', avatar: '' }
        var name = ''
        var userId = ''
        for (let obj1 of members) {

            if (membeId === obj1['id']) {

                for (let obj2 of users) {
                    if (obj1['user_id'] === obj2['id']) {
                        us.name = obj2['name'] + " " + obj2['first_name']
                        us.avatar = obj2['avatar']
                    }
                }

                //  console.log('************************obj*********************', inter)
                // obj.name = inter

            }

        }
        // console.log('************************obj*********************', us)
        return us
    }

    useEffect(() => {
        console.log('sjkdjskjdskjdslkjfaskdjnfla', helpTypeTitle)
    }, [helpTypeTitle, concern, limitDate, comment])


    const handleSubmit = () => {
        /*
            console.log('kjhbkjhbk',{
            help_type_id: helpTypeTitle.id,
            amount: helpTypeTitle.amount,
            limit_date: limitDate,
            unit_amount: helpTypeTitle.amount / (members.length - 1),
            comments: comment,
            state: 1,
            member_id: concern["id"],
            administrator_id: auth.user.id,
        })
        */
        console.log('admin inf', auth.user)
        axios
            .post(
                URL + `helps/`,
                {
                    help_type_id: helpTypeTitle.id,
                    amount: helpTypeTitle.amount,
                    limit_date: limitDate,
                    unit_amount: helpTypeTitle.amount / (members.length - 1),
                    comments: comment,
                    state: 1,
                    member_id: concern["id"],
                    administrator_id: 1
                },
                headerObj
            )
            .then((response) => {

                setidHelp(response.data.id)

                for (let obj6 of members.filter(item => item.id !== concern["id"])) {
                    console.log('admin inf', auth.user)
                    axios
                        .post(
                            URL + `contributions/`,
                            {
                                help_id: idHelp,
                                date: limitDate, comments: comment,
                                state: 0,
                                member_id: obj6['id'],
                                administrator_id: 1
                            },
                            headerObj
                        )
                }
            }).then((response1) => {
                alert('ajout effectue avec succes')
            }).catch(error => {
                console.log("voici l'erreur", error)
            })
    }

    const onChange = (event, selectedDate) => {

        // console.log('klskdlskdljkjks',selectedDate)
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
        const date = new Date(`${currentDate}`)
        // console.log('lsahldlakjsdlfkjal',date.toDateString())
        // console.log('klskdlskdljkjks',selectedDate)
        setlimitDate(`${date.toDateString()}`)

    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const showTimepicker = () => {
        showMode('time');
    };

    return (
        <View style={{ alignSelf: 'center' }}>
            <View style={{ marginTop: 30 }}>
                <View style={{ flexDirection: 'column', paddingTop: 0, marginVertical: 40, }}>
                    <ModalDropdown
                        onSelect={(index, item) => sethelpTypeTitle(item)}
                        dataSource={helpType}

                        style={{
                            borderColor: "#000",
                            borderWidth: 1,
                            borderRadius: 10,
                            with: 50,
                            marginTop: -5,
                            paddingBottom: 10,
                        }}
                        index={0}
                        renderItem={(item) => <View style={{ height: 40, width: Dimensions.get('window').width * 0.84, borderWidth: 0.5, borderRadius: 5 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text>  <Text>{item.title}</Text> - <Text>{item.amount}</Text> </Text>
                            </View>
                        </View>}>

                        <View style={{
                            flexDirection: "column",
                            borderColor: "#000",
                            borderWidth: 1,
                            borderRadius: 10,
                            width: Dimensions.get('window').width * 0.81,
                            paddingBottom: 10,
                            height: 50, marginBottom: -25
                        }} >
                            {
                                helpTypeTitle.hasOwnProperty('id') ? <Text style={{ marginLeft: Dimensions.get('window').width * 0.1, marginTop: 15 }}>{helpTypeTitle.title} - {helpTypeTitle.amount}</Text>
                                    :
                                    <Text style={{ marginLeft: Dimensions.get('window').width * 0.3, marginTop: 15 }}>Type d'aide</Text>

                            }
                        </View>

                    </ModalDropdown>
                </View>

                <View style={{ flexDirection: 'column', paddingTop: 0, marginVertical: 5, }}>
                    <ModalDropdown
                        onSelect={(index, item) => setconcern(item)}
                        dataSource={members}

                        style={{
                            borderColor: "#000",
                            borderWidth: 1,
                            borderRadius: 10,
                            with: 50,
                            marginTop: -5,
                            paddingBottom: 10,
                        }}
                        index={0}
                        renderItem={(item) => <View style={{ height: 40, width: Dimensions.get('window').width * 0.84, borderWidth: 0.5, borderRadius: 5 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text> {getNameMember(item.id).name} </Text>
                            </View>
                        </View>}>

                        <View style={{
                            flexDirection: "column",
                            borderColor: "#000",
                            borderWidth: 1,
                            borderRadius: 10,
                            width: Dimensions.get('window').width * 0.81,
                            paddingBottom: 10,
                            height: 50, marginBottom: 10
                        }} >
                            {
                                concern.hasOwnProperty('id') ? <Text style={{ marginLeft: Dimensions.get('window').width * 0.25, marginTop: 15 }}>{getNameMember(concern.id).name}</Text>
                                    :
                                    <Text style={{ marginLeft: Dimensions.get('window').width * 0.17, marginTop: 15 }}>Membre concerne par l'aide</Text>

                            }
                        </View>

                    </ModalDropdown>
                </View>



                <View style={{
                    flexDirection: "row",
                    borderColor: "#000",
                    paddingBottom: 10,
                    height: 85, marginBottom: -15
                }}>
                    <Input
                        style={{ height: 40, marginBottom: 10 }}
                        label='Date limite Contribution'
                        right={
                            <TextInput.Icon
                                onPress={() => showDatepicker()}
                                name={"calendar"}
                            />
                        }
                        value={`${limitDate}`}
                    />
                </View>


                <View style={{
                    flexDirection: "row",
                    borderColor: "#000",
                    paddingBottom: 10,
                    height: 90
                }}>
                    <Input
                        style={{ height: 60, borderColor: 'black', }}
                        multiline={true}
                        autoCorrect={true}
                        label="Commentaires a propos de l'aide"
                        value={comment}
                        onChangeText={text => setcomment(text)}
                    />
                </View>


                {
                    show && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode={mode}
                            is24Hour={true}
                            display="default"
                            onChange={onChange}
                        />
                    )
                }
                {/*
            <DropDownPicker
                items={[
                    { label: 'English', value: 'en' },
                    { label: 'Deutsch', value: 'de' },
                    { label: 'French', value: 'fr' },
                ]}
                defaultIndex={0}
                containerStyle={{ height: 30 }}
                onChangeItem={item => console.log(item.label, item.value)}
            />
            */}
            </View>


            <Animatable.View animation="bounceIn" duration={3500}>
                <Button
                    onPress={() => handleSubmit()}
                    labelIcon="pencil"
                    label="Ajouter"
                    style={styles.button}
                    loading={loadingSubmit}
                />
            </Animatable.View>

        </View >
    );
};
const styles = {
    button: {
        backgroundColor: "#FE7C00",
    },
    passwordContainer: {
        flexDirection: "row",
        borderColor: "#000",
        paddingBottom: 10,
    },
}
const styles2 = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#ecf0f1',
        padding: 8,
    },
    paragraph: {
        margin: 24,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
