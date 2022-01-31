import React, { Component, useEffect, useState, useContext } from 'react'
import { SafeAreaView, ScrollView } from 'react-native';
import { Text, View, Dimensions, StyleSheet } from 'react-native';

import { scrollInterpolator, animatedStyles } from '../memberScreens/utils/animations';

//customIcon={CustomSearchIcon}
import SearchBar from '@pnap/react-native-search-bar'
const SLIDER_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);
const ITEM_HEIGHT = Math.round(ITEM_WIDTH * 3 / 4);
import * as Animatable from 'react-native-animatable';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import URL from '../../shared/URL';
import Button from './Button';
import * as Font from 'expo-font';
import headerObj from '../../shared/token';
import { AuthContext } from "../../contexts/AuthContext";
import axios from 'axios'



function remove_accents(strAccents) {
    var strAccents = strAccents.split('');
    var strAccentsOut = new Array();
    var strAccentsLen = strAccents.length;
    var accents = "ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž";
    var accentsOut = "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
    for (var y = 0; y < strAccentsLen; y++) {
        if (accents.indexOf(strAccents[y]) != -1) {
            strAccentsOut[y] = accentsOut.substr(accents.indexOf(strAccents[y]), 1);
        } else
            strAccentsOut[y] = strAccents[y];
    }
    strAccentsOut = strAccentsOut.join('');

    return strAccentsOut;
}


