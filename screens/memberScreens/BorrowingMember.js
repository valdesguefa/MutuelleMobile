import React, { useContext, useEffect, useState } from "react";
import { Text, View, StyleSheet, Animated, Dimensions } from "react-native";
import { Avatar, Surface } from "react-native-paper";

const { height } = Dimensions.get("screen");
import * as Font from "expo-font";
import URL from "../../shared/URL";
import headerObj from "../../shared/token";
import { AuthContext } from "../../contexts/AuthContext";
import axiosNoTokenInstance from "../../utils/axiosNoTokenInstance";

function BorrowingMember() {
	const { auth } = useContext(AuthContext);
	const [saving, setsaving] = useState([]);
	const [fontsLoaded, setfontsLoaded] = useState(false);
	const [sessionsElt, setsessionsElt] = useState([]);
	const [password, setPassword] = useState("");
	const [email, setemail] = useState("");
	const [user, setuser] = useState({});
	const [users, setusers] = useState([]);
	const [member, setmember] = useState({});
	const [ElementDisplay, setElementDisplay] = useState([
		{
			amount: "",
			administrator: "",
			session: "",
		},
	]);
	const [members, setmembers] = useState([]);
	const [inter, setinter] = useState("");
	const [inter2, setinter2] = useState(0);

	const scrollY = React.useRef(new Animated.Value(0)).current;

	useEffect(() => {
		const loadFonts = async () => {
			await Font.loadAsync({
				poppinsBold: require("../../assets/fonts/poppins-bold.ttf"),
				poppinsMedium: require("../../assets/fonts/Poppins-Medium.otf"),
				PoppinsLight: require("../../assets/fonts/Poppins-Light.otf"),
			});
			setfontsLoaded(true);
		};
		loadFonts();

		var epargn = [];
		axiosNoTokenInstance
			.get("savings")
			.then((response) => {
				// console.log('donner recu',response.data)
				for (let obj of response.data) {
					epargn.push(obj);
				}
				setsaving(epargn);
			})
			.catch((error) => {
				console.log("voici l'erreur de chargement des epargnes", error);
			});

		var tempo = [];

		axiosNoTokenInstance
			.get("/sessions_")
			.then((response) => {
				for (let obj of response.data) {
					tempo.push(obj);
				}
				setsessionsElt(tempo);
			})
			.catch((error) => {
				console.log("voici l'erreur sur le chargement des sessions", error);
			});
	}, []);

	//requete vers l'API pour avoir le user correspondant
	useEffect(() => {
		axiosNoTokenInstance
			.get("/users")
			.then((response) => {
				var val = [];
				// console.log('donner recu',response.data)
				for (let obj of response.data) {
					if (password === obj.password && email === obj.email) {
						setuser(obj);
					}
					val.push(obj);
				}
				setusers(val);
			})
			.catch((error) => {
				console.log("voici l'erreur", error);
			});
	}, [password, email]);

	//requete pour avoir le username de l'utilisateur correspondant
	useEffect(() => {
		axiosNoTokenInstance
			.get("/administrators")
			.then((response) => {
				var val = [];
				//console.log('userr infos',user['url'])
				for (let temp of response.data) {
					val.push(temp);
				}
				setmembers(val);
			})
			.catch((error) => {
				console.log("voici l'erreur", error);
			});
	}, [user]);

	//recuperation du password et email
	useEffect(() => {
		setemail(auth.user.email);
		setPassword(auth.user.password);
	}, [auth.user.email, auth.user.password]);

	useEffect(() => {
		axiosNoTokenInstance
			.get("/members")
			.then((response) => {
				// console.log('userr infos-----------------------',users)
				for (let temp of response.data) {
					if (temp["username"] === user["id"]) {
						// console.log('--------------voici le membre-------------', temp)
						setmember(temp);
					}
				}
			})
			.catch((error) => {
				console.log("voici l'erreur", error);
			});
	}, [user]);

	const getNameMember = (membeId) => {
		// if (saving) {
		var obj = { name: "", avatar: "" };
		var name = "";
		var userId = "";
		for (let obj1 of members) {
			if (membeId === obj1.id) {
				/*
                                axiosNoTokenInstance.get(obj1.user_id, headerObj).then((response) => {
                                    obj.name = response.data['name'] + " " + response.data['first_name']
                                    obj.avatar = response.data['avatar']
                                    setinter(obj.name)
                                }).catch(error => console.log(error))
                */
				userId = obj1["username"];
				for (let obj2 of users) {
					if (userId === obj2["id"]) {
						name = obj2["name"] + " " + obj2["first_name"];
					}
				}

				//  console.log('************************obj*********************', inter)
				// obj.name = inter
			}
			//console.log('************************obj*********************', obj)

			// console.log('************************obj*********************', name)
			return name;
		}
	};

	const getDateSession = (sessionId) => {
		var resp = "";
		for (let obj of sessionsElt) {
			if (sessionId === obj["id"]) {
				resp = obj["date"];
				//  console.log('************************obj*********************', obj['date'])
			}
		}
		// console.log('************************obj*********************', resp)
		return resp;
	};

	useEffect(() => {
		var objet = [
			{
				amount: "",
				administrator: "",
				session: "",
			},
		];
		for (let obj of saving) {
			if (obj["member_id"] == member["id"]) {
				objet.push({
					amount: obj["amount"],
					administrator: getNameMember(obj["administrator_id"]),
					session: getDateSession(obj["session_id"]),
					id: obj["id"],
				});
			}
		}
		//  console.log('************************obj*********************', objet)
		setElementDisplay(objet);
	}, [sessionsElt, users, members, member["id"], user]);
	/*
    useEffect(() => {
        console.log('getDateSession*************************', ElementDisplay)
    }, [ElementDisplay]);
    */

	if (fontsLoaded) {
		return (
			<View style={styles.container}>
				<Animated.FlatList
					onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
					data={ElementDisplay.filter((elt) => elt.id !== undefined)}
					keyExtractor={(item) => item.id}
					renderItem={({ item, index }) => {
						//Normal Animation
						const inputRange = [-1, 0, (height * 0.1 + 15) * index, (height * 0.1 + 15) * (index + 3)];
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
									transform: [{ scale: scale }, { translateX: Offset }],
									opacity: opacity,
								}}
								key={`${item.id}` - { index }}
							>
								<Surface style={styles.surface}>
									<View>
										<Text style={{ fontFamily: "poppinsBold", fontSize: 16 }}>
											Epargne N {index + 1} {"\n"} Session du {item.session}
										</Text>
									</View>
									<View>
										<Text style={{ fontSize: 16, marginBottom: -5, marginLeft: 15, fontFamily: "poppinsMedium" }}>
											Administrateur :
											<Text style={{ fontFamily: "poppinsLight", fontSize: 13 }}> {item.administrator} </Text>
										</Text>
										<Text style={{ fontSize: 16, marginBottom: -5, marginLeft: 15, fontFamily: "poppinsMedium" }}>
											Montant :<Text style={{ fontFamily: "poppinsLight", fontSize: 13 }}> {item.amount} XAF</Text>
										</Text>
									</View>
								</Surface>
							</Animated.View>
						);
					}}
				/>
			</View>
		);
	} else {
		return false;
	}
}

export default BorrowingMember;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
	},
	surface: {
		height: height * 0.13,
		backgroundColor: "#FE7C00",
		width: Dimensions.get("window").width * 0.87,
		marginBottom: 10,
		padding: 2,
		paddingLeft: 15,
		marginHorizontal: 10,
		borderRadius: 8,
		flexDirection: "column",
	},
});
