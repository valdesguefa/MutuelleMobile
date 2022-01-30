import React, { useEffect, useState } from "react";
import {
	TouchableOpacity,
	Linking,
	Platform,
	ScrollView,
	Dimensions,
	StatusBar,
	Image,
	ImageBackground,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { Avatar, Icon } from "react-native-elements";
import * as Animatable from "react-native-animatable";
import * as Font from "expo-font";
import axios from "axios";
import headerObj from "../../shared/token";
import URL from "../../shared/URL";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

export default function UserProfileAdmin(props) {
	const [user, setuser] = useState({});
	const [fontsLoaded, setfontsLoaded] = useState(false);
	const [password, setPassword] = useState("");
	const [email, setemail] = useState("");
	const [users, setusers] = useState([]);
	const [members, setmembers] = useState([]);
	const [member, setmember] = useState({});

	const { auth } = useContext(AuthContext);

	//recuperation du password et email
	useEffect(() => {
		setemail(auth.user.email);
		setPassword(auth.user.password);
	}, []);
	// }, [props.Email, props.password]);
	//requete vers l'API pour avoir le user correspondant
	useEffect(() => {
		axios
			.get(URL + `users/`, headerObj)
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
		axios
			.get(URL + `administrators/`, headerObj)
			.then((response) => {
				var val = [];
				//console.log('userr infos',user['url'])
				for (let temp of response.data) {
					// if (temp["user_id"] === user["url"]) {
					if (temp["username"] === user["id"]) {
						//console.log('--------------voici le membre-------------',temp)
						setmember(temp);
					}
					val.push(temp);
				}
				setmembers(val);
			})
			.catch((error) => {
				console.log("voici l'erreur", error);
			});
	}, [user]);

	async function loadFonts() {
		await Font.loadAsync({
			// Load a font `Montserrat` from a static resource
			poppinsBold: require("../../assets/fonts/poppins-bold.ttf"),
		});
		setfontsLoaded(true);
	}

	useEffect(() => {
		loadFonts();
	}, []);

	if (fontsLoaded) {
		return (
			<View>
				<View style={styles.header}>
					<ImageBackground
						style={styles.headerBackgroundImage}
						blurRadius={5}
						source={{ uri: user["avatar"] }}
						resizeMode="cover"
					>
						<View style={styles.headerColumn}>
							<Animatable.Image
								animation="bounceIn"
								duraton="2500"
								style={styles.userImage}
								source={{ uri: user["avatar"] }}
							/>
							<Text style={styles.userNameText}>
								{user["name"]} {user["first_name"]}
							</Text>

							<View style={styles.userAddressRow}>
								<View>
									<Icon name="place" underlayColor="transparent" iconStyle={styles.placeIcon} />
								</View>
								<View style={styles.userCityRow}>
									<Text style={styles.userCityText}>{user["address"]}, Cameroun</Text>
								</View>
							</View>
						</View>
					</ImageBackground>
				</View>
				<Animatable.View style={styles.footer} animation="fadeInUpBig">
					<View style={{ flexDirection: "row" }}>
						<Text
							style={{
								color: "#474241",
								fontSize: 28,
								fontWeight: "bold",
								paddingBottom: 15,
							}}
						>
							Profil{" "}
						</Text>
						<Icon
							style={{ paddingRight: Dimensions.get("screen").width * 0.02, paddingTop: 3 }}
							name="create"
							color="black"
							size={30}
						/>
					</View>

					<View>
						<Text style={styles.text}>
							<Text style={{ fontSize: 16, color: "black" }}>Pseudo:</Text> {member["username"]}
						</Text>
						<Text style={styles.text}>
							<Text style={{ fontSize: 16, color: "black" }}>Sexe:</Text> {user.sex} (M:homme, F:femme)
						</Text>
						<Text style={styles.text}>
							<Text style={{ fontSize: 16, color: "black" }}>Email:</Text> {user.email}
						</Text>
						<Text style={styles.text}>
							<Text style={{ fontSize: 16, color: "black" }}>Telephone:</Text> {user.tel}{" "}
						</Text>
						<Text style={styles.text}>
							<Text style={{ fontSize: 16, color: "black" }}>Adresse:</Text> {user.address}
						</Text>
						<Text style={styles.text}>
							<Text style={{ fontSize: 16, color: "black" }}>Date d'inscription:</Text> {user.create_at}
						</Text>
					</View>
				</Animatable.View>
			</View>
		);
	} else {
		return null;
	}
}

const { height } = Dimensions.get("screen");
const height_logo = height * 0.28;
const heightHeader = Dimensions.get("screen").height * 0.7;

const styles = StyleSheet.create({
	text: {
		color: "white",
		fontFamily: "poppinsBold",
		marginLeft: Dimensions.get("screen").width * 0.2,
		paddingBottom: 5,
		fontSize: 14,
	},
	userImage: {
		borderColor: "#dcecf2",
		borderRadius: 120,
		borderWidth: 3,
		height: 250,
		marginTop: 55,
		marginBottom: 15,
		width: 250,
	},
	headerColumn: {
		backgroundColor: "transparent",
		...Platform.select({
			ios: {
				alignItems: "center",
				elevation: 1,
				marginTop: -1,
			},
			android: {
				alignItems: "center",
			},
		}),
	},
	headerBackgroundImage: {
		flex: 1,
		height: Dimensions.get("screen").height * 2.5,
		width: Dimensions.get("screen").width * 1,
		marginTop: -10,
		// marginBottom:-20
	},
	userCityText: {
		color: "#A5A5A5",
		fontSize: 20,
		fontWeight: "600",
		textAlign: "center",
	},
	userCityRow: {
		backgroundColor: "transparent",
	},
	placeIcon: {
		color: "white",
		fontSize: 26,
	},
	userAddressRow: {
		alignItems: "center",
		flexDirection: "row",
	},
	userNameText: {
		color: "#FFF",
		fontSize: 30,
		fontWeight: "bold",
		paddingBottom: 8,
		textAlign: "center",
	},
	container: {
		flex: 1,
	},
	header: {
		flex: 3,
		justifyContent: "center",
		alignItems: "center",
		height: Dimensions.get("screen").height * 0.5,
	},
	footer: {
		flex: 2,
		backgroundColor: "#FE7C00",
		width: Dimensions.get("screen").width * 1,
		borderTopRightRadius: 50,
		borderTopLeftRadius: 50,
		alignSelf: "center",
		marginBottom: -10,
		paddingHorizontal: 30,
		paddingVertical: 30,
	},
});
