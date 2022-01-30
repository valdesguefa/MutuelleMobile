import React, { Component, useEffect, useState } from 'react'
import { SafeAreaView, Text } from 'react-native';
import { Dimensions } from 'react-native';
import {
    View,
    StyleSheet
} from 'react-native'
import * as Animatable from 'react-native-animatable';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import URL from '../../shared/URL';
import Button from './Button';
import * as Font from 'expo-font';
import headerObj from '../../shared/token'
import axios from 'axios'

const NameComponent = (props) => {
    const [member, setmember] = useState('')
    const [item, setitem] = useState({})
    const [members, setmembers] = useState([])

    useEffect(() => {
        setitem(props.item)
        setmembers(props.members)
    }, [props])


    useEffect(() => {
        const getNameMember = () => {
            var name = ''
            // this.setState({name: ''})
            for (let obj1 of members) {

                if (item.member_id === obj1.id) {

                    axios.get(URL+`/users/${obj1.user_id}/`, headerObj).then((response) => {
                        name = response.data['name'] + " " + response.data['first_name']
                        //  console.log('name',name)
                        setmember(name)// }, () => console.log('entrer', this.state.member))

                    }).catch(error => console.log(error))

                    //  break

                }
            }

        }

        getNameMember()
    }, [members, item])

    return (

        <Text numberOfLines={2} style={styles.text}>Concerne : <Text style={styles.textResult}>{member}</Text></Text>

    )

}

export default class CarouselHelp extends Component {


    constructor(props) {
        super(props);
        this.state = {
            fontsLoaded: false,
            activeSlide: 0,
            helpType: [],
            members: [],
            users: [],
            name: '',
            contributions: [],
            carouselItems: [{}]
        };
        this._renderItem = this._renderItem.bind(this);
    }


    static getDerivedStateFromProps(props, state) {
        if (props.helpList !== state.carouselItems) {
            return {
                carouselItems: props.helpList
            };

        }
        return null;
    }


    getContribution(item) {
        var contribution = 0
        for (let obj of this.state.contributions) {
            if (obj.help_id === item.id && obj.state === 1) {
                contribution = contribution + item.unit_amount
            }
        }
        return contribution
    }

    async loadFonts() {
        await Font.loadAsync({
            poppinsBold: require('../../assets/fonts/poppins-bold.ttf'),
            poppinsMedium: require("../../assets/fonts/Poppins-Medium.otf"),
            PoppinsLight: require("../../assets/fonts/Poppins-Light.otf"),
        });
        this.setState({ fontsLoaded: true });
    }

    componentDidMount() {
        this.loadFonts();

        var tab = []
        axios.get(URL + 'contributions/', headerObj).then(response => {
            for (let obj of response.data) {
                tab.push(obj)
            }
            this.setState({ contributions: tab })
        })

        axios.get(URL + `help_types/`, headerObj).then((response) => {
            var val3 = []
            for (let temp of response.data) {

                val3.push(temp)
            }
            //console.log("------voici les types d'aides-----", val)
            this.setState({ helpType: val3 })

        }).catch(error => {
            console.log("voici l'erreur", error)
        })

        axios.get(URL + `members/`, headerObj).then((response) => {
            var val4 = []
            for (let temp of response.data) {

                val4.push(temp)
            }
            // console.log('------voici les membres-----', val)
            this.setState({ members: val4 })

        }).catch(error => {
            console.log("voici l'erreur", error)
        })

        axios.get(URL + `users/`, headerObj).then((response) => {
            var val5 = []
            // console.log('donner recu',response.data)
            for (let obj of response.data) {

                val5.push(obj)
            }
            //  console.log('voici les users',val)
            this.setState({ users: val5 })

        }).catch(error => {
            console.log("voici l'erreur", error)
        })
    }
/*
    getNameMember(item) {

        var val = ''
        // this.setState({name: ''})
      //  console.log('voici les membres______________________-',this.state.members)
      console.log('voici les membres______________________-',item)
        for (let obj1 of this.state.members) {

            if (item.member_id === obj1.id) {
                var name = ''
                console.log("***************************************",obj1.user_id)
                axios.get(URL+`/users/${obj1.user_id}/`, headerObj).then((response) => {
                    name = response.data['name'] + " " + response.data['first_name']

                   // console.log('name------', name)
                    val = name
                    return name;
                }).catch(error => console.log(error))
                break

            }
        }
        return 'lll' + val;

    }
*/
    getHelpTypeName(item) {
        var help_type = ''
        for (let obj3 of this.state.helpType) {

            if (item.help_type_id === obj3.id) {
                help_type = obj3.title
                //objtempo1 = { ...objtempo, 'help_type_name': help_type }
                // console.log('objtempo', objtempo1)
            }
        }
        return help_type
    }