function BorrowingMember(props) {
    const [display, setdisplay] = useState(false)
    const [borrowing, setborrowing] = useState([]);
    const [fontsLoaded, setfontsLoaded] = useState(false);
    const [sessionsElt, setsessionsElt] = useState([]);
    const [password, setPassword] = useState('')
    const [email, setemail] = useState('')
    const [user, setuser] = useState({})
    const [users, setusers] = useState([])
    const [member, setmember] = useState({})
    const [activeSlide, setactiveSlide] = useState(0);
    const [searchResult, setsearchResult] = useState([])
    const [carouselItems, setcarouselItems] = useState([{
        amount: '',
        administrator: '',
        interest: 0,
        totalAmount: 0,
        refundAmount: 0,
        id: '',
        exerciceYear: '',
        RestAmount: 0,
        exerciceState: 0,
        session: ''
    }]);
    const [members, setmembers] = useState([]); //that is the Admins List
    const [refund, setrefund] = useState([]);
    const [inter, setinter] = useState('');
    const [inter2, setinter2] = useState(0);
    const [AllExecises, setAllExecises] = useState([]);
    const [differentExercise, setdifferentExercise] = useState([{
        year: '',
        state: 0,
        exercisesTab: []
    }]);
	const { auth, dispatch } = useContext(AuthContext);

    //const scrollY = React.useRef(new Animated.Value(0)).current;

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

        var val6 = []
        axios.get(URL + `exercises/`, headerObj).then((response) => {
            // console.log('donner recu',response.data)
            for (let obj of response.data) {

                val6.push(obj)

            }
            setAllExecises(val6)
        }).catch(error => {
            console.log("voici l'erreur", error)
        })

        var borro = []
        axios.get(URL + `borrowings/`, headerObj).then((response) => {
            // console.log('donner recu',response.data)
            for (let obj of response.data) {
                borro.push(obj)
            }
            setborrowing(borro)
        }).catch(error => {
            console.log("voici l'erreur de chargement des emprunts", error)
        })

        var borro1 = []
        axios.get(URL + `refunds/`, headerObj).then((response) => {
            // console.log('donner recu',response.data)
            for (let obj of response.data) {
                borro1.push(obj)
            }
            setrefund(borro1)
        }).catch(error => {
            console.log("voici l'erreur de chargement des emprunts", error)
        })

        var tempo = []

        axios.get(URL + `sessions_/`, headerObj).then((response) => {
            for (let obj of response.data) {
                tempo.push(obj)
            }
            setsessionsElt(tempo)
        }).catch(error => {
            console.log("voici l'erreur sur le chargement des sessions", error)
        })

    }, [])

    //requete vers l'API pour avoir le user correspondant
    useEffect(() => {
        axios.get(URL + `users/`, headerObj).then((response) => {
            var val = []
            // console.log('donner recu',response.data)
            for (let obj of response.data) {
                if ((password === obj.password) && (email === obj.email)) {
                    setuser(obj)
                }
                val.push(obj)
            }
            setusers(val)

        }).catch(error => {
            console.log("voici l'erreur", error)
        })

    }, [password, email])


    //requete pour avoir le username de l'utilisateur correspondant
    useEffect(() => {
        axios.get(URL + `administrators/`, headerObj).then((response) => {
            var val = []
            //console.log('userr infos',user['url'])
            for (let temp of response.data) {

                val.push(temp)
            }
            setmembers(val)
        }).catch(error => {
            console.log("voici l'erreur", error)
        })
    }, [user])

    //recuperation du password et email
    useEffect(() => {
		setemail(auth.user.email);
		setPassword(auth.user.password);
    }, [auth])

    useEffect(() => {
        axios.get(URL + `members/`, headerObj).then((response) => {
            // console.log('userr infos-----------------------',users)
            for (let temp of response.data) {
                if (temp['user_id'] === user['id']) {
                    // console.log('--------------voici le membre-------------', temp)
                    setmember(temp)
                }
            }
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
            return name
        }
    }

    const getDateSession = (sessionId) => {
        var resp = ''
        for (let obj of sessionsElt) {
            if (sessionId === obj['id']) {
                resp = obj['date']
                //  console.log('************************obj*********************', obj['date'])
            }
        }
        // console.log('************************obj*********************', resp)
        return resp
    }

    const getrefundAmount = (borrowId) => {
        var resp = 0
        for (let obj of refund) {
            if (borrowId === obj['borrowing_id']) {
                resp = obj['amount']
            }
        }
        return resp
    }
    const getExerciceDate = (sessionId) => {
        var exercise = {}
        for (let obj of sessionsElt) {
            //  console.log('****************************',sessionsElt)
            if (sessionId === obj['id']) {
                for (let obj1 of AllExecises) {
                    if (obj1['id'] === obj['exercise_id']) {

                        exercise = obj1
                    }
                }
            }
        }
        // console.log('****************************',obj1)
        return exercise
    }

    useEffect(() => {
        var objet = [{
            amount: '',
            administrator: '',
            interest: 0,
            totalAmount: 0,
            refundAmount: 0,
            exerciceYear: '',
            exerciceState: 0,
            id: '',
            RestAmount: 0,
            session: ''
        }]
        for (let obj of borrowing) {
            //console.log('---------------------------------------------obj',obj)
            if (obj['member_id'] == member['id']) {
                objet.push({
                    amount: obj['amount'],
                    administrator: getNameMember(obj['administrator_id']),
                    session: getDateSession(obj['session_id']),
                    id: obj['id'],
                    exerciceYear: getExerciceDate(obj['session_id'])['year'],
                    exerciceState: getExerciceDate(obj['session_id'])['active'],
                    interest: obj['interest'],
                    totalAmount: obj['amount'] + (obj['amount'] * obj['interest']) / 100,
                    refundAmount: getrefundAmount(obj['id']),
                })
            }
        }
        // console.log('************************obj*********************', objet)
        setcarouselItems(objet)


    }, [sessionsElt, users, members, member['id'], user]);
    /* 
         useEffect(() => {
             console.log('getDateSession*************************', ElementDisplay)
         }, [ElementDisplay]);
    */


    useEffect(() => {
        //setdifferentExercise
        var tab = differentExercise
        for (let obj1 of AllExecises) {
            tab.push({
                year: obj1['year'],
                state: 0,
                exercisesTab: []
            })

        }
        setdifferentExercise(tab)
        // console.log('--------------------------differentExercise', differentExercise)
        /*
          for (let obj of carouselItems) {
              for (let obj2 of differentExercise) {
                  if (obj['exerciceYear'] === obj2['year']) {
                      obj2['exercisesTab'].push({ obj })
                  }
              }
          }
          */
        // console.log('differentExercise++++++++++++++++++++++after', getUniqueListBy(differentExercise,id))

        var table = carouselItems.filter(elt => elt.session !== '').sort(function compare(a, b) {
            let rep = 0
            if (a['exerciceYear'] > b['exerciceYear']) {
                return 1
            }
            if (a['exerciceYear'] < b['exerciceYear']) {
                return -1
            }
            else {
                return rep;
            }

        })
        /*
         const [differentExercise, setdifferentExercise] = useState([{
                year: '',
                exercisesTab: []
            }]);
            */
        var i = 0
        var table2 = differentExercise
        for (let obj of table) {
            for (let obj1 of table2) {
                if (obj1['year'] === obj['exerciceYear']) {
                    obj1.state = obj.exerciceState
                    obj1.exercisesTab.push(obj)
                }
            }
        }
        table2 = getUniqueListBy(table2, 'year')
        for (let obj3 of table2) {

            obj3.exercisesTab = getUniqueListBy(obj3.exercisesTab, 'session').sort(function compare(a, b) {
                let rep = 0
                if (a['session'] > b['session']) {
                    return 1
                }
                if (a['session'] < b['session']) {
                    return -1
                }
                else {
                    return rep;
                }
    
            })
        }
        //  console.log('--------------------------table2', table2)
        setdifferentExercise(table2.filter(elt => elt['year'] !== '').sort(function compare(a, b) {
            let rep = 0
            if (a['year'] > b['year']) {
                return 1
            }
            if (a['year'] < b['year']) {
                return -1
            }
            else {
                return rep;
            }

        }))
        console.log('--------------------------differentExercise', differentExercise)

    }, [carouselItems]);



    function getUniqueListBy(array, key) {
        return array.reduce((arr, item) => {
            const removed = arr.filter(i => i[key] !== item[key]);
            return [...removed, item];
        }, []);
    }


    const _renderItem = ({ item, index }) => {
        return (//bounceInLeft
            < Animatable.View
             animation="bounceInLeft"
             duration={3500}
                style={{
					alignSelf:'center',
                    backgroundColor: '#FE7C00',
                    height: Dimensions.get("window").height * 0.5,
                    width: Dimensions.get("window").width * 0.72,
                    // borderBottomLeftRadius: 13,
                    // borderBottomRightRadius: 13,
                    // borderTopLeftRadius: 13,
                    // borderTopRightRadius: 13,
                    borderRadius: 14,
                    borderBottomRightRadius: 13,
                    shadowOffset: 10,
                    shadowColor: 'black',
                    shadowOpacity: 1,
                    shadowRadius: 15,
                    marginLeft: 25,
                    marginRight: 20,
                    padding: 15,
                    marginBottom: 40,
                    elevation:17,
                    position: 'relative',
                    justifyContent: 'center'
                }}

            >
                <Text style={styles.text}>Montant emprunté : <Text style={styles.valueText}>{item.amount} XAF</Text></Text>
                <Text style={styles.text}>Intérêt : <Text style={styles.valueText}>{item.interest} %</Text></Text>

                <Text style={styles.text}>Montant total : <Text style={styles.valueText}>{item.totalAmount} XAF</Text></Text>



                <Text style={styles.text}>Montant remboursé :<Text style={styles.valueText}>{item.refundAmount} XAF</Text></Text>
                <Text style={styles.text}>Montant restant :<Text style={styles.valueText}>{item.totalAmount - item.refundAmount} XAF</Text></Text>
                <Text style={styles.text}>Administrateur :<Text style={styles.valueText}>{item.administrator}</Text> </Text>
                <Text style={styles.text}>Session d'emprunt :<Text style={styles.valueText}>{item.session}</Text> </Text>

                <Text style={styles.text}>Annee Exercice:<Text style={styles.valueText}>{item.exerciceYear}</Text> </Text>


            </Animatable.View >
        )
    }



    if (fontsLoaded) {
        return (
            <SafeAreaView style={{ flex: 1, paddingTop: 20, }}>

                <ScrollView>
                    {
                        differentExercise.map((item,index) => {
                            {
                                return(
                                <View key={item.year}>
                                    {
                                        item.state === 0 ?
                                            <Animatable.View duration={1000} animation='bounceIn'><Text style={styles.textExercise}>Exercice de l'annee {item.year}</Text></Animatable.View> :
                                            <Animatable.View duration={1000} animation='bounceIn'><Text style={styles.textExercise}>Exercice de l'annee {item.year} <Text style={{ color: 'red',fontSize:18 }}>(En cours)</Text></Text></Animatable.View>
                                    }
                                    <View style={{marginTop:-40}}>

                                        <Carousel
                                            //  ref={(c) => carousel = c}
                                            data={item.exercisesTab}
                                            renderItem={_renderItem}
                                            sliderWidth={SLIDER_WIDTH}
                                            itemWidth={ITEM_WIDTH}
                                            containerCustomStyle={styles.carouselContainer}
                                            inactiveSlideShift={0}
                                            onSnapToItem={(index) => { setactiveSlide(index) }}
                                            scrollInterpolator={scrollInterpolator}
                                            slideInterpolatedStyle={animatedStyles}
                                            useScrollView={true}
                                        />

                                    </View>
                                </View>
                                )
                            }
                        })

                    }
                </ScrollView>
            </SafeAreaView>
        );
    }
    else {
        return false
    }
};

export default BorrowingMember;

const styles = StyleSheet.create({
    text: {
        color: 'black',
        fontFamily: 'poppinsBold',
        paddingBottom: 1,
        paddingTop: 3,
        fontSize: 16,
        left: 2,
        marginLeft: 20
    },
    valueText: {
        fontFamily: 'PoppinsLight',
        fontSize: 17
    },
    carouselContainer: {
        marginTop: 50
    },
    itemContainer: {
        width: ITEM_WIDTH * 0.9,
        height: ITEM_HEIGHT * 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'dodgerblue',
        borderRadius: 10
    },
    itemLabel: {
        color: 'white',
        fontSize: 24
    },
    counter: {
        marginTop: 25,
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    tex: {
        fontSize: 25,
        color: '#156182',
        marginTop: 15,

    },
    textExercise: {
        fontSize: 26,
        color: '#156182',

    }
});
