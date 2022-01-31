import React, { Component, useEffect, useState, useContext } from "react";
import { StyleSheet, Text, View, Image, Animated } from "react-native";
import * as Animatable from "react-native-animatable";
import { Avatar, Surface } from "react-native-paper";
import URL from "../../shared/URL";
import Button from "./Button";
import * as Font from "expo-font";
import headerObj from "../../shared/token";
import { Dimensions, ScrollView } from "react-native";
import axiosNoTokenInstance from "../../utils/axiosNoTokenInstance";
import { AuthContext } from "../../contexts/AuthContext";
import axios from 'axios';
const { height } = Dimensions.get("screen");

export default function Contributions() {
    const [user, setuser] = useState({})
    const [users, setusers] = useState([{}])
    const { auth, dispatch } = useContext(AuthContext);
    const [password, setPassword] = useState('')
    const [email, setemail] = useState('')
    const [fontsLoaded, setfontsLoaded] = useState(false);
    const [member, setmember] = useState({})
    const [members, setmembers] = useState([]);
    const [contributions, setcontributions] = useState([]);
    const [admin, setadmin] = useState([])
    const [helps, sethelps] = useState([])
    const [helpType, sethelpType] = useState([]);

    //recuperation du password et email
    useEffect(() => {
        //console.log("^^^^^^^^^^^^^^^",auth.user.email)
        setemail(auth.user.email);
        setPassword(auth.user.password);
    }, [auth]);

    const scrollY = React.useRef(new Animated.Value(0)).current;

    useEffect(() => {
        var val1 = []
        axios.get(URL + `members/`, headerObj).then((response) => {
            // console.log('userr infos-----------------------',users)
            for (let temp of response.data) {
                if (temp['user_id'] === user['id']) {
                    // console.log('--------------voici le membre-------------', temp)
                    setmember(temp)
                }
                val1.push(temp)
            }
            setmembers(val1)
            // console.log('getNameMember(1)',getNameMember(1))
        }).catch(error => {
            console.log("voici l'erreur", error)
        })
    }, [user])


    const getNameMember = (membeId) => {
        // if (saving) {
        var obj = { name: '', avatar: '' }
        var name = ''
        var userId = ''
        for (let obj1 of members) {

            if (membeId === obj1.id) {
                /*
                                axios.get(obj1.user_id, headerObj).then((response) => {
                                    obj.name = response.data['name'] + " " + response.data['first_name']
                                    obj.avatar = response.data['avatar']
                                    setinter(obj.name)
                                }).catch(error => console.log(error))
                */
                userId = obj1['user_id']
                for (let obj2 of users) {
                    if (userId === obj2['id']) {
                        name = obj2['name'] + " " + obj2['first_name']
                    }
                }

                //  console.log('************************obj*********************', inter)
                // obj.name = inter

            }
            //console.log('************************obj*********************', obj)

            // console.log('************************obj*********************', name)
            // console.log('*******************************************repo', name)
            return name
        }
    }


    useEffect(() => {
        axios.get(URL + `users/`, headerObj).then((response) => {
            var val = []
            // console.log('donner recu',response.data)
            for (let obj of response.data) {
                if ((email === obj.email)) {
                    setuser(obj)
                }
                val.push(obj)
            }
            setusers(val)

        }).catch(error => {
            console.log("voici l'erreur", error)
        })

    }, [password, email])

    useEffect(() => {

        const loadFonts = async () => {
            await Font.loadAsync({
                poppinsBold: require('../../assets/fonts/poppins-bold.ttf'),
                poppinsMedium: require('../../assets/fonts/Poppins-Medium.otf'),
                PoppinsLight: require('../../assets/fonts/Poppins-Light.otf'),

            });
            setfontsLoaded(true)
        }
        loadFonts();


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

        axios.get(URL + `helps/`, headerObj).then((response) => {
            var val1 = []
            var val2 = []
            // console.log('donner recu',response.data)
            for (let obj of response.data) {

                val1.push(obj)

            }
            sethelps(val1)
        }).catch(error => console.log(error))


        axios.get(URL + `administrators/`, headerObj).then((response) => {
            var val = []
            //console.log('userr infos',user['url'])
            for (let temp of response.data) {

                val.push(temp)
            }
            setadmin(val)
        }).catch(error => {
            console.log("voici l'erreur", error)
        })
    }, [])

    useEffect(() => {
        var tab = [];
        //  console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",member)
        axiosNoTokenInstance
            .get(URL + "contributions/", headerObj)
            .then((response) => {

                for (let obj of response.data) {

                    if ((obj.state === 1) && (obj['member_id'] === member['id']))

                        tab.push(obj);
                }
                console.log("constributions", tab)
                setcontributions(tab);
            })
            .catch((error) => {
                console.log("voici l'erreur1", error);
            });
    }, [member])

    const getAdminName = (adminId) => {
        // console.log('adminId',adminId)
        for (let obj of admin) {
            if (obj['id'] === adminId) {
                return getNameMember(obj['user_id'])
            }
            else {
                return ''
            }
        }
    }

    const getMemberName = (memberId) => {
        // console.log('adminId', adminId)
        // console.log('----------------------members',members)
        for (let obj of members) {
            if (obj['id'] === memberId) {
                return getNameMember(obj['user_id'])
            }
            else {
                return ''
            }
        }
    }
    const getConcernMemberName = (helpId) => {

        var repo = ''
        for (let obj of helps) {
            if (helpId === obj['id']) {
                for (let obj1 of members) {
                    if (obj['member_id'] === obj1['id']) {
                        for (let obj3 of users) {
                            if (obj3['id'] === obj1['user_id']) {
                                repo = obj3['name'] + " " + obj3['first_name']
                            }
                        }
                    }
                }

            }
        }

        return repo
    }

    const getMotif = (helpId) => {

        var repo2 = ''
        for (let obj of helps) {
            if (helpId === obj['id']) {
               for(let obj1 of helpType){
                   if(obj1['id']===obj['help_type_id']){
                       repo2=obj1['title']
                   }
               }

            }
        }

        return repo2
    }

    const getAmountHelp = (helpId) => {
        // console.log('voic les aides______________',helps)
        var repo1 = ''
        for (let obj of helps) {

            if (helpId === obj['id']) {
                // console.log('helps',helps)
                repo1 = obj.amount
            }
        }

        return repo1
    }
    if (fontsLoaded) {
        return (
            <View style={styles.container}>
                <Animated.FlatList
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                        { useNativeDriver: true }
                    )}
                    data={contributions.filter(elt => elt.id !== undefined).sort(function compare(a, b) {
                        let rep = 0
                        if (a['date'] > b['date']) {
                            return 1
                        }
                        if (a['date'] < b['date']) {
                            return -1
                        }
                        else {
                            return rep;
                        }

                    })}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item, index }) => {
                        //Normal Animation
                        const inputRange = [
                            -1,
                            0,
                            (height * 0.1 + 15) * index,
                            (height * 0.1 + 15) * (index + 3),
                        ];
                        const scale = 1;
                        const opacity = scrollY.interpolate({
                            inputRange,
                            outputRange: [1, 1, 1, 0],
                        });
                        const Offset = scrollY.interpolate({
                            inputRange,
                            outputRange: [0, 0, 0, 500],
                        });

                        return (
                            <Animated.View
                                style={{
                                    alignSelf: 'center',
                                    transform: [{ scale: scale }, { translateX: Offset }],
                                    opacity: opacity,
                                }}
                                key={`${item.id}` - { index }}
                            >
                                <Surface style={styles.surface}>
                                    <View><Text style={{ fontFamily: 'poppinsBold', fontSize: 17, color: '#0f4566' }}>Contribution N {index + 1} </Text></View>
                                    <View

                                    >
                                         <Text style={{ fontSize: 16, marginBottom: -5, marginLeft: 15, fontFamily: 'poppinsMedium' }}>Montant :<Text style={{ fontFamily: 'poppinsLight', fontSize: 16 }}> {getAmountHelp(item.help_id)} XAF</Text></Text>
                                        <Text style={{ fontSize: 16, marginBottom: -5, marginLeft: 15, fontFamily: 'poppinsMedium' }}>Date :<Text style={{ fontFamily: 'poppinsLight', fontSize: 16 }}> {item.date} </Text>
                                        </Text>
                                        <Text style={{ fontSize: 16, marginBottom: -5, marginLeft: 15, fontFamily: 'poppinsMedium' }}>Membre aide :<Text style={{ fontFamily: 'poppinsLight', fontSize: 16 }}> {getConcernMemberName(item.help_id)} </Text>
                                        </Text>
                                      
                                        <Text style={{ fontSize: 16, marginBottom: -5, marginLeft: 15, fontFamily: 'poppinsMedium' }}>Motif :<Text style={{ fontFamily: 'poppinsLight', fontSize: 16 }}> {getMotif(item.help_id)} </Text>
                                        </Text>
                                         <Text style={{ fontSize: 16, marginBottom: -5, marginLeft: 15, fontFamily: 'poppinsMedium' }}>Administrateur :<Text style={{ fontFamily: 'poppinsLight', fontSize: 16 }}> {getAdminName(item.administrator_id)} </Text>
                                        </Text>
                                    </View>
                                </Surface>
                            </Animated.View>
                        );
                    }}
                />
            </View>
        )
    }
    else {
        return null
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",

    },
    surface: {
        height: 145,
        backgroundColor: '#FE7C00',
        width: Dimensions.get('window').width * 0.87,
        marginBottom: 10,
        marginTop:12,
        padding: 2,
        paddingLeft: 15,
        marginHorizontal: 10,
        borderRadius: 8,
        flexDirection: "column",
    },

});
