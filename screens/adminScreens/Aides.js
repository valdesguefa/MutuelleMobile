import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import headerObj from "../../shared/token";
import URL from "../../shared/URL";
import CarouselHelp from "./CarouselHelp";
import * as Font from "expo-font";
import { Dimensions } from 'react-native';
import { AuthContext } from "../../contexts/AuthContext";
import { Avatar, Icon, ListItem } from "react-native-elements";

const Aides = ({navigation}) => {
    const [activeHelp, setactiveHelp] = useState([])
    const [NoactiveHelp, setNoactiveHelp] = useState([])
    const [members, setmembers] = useState([])
    const [users, setusers] = useState([])
    const [Admin, setAdmin] = useState([])
    const [helpType, sethelpType] = useState([])
    const [fontsLoaded, setfontsLoaded] = useState(false)
    const [temporel1, settemporel1] = useState([])
    const [temporel2, settemporel2] = useState([])
    const { auth, dispatch } = useContext(AuthContext);
	const [permissions, setPermissions] = useState(auth.permissions);

    async function loadFonts() {
        await Font.loadAsync({
            poppinsBold: require('../.././assets/fonts/Poppins-Medium.otf'),

        });
        setfontsLoaded(true);
    }

    useEffect(() => {
        loadFonts();
    }, [])
/*
    useEffect(() => {
        //console.log('bonsoir')
        axios.get(URL + `administrators/`, headerObj).then((response) => {
            var val = []
            for (let temp of response.data) {

                val.push(temp)
            }
            // console.log('------voici les admins-----', val)
            setAdmin(val)

        }).catch(error => {
            console.log("voici l'erreur", error)
        })
    }, [])
*/

    useEffect(() => {
        axios.get(URL + `helps/`, headerObj).then((response) => {
            var val1 = []
            var val2 = []
            // console.log('donner recu',response.data)
            for (let obj of response.data) {
                if (obj['state'] === 1) {
                    // setactiveHelp(obj)
                    val1.push(obj)

                    // console.log('activeHelp',activeHelp)
                }
                else {
                    // setNoactiveHelp(obj)
                    val2.push(obj)
                    //  setNoactiveHelp(val2)
                }

            }
            //console.log('val1',val1)
            setactiveHelp(val1)
            setNoactiveHelp(val2)
            //  console.log('activeHelp',activeHelp)

        }).catch(error => console.log(error))

    }, [])

    /*

    const loadId2 = (help) => {
        var tempo = []
        var objtempo = {}
        var val = []
        settemporel2([])
        for (let obj of help) {
            objtempo = obj
            var name = ''
            var objtempo2 = {}
            var objtempo3 = {}
            var help_type = ''
            var administrator = ''
            var objtempo1 = ''
            for (let obj3 of helpType) {

                if (obj.help_type_id === obj3.url) {
                    help_type = obj3.title
                    objtempo1 = { ...objtempo, 'help_type_name': help_type }
                    // console.log('objtempo', objtempo1)

                }
            }

            for (let obj1 of members) {
                // console.log('bonjour')
                if (obj.member_id === obj1.url) {
                    axios.get(obj1.user_id, headerObj).then(response => {
                        name = response.data['name'] + " " + response.data['first_name']
                        objtempo2 = { ...objtempo1, 'member_name': name }
                        // console.log('objtempo2',objtempo2)
                    }).catch(error => console.log(error))
                }
            }

            for (let obj2 of Admin) {
                if (obj.administrator_id === obj2.url) {
                    axios.get(obj2.user_id, headerObj).then(response => {
                        administrator = response.data['name'] + " " + response.data['first_name']
                        objtempo3 = { ...objtempo2, 'administrator_name': administrator }
                        // console.log('objtempo3........', objtempo3)

                        tempo.push(objtempo3)
                        //  console.log(tempo, 'tempo aa')
                        settemporel2(tempo)

                    }).catch(error => console.log(error))
                }
            }
        }
    }
    useEffect(() => {
        console.log('activeHelp ________________________________', activeHelp)
    }, [activeHelp])

    useEffect(() => {
        //  if(temporel1.length === 0){
        loadId(activeHelp)
        // }
        // console.log('activeHelp ________________________________', activeHelp)
    }, [activeHelp, helpType, members, users, Admin])

    useEffect(() => {
        loadId2(NoactiveHelp)
    }, [NoactiveHelp, helpType, members, users, Admin])

*/
    if (fontsLoaded) {
        return (
            <View style={{alignItems:'center',marginTop:10,}}>
                <ScrollView >
                    <Text numberOfLines={2} style={styles.text}>Aides financiaires auxquelles contribuer</Text>
                    <CarouselHelp helpList={activeHelp} navigation={navigation} />

                    <Text numberOfLines={2} style={styles.text}>Aides financiaires totalement contribuées</Text>
                    <CarouselHelp helpList={NoactiveHelp} navigation={navigation} />

                </ScrollView>
                <Icon
					name="add-circle"
					size={70}
					disabled={permissions ? false : true}
					color={permissions ? "#f4511e" : "#bbb"}
					containerStyle={{ position: "absolute", bottom: 10,right: 10,backgroundColor:'transparent' }}
					
				/>
            </View>
        )
    }
    else {
        return null
    }
}


export default Aides


const styles = StyleSheet.create({
    text: {
        color: 'black',
        fontFamily: 'poppinsBold',
        paddingBottom: -80,
        fontSize: 20,
        alignSelf: 'center'
    }
});
