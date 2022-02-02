import React, { useEffect, useState, useContext } from 'react';
import { Text, View, StyleSheet, Animated, Dimensions, ScrollView } from "react-native";
import * as Font from 'expo-font';
import URL from '../../shared/URL';
import axios from 'axios';
import headerObj from '../../shared/token';
import { AuthContext } from "../../contexts/AuthContext";
import { Avatar } from "react-native-elements";

// import all the components we are going to use
import { SafeAreaView } from 'react-native';

import { scrollInterpolator, animatedStyles } from '../adminScreens/utils/animations';

//customIcon={CustomSearchIcon}
import SearchBar from '@pnap/react-native-search-bar'
const SLIDER_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);
const ITEM_HEIGHT = Math.round(ITEM_WIDTH * 3 / 4);
import * as Animatable from 'react-native-animatable';
import Carousel, { Pagination } from 'react-native-snap-carousel';

export default function DetailsSessions({ route }) {
    const [admin, setadmin] = useState([])

    const [saving, setsaving] = useState([]);
    const [fontsLoaded, setfontsLoaded] = useState(false);
    const [users, setusers] = useState([])
    const [session, setsession] = useState({})
    const [borrowings, setborrowings] = useState([])
    const [refunds, setrefunds] = useState([])
    //activeSlide
    const [activeSlideSaving, setactiveSlideSaving] = useState(0)
    const [members, setmembers] = useState([])
    const [activeSlideBorrowing, setactiveSlideBorrowing] = useState(0)
    const [activeSlideRefund, setactiveSlideRefund] = useState(0)

    useEffect(() => {
        //  console.log('route.params',route.params)
        setsession(route.params)
        var epargn = []
        axios.get(URL + `savings/`, headerObj).then((response) => {
            // console.log('donner recu',response.data)
            for (let obj of response.data) {
                if (obj['session_id'] === session['id']) {
                    epargn.push(obj)
                }

            }
            // console.log('************************&&&&&&&&&&&&&&&&&&&&', epargn)
            setsaving(epargn)
        }).catch(error => {
            console.log("voici l'erreur de chargement des epargnes", error)
        })

        var epargn1 = []
        axios.get(URL + `borrowings/`, headerObj).then((response) => {
            // console.log('donner recu',response.data)
            for (let obj of response.data) {
                if (obj['session_id'] === session['id']) {
                    epargn1.push(obj)
                }

            }
            setborrowings(epargn1)
        }).catch(error => {
            console.log("voici l'erreur de chargement des emprunts", error)
        })

    }, [route])

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


        var epargn2 = []
        axios.get(URL + `refunds/`, headerObj).then((response) => {
            // console.log('donner recu',response.data)
            for (let obj of response.data) {
                if (obj['session_id'] === session['id']) {
                    epargn2.push(obj)
                    setrefunds(epargn2)
                }

            }
            // setrefunds(epargn2)
        }).catch(error => {
            console.log("voici l'erreur de chargement des emprunts", error)
        })

        var epargn3 = []
        axios.get(URL + `members/`, headerObj).then((response) => {
            // console.log('donner recu',response.data)
            for (let obj of response.data) {

                epargn3.push(obj)

            }
            setmembers(epargn3)
        }).catch(error => {
            console.log("voici l'erreur de chargement des membres", error)
        })



        axios.get(URL + `users/`, headerObj).then((response) => {
            var val = []
            // console.log('donner recu',response.data)
            for (let obj of response.data) {

                val.push(obj)
            }
            setusers(val)

        }).catch(error => {
            console.log("voici l'erreur", error)
        })

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
    })
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

    const getAdminName = (adminId) => {
        // console.log('adminId',adminId)
        for (let obj of admin) {
            if (obj['id'] === adminId) {
                for (let ov of users) {
                    if (ov['id'] === obj['user_id']) {
                        return ov['name'] + " " + ov['first_name']
                    }
                }
                // return getNameMember(obj['user_id'])
            }
            else {
                return ''
            }
        }
    }
    /*
    const getMemberName = (adminId) => {
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
*/
    const renderItem = (val) => {

        return (
            < Animatable.View
                animation="bounceInLeft"
                duration={1500}
                style={{
                    alignSelf: 'center',
                    backgroundColor: '#FE7C00',
                    height: Dimensions.get("window").height * 0.27,
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
                    padding: 20,
                    paddingTop: 10,
                    marginBottom: 20,
                    elevation: 17,
                    position: 'relative',
                    justifyContent: 'center'
                }} >
                <View style={{ flexDirection: 'row' }}>

                    <Avatar
                        size={10}
                        rounded
                        style={{ marginLeft: 5 }}
                        source={getNameMember(val.item.member_id).avatar !== null ? { uri: getNameMember(val.item.member_id).avatar } : {}}
                        key={`${val.item.id}`}
                    />
                    <Text style={styles.valueText} numberOfLines={1}>
                        {
                            getNameMember(val.item.member_id).name
                        }
                    </Text>
                </View>
                {/*react-native-elements Card*/}
                <Text numberOfLines={1}>
                    <Text style={styles.text} numberOfLines={1}>
                        Montant :   </Text><Text style={styles.valueText}>{
                            val.item.amount
                        }
                    </Text>
                </Text>

                <Text >
                    <Text style={styles.text} numberOfLines={1}>
                        Administrateur : </Text><Text style={styles.valueText}>{
                            getAdminName(val.item.administrator_id)
                        }
                    </Text>
                </Text>
            </Animatable.View>
        )
    }


    const scrollY = React.useRef(new Animated.Value(0)).current;
    if (fontsLoaded) {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView>
                    <View >
                        <Animatable.View duration={1000} animation='bounceIn'><Text style={styles.textExercise}>Epargnes</Text></Animatable.View>
                        <View style={{ marginTop: -10 }}>
                            <Carousel
                                data={saving}
                                renderItem={renderItem}
                                sliderWidth={SLIDER_WIDTH}
                                itemWidth={ITEM_WIDTH}
                                containerCustomStyle={styles.carouselContainer}
                                inactiveSlideShift={0}
                                //  ref={ref => this.carousel = ref}
                                onSnapToItem={(index) => setactiveSlideSaving(index)}
                                scrollInterpolator={scrollInterpolator}
                                slideInterpolatedStyle={animatedStyles}
                                useScrollView={true}
                            />
                        </View>
                    </View>
                    <View>
                        <Animatable.View duration={1000} animation='bounceIn'><Text style={styles.textExercise}>Remboursements</Text></Animatable.View>
                        <Carousel
                            data={refunds}
                            renderItem={renderItem}
                            sliderWidth={SLIDER_WIDTH}
                            itemWidth={ITEM_WIDTH}
                            containerCustomStyle={styles.carouselContainer}
                            inactiveSlideShift={0}
                            //  ref={ref => this.carousel = ref}
                            onSnapToItem={(index) => setactiveSlideBorrowing(index)}
                            scrollInterpolator={scrollInterpolator}
                            slideInterpolatedStyle={animatedStyles}
                            useScrollView={true}
                        />
                    </View>
                    <View>
                        <Animatable.View duration={1000} animation='bounceIn'><Text style={styles.textExercise}>Emprunts</Text></Animatable.View>
                        <Carousel
                            data={borrowings}
                            renderItem={renderItem}
                            sliderWidth={SLIDER_WIDTH}
                            itemWidth={ITEM_WIDTH}
                            containerCustomStyle={styles.carouselContainer}
                            inactiveSlideShift={0}
                            //  ref={ref => this.carousel = ref}
                            onSnapToItem={(index) => setactiveSlideRefund(index)}
                            scrollInterpolator={scrollInterpolator}
                            slideInterpolatedStyle={animatedStyles}
                            useScrollView={true}
                        />
                    </View>

                </ScrollView>
            </SafeAreaView>
        )
    }
    else {
        return null
    }

}

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
        marginTop: 50,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 40,
        backgroundColor: '#ecf0f1',
    },
    textExercise: {
        fontSize: 26,
        color: '#156182',
        marginLeft: 30

    },
    paragraph: {
        margin: 24,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#34495e',
    },
})
