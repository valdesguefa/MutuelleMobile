import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Animated, Dimensions } from "react-native";
import { Avatar, Surface } from "react-native-paper";

const { height } = Dimensions.get("screen");
import * as Font from "expo-font";
import headerObj from "../../shared/token";
import { LogBox } from "react-native";
import URL from "../../shared/URL";
import axiosNoTokenInstance from "../../utils/axiosNoTokenInstance";

const DetailsSession = () => {
	const [sessionInfo, setsessionInfo] = useState([
		{
			sessionId: "",
			saving: 0,
			refund: 0,
			borrow: 0,
		},
	]);
	const [borrowing, setborrowing] = useState([]);
	const [refund, setrefund] = useState([]);
	const [sessionsElt, setsessionsElt] = useState([]);
	const [fontsLoaded, setfontsLoaded] = useState(false);
	const [saving, setsaving] = useState([]);

	useEffect(() => {
		LogBox.ignoreLogs(["Animated: `useNativeDriver`"]);
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
			.get("/savings/")
			.then((response) => {
				// console.log('donner recu',response.data)
				for (let obj of response.data) {
					epargn.push(obj);
				}
				console.log("sessionInfo********************", epargn);
				setsaving(epargn);
			})
			.catch((error) => {
				console.log("voici l'erreur de chargement des epargnes", error);
			});

		var val5 = [];
		axiosNoTokenInstance
			.get("/borrowings/")
			.then((response) => {
				// console.log('donner recu',response.data)
				for (let obj of response.data) {
					val5.push(obj);
				}
				
				setborrowing(val5);
			})
			.catch((error) => {
				console.log("voici l'erreur", error);
			});
		//refund
		//borrowings/
		var val8 = [];
		axiosNoTokenInstance
			.get("/refunds/")
			.then((response) => {
				// console.log('donner recu refunds', response.data)
				for (let obj of response.data) {
					val8.push(obj);
				}
				setrefund(val8);
			})
			.catch((error) => {
				console.log("voici l'erreur", error);
			});

		var tempo = [];

		axiosNoTokenInstance
			.get("/sessions_/")
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

	useEffect(() => {
		var val = [];
		for (let obj of sessionsElt) {
			val.push({
				sessionId: obj,
				saving: 0,
				refund: 0,
				borrow: 0,
			});
		}

		setsessionInfo(val);
	}, [sessionsElt]);

	useEffect(() => {
		var valdo = sessionInfo;

		valdo.forEach((item) => {
			for (let obj of saving) {
				if (obj["session_id"] === item.sessionId["id"]) {
					item.saving = item.saving + obj["amount"];
				}
			}

			for (let obj1 of borrowing) {
				if (obj1["session_id"] === item.sessionId["id"]) {
					item.borrow = item.borrow + obj1["amount"];
				}
			}

			for (let obj2 of refund) {
				if (obj2["session_id"] === item.sessionId["id"]) {
					item.refund = item.refund + obj2["amount"];
				}
			}
		});
		setsessionInfo(valdo);
	}, [sessionInfo, refund, saving, borrowing]);
/*
	useEffect(() => {
		console.log("sessionInfo********************", sessionInfo);
	}, [sessionInfo]);
*/
	const scrollY = React.useRef(new Animated.Value(0)).current;

	if (fontsLoaded) {
		return (
			<View style={styles.container}>
				<Animated.FlatList
					onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
					data={sessionInfo}
					keyExtractor={(item) => item.sessionId["url"]}
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
								key={`${item.sessionId.url}-${index}`}
							>
								<Surface style={styles.surface}>
									<View>
										<Text style={{ fontFamily: "poppinsBold", fontSize: 16 }}>
											{index + 1} Session du {item.sessionId["date"]}
										</Text>
									</View>
									<View>
										<Text style={{ fontSize: 16, marginBottom: -5, marginLeft: 15, fontFamily: "poppinsMedium" }}>
											Total des épargnes :{" "}
											<Text style={{ fontFamily: "poppinsLight", fontSize: 15 }}>{item.saving} XAF</Text>
										</Text>
										<Text style={{ fontSize: 16, marginBottom: -5, marginLeft: 15, fontFamily: "poppinsMedium" }}>
											Total des remboursements :{" "}
											<Text style={{ fontFamily: "poppinsLight", fontSize: 15 }}>{item.refund} XAF</Text>
										</Text>
										<Text style={{ fontSize: 16, marginBottom: -5, marginLeft: 15, fontFamily: "poppinsMedium" }}>
											Total des emprunts :{" "}
											<Text style={{ fontFamily: "poppinsLight", fontSize: 15 }}>{item.borrow} XAF</Text>
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
};

export default DetailsSession;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
	},
	surface: {
		height: height * 0.16,
		backgroundColor: "#FE7C00",
		width: Dimensions.get("window").width * 0.85,
		marginBottom: 10,
		padding: 2,
		paddingLeft: 15,
		marginHorizontal: 10,
		borderRadius: 8,
		flexDirection: "column",
	},
});