    _renderItem({ item, index }) {
        return (
            <View
                style={{
                    backgroundColor: '#FE7C00',
                    height: Dimensions.get("window").height * 0.37,
                    width: Dimensions.get("window").width * 0.8,
                    // borderBottomLeftRadius: 13,
                    // borderBottomRightRadius: 13,
                    // borderTopLeftRadius: 13,
                    // borderTopRightRadius: 13,
                    borderRadius: 14,
                    borderBottomRightRadius: 13,
                    shadowOffset: 20,
                    shadowColor: 'black',
                    shadowOpacity: 1,
                    shadowRadius: 15,
                    marginLeft: 25,
                    padding: 15,
                    marginBottom: 90,
                    elevation: 25,
                    position: 'relative',
                    justifyContent: 'center'
                }}

            >
                <Text style={styles.text}>Montant : <Text style={styles.textResult}>{item.amount}</Text></Text>
                <Text style={styles.text}>Contribution : <Text style={styles.textResult}>{item.unit_amount} XAF / membre</Text></Text>
                {
                    item.state === 1 ? <View style={{ backgroundColor: 'white', height: 1, width: 240, marginBottom: 12, marginLeft: 20, }}></View>
                        : <View style={{ backgroundColor: 'transparent', height: 40, width: 440 }}></View>
                }
                {
                    item.state === 1 ? <Text style={styles.text}>Contribution : <Text style={styles.textResult}>{this.getContribution(item)}</Text></Text>
                        : null
                }

                <NameComponent members={this.state.members} item={item} />
                <Text numberOfLines={2} style={styles.text}>Titre : <Text style={styles.textResult}>{this.getHelpTypeName(item)}</Text></Text>
                <View style={{ marginBottom: 10 }}  >
                    <Animatable.View animation="bounceIn" duration={4500}  >
                        <Button label="Details" onPress={()=>this.props.navigation.navigate('helpDetail',item)} labelIcon='eye' style={{ marginRight: '10', color: 'white' }} loading={false} />
                    </Animatable.View >
                </View>
            </View >
        )
    }

    get pagination() {
        // const { entries, activeSlide } = this.state;
        return (
            <Pagination

                dotsLength={this.state.carouselItems.length}
                activeDotIndex={this.state.activeSlide}
                containerStyle={{ backgroundColor: 'transparent' }}
                dotStyle={{
                    width: 20,
                    flex: 3,
                    height: 20,
                    borderRadius: 10,
                    marginVertical: -5,
                    marginHorizontal: -5,
                    backgroundColor: '#FE7C00',

                }}
                inactiveDotStyle={{
                    // Define styles for inactive dots here
                    backgroundColor: '#Fd5a00'
                }}

                inactiveDotOpacity={0.3}
                inactiveDotScale={0.6}
            />
        );
    }

    render() {
        if (this.state.fontsLoaded && this.state.carouselItems !== null) {
            return (

                <SafeAreaView style={{ flex: 1, paddingTop: 20, }}>
                    <View>
                        <Carousel
                            layout={'default'}
                            data={this.state.carouselItems}
                            renderItem={this._renderItem}
                            sliderWidth={320}
                            sliderHeight={330}
                            itemWidth={320}
                            itemHeight={350}
                            firstItem={0}
                            ref={ref => this.carousel = ref}
                            onSnapToItem={(index) => this.setState({ activeSlide: index })}
                        />
                        <View style={{ marginTop: 260, alignSelf: 'center', position: 'absolute' }}>
                            {this.pagination}
                        </View>

                    </View>
                </SafeAreaView>
            );
        }
        else {
            return null
        }
    }
}


const styles = StyleSheet.create({
    text: {
        color: 'black',
        fontFamily: 'poppinsBold',
        paddingBottom: 1,
        paddingTop: 3,
        fontSize: 18,
        left: 2,
        marginLeft: 10
    },
    textResult: {
        fontFamily: "PoppinsMedium",
        fontSize: 17,
        color:'white'
    }
});