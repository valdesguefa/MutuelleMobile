import React, { Component, useEffect, useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import * as Animatable from "react-native-animatable";
import URL from "../../shared/URL";
import Button from "./Button";
import * as Font from "expo-font";
import headerObj from "../../shared/token";
import { Dimensions, ScrollView } from "react-native";
import { Avatar, Icon } from "react-native-elements";
import axiosNoTokenInstance from "../../utils/axiosNoTokenInstance";
// import left from '../../assets/icons8_left_24px.png'

const HelpDetails = ({ route, navigation }) => {
	const [member, setmember] = useState("");
	const [item, setitem] = useState({});
	const [members, setmembers] = useState([]);
	const [contributions, setcontributions] = useState([]);
	//const [contribution, setcontribution] = useState(0)
	const [helpType, sethelpType] = useState([]);
	const [users, setusers] = useState([]);
	const [fontsLoaded, setfontsLoaded] = useState(false);
	const [avatar, setavatar] = useState(null);
	const [memberContribute, setmemberContribute] = useState([]);
	const [memberNoContribute, setmemberNoContribute] = useState([]);
	const [length, setlength] = useState(0);

	useEffect(() => {
		console.log("props.route.params.item", route.params)
		setitem(route.params);
	}, [route]);

	useEffect(() => {
		const getNameMember = () => {
			var name = "";
			// this.setState({name: ''})
			for (let obj1 of members) {
				if (item.member_id === obj1.id) {
					axiosNoTokenInstance
						.get(URL + `users/${obj1.user_id}/`, headerObj)
						.then((response) => {
							name = response.data["name"] + " " + response.data["first_name"];
							//  console.log('name',name)
							setmember(name); // }, () => console.log('entrer', this.state.member))
							setavatar(response.data["avatar"]);
						})
						.catch((error) => console.log(error));

					//  break
				}
			}
		};

		getNameMember();
	}, [members, item]);
	/*
		const getNameMember1 = (membeId) => {
			var obj = { name: "", avatar: "" };
	
			// this.setState({name: ''})
			// console.log('-----------member----------',members)
			for (let obj1 of members) {
				if (membeId == obj1.url) {
					axiosNoTokenInstance
						.get(obj1.user_id, headerObj)
						.then((response) => {
							obj.name = response.data["name"] + " " + response.data["first_name"];
							obj.avatar = response.data["avatar"];
							// console.log('************************obj*********************', obj)
						})
						.catch((error) => console.log(error));
	
					//  break
				}
			}
	
			return obj;
		};
	*/
	useEffect(() => {
		var contributer = [];
		var nocontributer = [];
		for (let obj2 of contributions) {
			if (obj2.help_id === item.id) {
				if (obj2.state === 0) {
					for (let obj1 of members) {
						// var obj = { name: '', avatar: '' }
						if (obj2["member_id"] === obj1.id) {
							var obj = { name: "", avatar: "" };
							axiosNoTokenInstance
								.get(URL + `users/${obj1.user_id}/`, headerObj)
								.then((response) => {
									//  obj.name = response.data['name'] + " " + response.data['first_name']
									//  obj.avatar = response.data['avatar']
									obj = {
										name: response.data["name"] + " " + response.data["first_name"],
										avatar: response.data["avatar"],
									};
									// console.log('************************obj*********************',obj)
									contributer.push(obj);
									if (contributer.length >= memberContribute.length) {
										setmemberContribute(contributer);
									}
								})
								.catch((error) => console.log(error));
						}
					}
					//setmemberContribute(contributer)
				} else {
					for (let obj1 of members) {
						if (obj2["member_id"] === obj1.id) {
							var obj3 = { name: "", avatar: "" };
							axiosNoTokenInstance
								.get(URL + `users/${obj1.user_id}/`, headerObj)
								.then((response) => {
									obj3 = {
										name: response.data["name"] + " " + response.data["first_name"],
										avatar: response.data["avatar"],
									};

									nocontributer.push(obj3);
									//setmemberNoContribute(nocontributer);
									 console.log('************************obj3*********************', nocontributer)
									if (nocontributer.length >= memberNoContribute.length) {
										setmemberNoContribute(nocontributer);
									}
								})
								.catch((error) => console.log(error));

							//  break
						}
					}
					// setmemberNoContribute(nocontributer)
				}
			}
		}
	}, [contributions, item, members]);

	const getContribution = () => {
		var contribu = 0;
		for (let obj of contributions) {
			if (obj.help_id === item.id && obj.state === 1) {
				contribu = contribu + item.unit_amount;
			}
		}
		return contribu;
	};

	useEffect(() => {
		const loadFonts = async () => {
			await Font.loadAsync({
				poppinsBold: require("../../assets/fonts/poppins-bold.ttf"),
				poppinsMedium: require("../../assets/fonts/Poppins-Medium.otf"),
			});
			setfontsLoaded(true);
		};
		loadFonts();

		var tab = [];
		axiosNoTokenInstance
			.get(URL + "contributions/", headerObj)
			.then((response) => {
				for (let obj of response.data) {
					tab.push(obj);
				}
				setcontributions(tab);
			})
			.catch((error) => {
				console.log("voici l'erreur1", error);
			});

		axiosNoTokenInstance
			.get(URL + `help_types/`, headerObj)
			.then((response) => {
				var val3 = [];
				for (let temp of response.data) {
					val3.push(temp);
				}
				// console.log("------voici les types d'aides-----", val3)
				sethelpType(val3);
			})
			.catch((error) => {
				console.log("voici l'erreur2", error);
			});

		axiosNoTokenInstance
			.get(URL + `members/`, headerObj)
			.then((response) => {
				var val4 = [];
				for (let temp of response.data) {
					val4.push(temp);
				}
				// console.log('------voici les membres-----', val4)
				setmembers(val4);
			})
			.catch((error) => {
				console.log("voici l'erreur3", error);
			});

		axiosNoTokenInstance
			.get(URL + `users/`, headerObj)
			.then((response) => {
				var val5 = [];
				// console.log('donner recu',response.data)
				for (let obj of response.data) {
					val5.push(obj);
				}
				//console.log('voici les users',val5)
				setusers(val5);
			})
			.catch((error) => {
				console.log("voici l'erreur4", error);
			});
	}, []);

	/*
	useEffect(() => {
		const loadFonts=async()=>{
			await Font.loadAsync({
				poppinsBold: require('../../assets/fonts/poppins-bold.ttf'),
    
			});
			setfontsLoaded(true)
		}
		loadFonts()
	 
	 const AsyncFunction=async()=>{
	const response1= await  axiosNoTokenInstance.get(URL + `users/`, headerObj)
	const tab=await response1.data
	var val5=[]
	  for (let obj of tab) {
    
					val5.push(obj)
				}
				 
				setusers(val5 )
    
	 const response2= await axiosNoTokenInstance.get(URL + `members/`, headerObj)
	 const tab2=await  response2.data
	var val4=[]
	  for (let obj of tab2) {
    
					val4.push(obj)
				}
				 
			  setmembers(val4 )
			  console.log('voici les membres',members)
	 }
	 AsyncFunction()
    
	}, [])
	*/

	const getHelpTypeName = () => {
		var help_type = "";
		for (let obj3 of helpType) {
			if (item.help_type_id === obj3.id) {
				help_type = obj3.title;
				//objtempo1 = { ...objtempo, 'help_type_name': help_type }
				// console.log('objtempo', objtempo1)
			}
		}
		return help_type;
	};

	if (fontsLoaded) {
		//console.log("memberContribute ------------------------------------------------", memberContribute);
		// console.log('memberNoContribute ------------------------------------------------', memberNoContribute)
		return (
			<View style={{ backgroundColor: "white" }}>
				<Text></Text>
				<View style={styles.header}>
					<Text
						style={{
							color: "white",
							fontFamily: "poppinsMedium",
							fontSize: 12,
							alignSelf: "center",
							marginTop: Dimensions.get("window").height * 0.02,
						}}
					>
						{item.create_at} - {item.limit_date}
					</Text>
					<View >
						<Icon name="arrow-back" size={30} color="white" containerStyle={{ left: Dimensions.get("window").width * -0.43,height:25, marginTop: Dimensions.get("window").height * -0.01, }} onPress={()=>navigation.navigate('help')}/>
				
					</View>
				</View>
				<View style={styles.underheader}></View>
				<View style={styles.underheader}></View>
				<View style={styles.underheader}></View>
				<View style={styles.underheader}></View>
				<View style={styles.underheader}></View>

				<View
					style={{
						borderBottomLeftRadius: 60,
						borderBottomRightRadius: 90,
						// borderTopLeftRadius: 13,
						height: Dimensions.get("window").height * 0.80,
						width: Dimensions.get("window").width,
						backgroundColor: "white",
						flex: 3,
						position: "absolute",
						// borderTopRightRadius: 53,
						borderTopRightRadius: 58,
						borderBottomRightRadius: 60,
						padding: 15,
						top: Dimensions.get("window").height * 0.172,
						justifyContent: "center",
					}}
				>
					<Animatable.View
						animation="bounceIn"
						duraton="4500"
						style={{
							marginTop: Dimensions.get("window").height * -0.1,
							marginLeft: Dimensions.get("window").width * 0.2,
							marginBottom: 20,
							shadowColor: "black",
							shadowOpacity: 0.7,
							shadowRadius: 20,
							elevation: 20,
							justifyContent: "center",

							shadowColor: "#000",
							shadowOffset: { width: 0, height: 2 },
						}}
					>
						<Avatar
							size={190}
							rounded
							source={avatar ? { uri: avatar } : { uri: "../../assets/icons8_male_user_120px.png" }}
							key={`${item.url}`}
						/>
						<Text numberOfLines={1} style={styles.nameMember}>
							{member}
						</Text>
						<ScrollView horizontal={false} style={{ height: 80, alignSelf: 'center', width: Dimensions.get('window').width * 0.9, marginLeft: Dimensions.get('window').width * -0.18 }}>
							<Text style={styles.comment}>{item.comments}</Text>
						</ScrollView>
					</Animatable.View>

					<Text style={styles.text}>Montant de l'aide : {item.amount} XAF</Text>

					<Text style={styles.text}>Montant contribution : {item.unit_amount} XAF / membre</Text>

					{item.state === 1 ? (
						item.amount == 0 ? (
							<Animatable.Text animation={"bounceInLeft"} duration={2000} style={styles.contribution}>
								Montant Contributions percus: {getContribution(item)} XAF
							</Animatable.Text>
						) : (
							<Animatable.Text animation={"bounceInLeft"} duration={2000} style={styles.contribution1}>
								Montant Contributions percus: {getContribution(item)} XAF
							</Animatable.Text>
						)
					) : null}

					<Text numberOfLines={2} style={styles.text}>
						Concerne : {member}
					</Text>
					<Text style={styles.text}>Titre : {getHelpTypeName(item)}</Text>
					<ScrollView horizontal={false} style={{ height: 115, marginLeft: 20 }}>
						<View>
							<Text style={{ fontFamily: "poppinsMedium", fontSize: 14, fontStyle: "normal", marginTop: 10 }}>
								Membres ayant contribue :
							</Text>
							<ScrollView horizontal={true}>
								{memberContribute.map((elt, index) => {
									return (
										<Animatable.View
											duration={3000}
											animation={"jello"}
											easing={"ease-in"}
											key={index}
											style={{ margin: 5, marginTop: 10 }}
										>
											<Avatar
												size={70}
												rounded
												source={elt.avatar ? { uri: elt.avatar } : { uri: "../../assets/icons8_male_user_120px.png" }}
												key={`${elt.name}-${index}`}
											/>
											<Text>{elt.name}</Text>
										</Animatable.View>
									);
								})}
							</ScrollView>
						</View>

						<View>
							<Text style={{ fontFamily: "poppinsMedium", fontSize: 14, fontStyle: "normal", marginTop: 15 }}>
								Membres n'ayant pas contribue :
							</Text>
							<ScrollView horizontal={true} style={{ width: Dimensions.get('window').width * 0.85 }}>
								{memberNoContribute.map((elt, index) => {
									return (
										<Animatable.View
											duration={3000}
											animation={"jello"}
											easing={"ease-in"}
											key={index}
											style={{ margin: 5, marginTop: 15 }}
										>
											<Avatar
												size={70}
												rounded
												source={elt.avatar ? { uri: elt.avatar } : { uri: "../../assets/icons8_male_user_120px.png" }}
												key={`${elt.avatar}-12345`}
											/>
											<Text>{elt.name}</Text>
										</Animatable.View>
									);
								})}
							</ScrollView>
						</View>
					</ScrollView>
				</View>

				<View style={styles.footer}></View>
			</View>
		);
	} else {
		return null;
	}
};

export default HelpDetails;

const styles = StyleSheet.create({
	comment: {
		color: "gray",
		fontStyle: "normal",
		fontFamily: "poppinsMedium",
		alignSelf: 'center',
		paddingTop: 3,
		fontSize: 16,
		marginLeft: Dimensions.get('window').width * -0.02,
		left: 2,
	},
	contribution: {
		color: "black",
		fontFamily: "poppinsBold",
		paddingBottom: 1,
		paddingTop: 3,
		fontSize: 20,
		left: 2,
	},
	contribution1: {
		color: "blue",
		fontFamily: "poppinsBold",
		paddingBottom: 0.2,
		paddingTop: 3,
		fontSize: 16,
		left: 2,
		margin: 3,
	},
	nameMember: {
		fontSize: 17,
		marginLeft: Dimensions.get("window").width * 0.12,
		color: "black",
		fontFamily: "poppinsBold",
		paddingBottom: 1,
		paddingTop: 3,
		left: 2,
	},
	text: {
		color: "black",
		fontFamily: "poppinsBold",
		paddingBottom: 0.02,
		paddingTop: 3,
		fontSize: 16,
		left: 2,
		marginLeft: 20,
	},
	header: {
		backgroundColor: "#FE7C00",
		height: Dimensions.get("window").height * 0.13,
		width: Dimensions.get("window").width,
		top: Dimensions.get("window").height * 0.017,
		borderBottomLeftRadius: 46,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		position: "relative",
	},
	underheader: {
		backgroundColor: "#FE7C00",
		height: Dimensions.get("window").height * 0.18,
		width: Dimensions.get("window").width,
		position: "relative",
		justifyContent: "center",
		top: Dimensions.get("window").height * 0.017,
		bottom: 0,
	},
	footer: {
		backgroundColor: "#FE7C00",
		height: Dimensions.get("window").height * 0.13,
		width: Dimensions.get("window").width,
		bottom: -18,
		position: "relative",
	},
});
