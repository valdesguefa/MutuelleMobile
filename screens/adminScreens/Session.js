import React, { useContext, useEffect, useState } from "react";
import { Text, View, StyleSheet, Animated, Dimensions, Alert, TouchableOpacity } from "react-native";
import { Avatar, Surface } from "react-native-paper";

const { height } = Dimensions.get("screen");
import * as Font from "expo-font";
import headerObj from "../../shared/token";
import { Modal, LogBox } from "react-native";
import URL from "../../shared/URL";
import axiosNoTokenInstance from "../../utils/axiosNoTokenInstance";
import axios from "axios";
import { Icon } from "react-native-elements";
import { globalStyles } from "../../styles/global";
import { Formik } from "formik";
import { useFocusEffect } from "@react-navigation/native";
import { TextInput, HelperText } from "react-native-paper";
import FlatButton from "../../shared/button";

import { AuthContext } from "../../contexts/AuthContext";

const Session = () => {
	// const [sessionInfo, setsessionInfo] = useState([
	// 	{
	// 		sessionId: "",
	// 		saving: 0,
	// 		refund: 0,
	// 		borrow: 0,
	// 	},
	// ]);

	// const [borrowing, setborrowing] = useState([]);
	// const [refund, setrefund] = useState([]);
	// const [sessionsElt, setsessionsElt] = useState([]);
	// const [fontsLoaded, setfontsLoaded] = useState(false);
	// const [saving, setsaving] = useState([]);
	// const [modalOpen, setModalOpen] = useState(false);
	// const [currentSessionsState, setCurrentSessionsState] = useState("");
	// const [exerciseExist, setExerciseExist] = useState(false);
	// const [date, setDate] = useState(new Date());
	// const [annee, setAnnee] = useState(new Date());
	// const { auth, dispatch } = useContext(AuthContext);
	// const [loading, setLoading] = useState(false);
	// const [currentSession, setCurrentSession] = useState(null);
	// const [currentExercise, setCurrentExercise] = useState(null);
	// const [isPlusSession, setIsPlusSession] = useState(false);
	// const [isBlurSession, setIsBlurSession] = useState(false);
	// const [isPlusExo, setIsPlusExo] = useState(false);
	// const [newSessions, setNewSessions] = useState(null);

	// const handleModalOpenning = () => {
	// 	if (isPlusSession) {
	// 		setModalOpen(true);
	// 	} else {
	// 		Alert.alert("ATTENTION!!", `Êtes-vous sûr(e) de vouloir cloturer la session? `, [
	// 			{
	// 				text: "OUI",
	// 				onPress: () => {
	// 					Alert.alert(
	// 						`Désolé, nous ne pouvons pas clôturer un exercice après seulement ${newSessions.length} sessions.`
	// 					);
	// 				},
	// 				// onPress: async () => {
	// 				// 	try {
	// 				// 		const res = await axiosNoTokenInstance.patch(`/sessions_/${currentSession.id}/`, {
	// 				// 			state: "END",
	// 				// 		});
	// 				// 	} catch (err) {
	// 				// 		console.log(err.message);
	// 				// 		console.log(err.response.data);
	// 				// 		console.log(err.response.status);
	// 				// 	}
	// 				// 	setIsPlusSession(!isPlusSession);
	// 				// },
	// 			},

	// 			{
	// 				text: "ANNULER",
	// 			},
	// 		]);
	// 	}
	// };

	// const handleCreateSession = async () => {
	// 	try {
	// 		let res = await axiosNoTokenInstance.post("/sessions_/", {
	// 			exercise_id: currentExercise.id,
	// 			administrator_id: auth.user.administrator_id,
	// 			create_at: date,
	// 			date: date,
	// 		});

	// 		setLoading(false);
	// 		setModalOpen(false);
	// 		Alert.alert("SUCCESS", "Une nouvelle session a ete commencer", [
	// 			{
	// 				text: "OKAY",
	// 			},
	// 		]);
	// 	} catch (err) {
	// 		console.log(err.message);
	// 		console.log(err.response.data);
	// 		console.log(err.response.status);
	// 	}
	// 	setIsPlusSession(!isPlusSession);
	// 	setModalOpen(false);
	// };

	// const setExerciseExistAndSessionState = async () => {
	// 	try {
	// 		let res = await axiosNoTokenInstance.get("/exercises/");
	// 		const newExercises = res.data;

	// 		res = await axiosNoTokenInstance.get("/sessions_/");
	// 		const newSessions = res.data;
	// 		setNewSessions(newSessions);

	// 		let currentExerciseI;
	// 		if (newExercises.length) {
	// 			currentExerciseI = newExercises[newExercises.length - 1];
	// 			setCurrentExercise(currentExerciseI);
	// 			if (currentExerciseI.active == 0) {
	// 				setIsPlusExo(true);
	// 				setIsBlurSession(true);
	// 			} else {
	// 				if (newSessions.length) {
	// 					let currentSessionI;
	// 					currentSessionI = newSessions[newSessions.length - 1];
	// 					setCurrentSession(currentSessionI);
	// 					if (currentSessionI.active == 0) setIsPlusSession(true);
	// 				} else {
	// 					setIsPlusSession(true);
	// 				}
	// 			}
	// 		} else {
	// 			setIsPlusExo(true);
	// 			setIsBlurSession(true);
	// 		}
	// 	} catch (err) {
	// 		console.log(err.message);
	// 		console.log(err.response.data);
	// 		console.log(err.response.status);
	// 	}
	// };
	// console.log("isPlusExo", isPlusExo);
	// const [showAnneeDP, setShowAnneeDP] = useState(false);
	// const [showDateDP, setShowDateDP] = useState(false);
	// // console.log("DATE:", date.toDateString());

	// const onDateChange = (event, selectedDate) => {
	// 	const currentDate = selectedDate || date;
	// 	setShowDateDP(Platform.OS === "ios");
	// 	setDate(currentDate);
	// };

	// console.log("currentExercise", currentExercise);
	// const onAnneeChange = (event, selectedDate) => {
	// 	const currentDate = selectedDate || date;
	// 	setShowAnneeDP(Platform.OS === "ios");
	// 	setAnnee(currentDate);
	// };

	// const getDate = (string) => {
	// 	return new Date(string);
	// };

	// useFocusEffect(
	// 	React.useCallback(() => {
	// 		setExerciseExistAndSessionState();

	// 		return () => {
	// 			// Do something when the screen is unfocused
	// 			// Useful for cleanup functions
	// 		};
	// 	})
	// );

	// useEffect(() => {
	// 	LogBox.ignoreLogs(["Animated: `useNativeDriver`"]);
	// 	// const loadFonts = async () => {
	// 	// 	await Font.loadAsync({
	// 	// 		poppinsBold: require("../../assets/fonts/poppins-bold.ttf"),
	// 	// 		poppinsMedium: require("../../assets/fonts/Poppins-Medium.otf"),
	// 	// 		PoppinsLight: require("../../assets/fonts/Poppins-Light.otf"),
	// 	// 	});
	// 	// 	setfontsLoaded(true);
	// 	// 	//	console.log('donner recu')
	// 	// };
	// 	// loadFonts();

	// 	var epargn = [];
	// 	axios
	// 		.get(URL + `savings/`, headerObj)
	// 		.then((response) => {
	// 			//   console.log('donner recu',response.data)
	// 			for (let obj of response.data) {
	// 				epargn.push(obj);
	// 			}
	// 			//console.log("chargement des epargnes", obj)
	// 			setsaving(epargn);
	// 		})
	// 		.catch((error) => {
	// 			console.log("voici l'erreur de chargement des epargnes", error);
	// 		});

	// 	var val5 = [];
	// 	axios
	// 		.get(URL + `borrowings/`, headerObj)
	// 		.then((response) => {
	// 			// console.log('donner recu',response.data)
	// 			for (let obj of response.data) {
	// 				val5.push(obj);
	// 			}
	// 			setborrowing(val5);
	// 		})
	// 		.catch((error) => {
	// 			console.log("voici l'erreur", error);
	// 		});
	// 	//refund
	// 	//borrowings/
	// 	var val8 = [];
	// 	axios
	// 		.get(URL + `refunds/`, headerObj)
	// 		.then((response) => {
	// 			// console.log('donner recu refunds', response.data)
	// 			for (let obj of response.data) {
	// 				val8.push(obj);
	// 			}
	// 			setrefund(val8);
	// 		})
	// 		.catch((error) => {
	// 			console.log("voici l'erreur", error);
	// 		});

	// 	var tempo = [];

	// 	axios
	// 		.get(URL + `sessions_/`, headerObj)
	// 		.then((response) => {
	// 			for (let obj of response.data) {
	// 				tempo.push(obj);
	// 			}
	// 			console.log("****************************", tempo);
	// 			setsessionsElt(tempo);
	// 		})
	// 		.catch((error) => {
	// 			console.log("voici l'erreur sur le chargement des sessions", error);
	// 		});
	// }, []);

	// useEffect(() => {
	// 	var val = [];
	// 	for (let obj of sessionsElt) {
	// 		val.push({
	// 			sessionId: obj,
	// 			saving: 0,
	// 			refund: 0,
	// 			borrow: 0,
	// 		});
	// 	}

	// 	setsessionInfo(val);
	// }, [sessionsElt]);

	// useEffect(() => {
	// 	var valdo = sessionInfo;

	// 	valdo.forEach((item) => {
	// 		for (let obj of saving) {
	// 			if (obj["session_id"] === item.sessionId["id"]) {
	// 				item.saving = item.saving + obj["amount"];
	// 			}
	// 		}

	// 		for (let obj1 of borrowing) {
	// 			if (obj1["session_id"] === item.sessionId["id"]) {
	// 				item.borrow = item.borrow + obj1["amount"];
	// 			}
	// 		}

	// 		for (let obj2 of refund) {
	// 			if (obj2["session_id"] === item.sessionId["id"]) {
	// 				item.refund = item.refund + obj2["amount"];
	// 			}
	// 		}
	// 	});
	// 	setsessionInfo(valdo);
	// }, [sessionInfo, refund, saving, borrowing]);

	// useEffect(() => {
	// 	console.log("sessionInfo", sessionInfo);
	// }, [sessionInfo]);

	// const scrollY = React.useRef(new Animated.Value(0)).current;

	// if (fontsLoaded) {
	return (
		// <View style={styles.container}>
		// 	<Modal visible={modalOpen} animationType="slide">
		// 		<View style={globalStyles.container}>
		// 			<Icon name="close" onPress={() => setModalOpen(false)} />
		// 			<Formik
		// 				// validationSchema={helpTypeCreateSchema}
		// 				initialValues={{
		// 					annee: currentExercise ? getDate(currentExercise.create_at).getFullYear().toString() : null,
		// 					date: date.toDateString(),
		// 				}}
		// 				onSubmit={(values) => {
		// 					handleCreateSession(values);
		// 					// handlePress();
		// 				}}
		// 			>
		// 				{(props) => (
		// 					<View
		// 						style={{
		// 							// paddingVertical: 20,
		// 							flex: 1,
		// 							opacity: 1,
		// 							marginTop: 120,
		// 							borderBottomWidth: 1,
		// 							borderBottomColor: "#222",
		// 							borderTopColor: "#222",
		// 							borderTopWidth: 1,
		// 							justifyContent: "center",
		// 							marginBottom: 120,
		// 						}}
		// 					>
		// 						<View style={{ flexDirection: "row", alignItems: "center" }}>
		// 							<TextInput
		// 								label="Annee de l'exercice"
		// 								mode="outlined"
		// 								disabled
		// 								style={{ flex: 3, marginRight: 20 }}
		// 								value={annee.getFullYear().toString()}
		// 								theme={{ colors: { disabled: "#ff751a" } }}
		// 							/>
		// 							<Icon
		// 								name="calendar"
		// 								size={50}
		// 								type="foundation"
		// 								color="#ff751a"
		// 								// onPress={}
		// 								// () => setShowAnneeDP(true)
		// 							/>
		// 						</View>

		// 						<HelperText type="error" visible={true}></HelperText>

		// 						<View style={{ flexDirection: "row", alignItems: "center" }}>
		// 							<TextInput
		// 								label="Date date de début de la session"
		// 								mode="outlined"
		// 								disabled
		// 								style={{ flex: 3, marginRight: 20 }}
		// 								value={date.toDateString()}
		// 								theme={{ colors: { disabled: "#ff751a" } }}
		// 							/>
		// 							<Icon
		// 								name="calendar"
		// 								size={50}
		// 								type="foundation"
		// 								color="#ff751a"
		// 								onPress={() => setShowDateDP(true)}
		// 							/>
		// 						</View>
		// 						<HelperText type="error" visible={true}></HelperText>
		// 						{showDateDP && (
		// 							<DateTimePicker
		// 								testID="dateTimePicker"
		// 								value={date}
		// 								mode="date"
		// 								is24Hour={true}
		// 								display="default"
		// 								onChange={onDateChange}
		// 							/>
		// 						)}
		// 						<FlatButton
		// 							text={loading ? "loading..." : "Commencer une nouvelle session"}
		// 							onPress={() => {
		// 								setLoading(true);
		// 								props.handleSubmit();
		// 							}}
		// 							color="black"
		// 						/>
		// 					</View>
		// 				)}
		// 			</Formik>
		// 		</View>
		// 	</Modal>

		// 	<Animated.FlatList
		// 		onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
		// 		data={sessionInfo}
		// 		keyExtractor={(item) => item.sessionId["id"]}
		// 		renderItem={({ item, index }) => {
		// 			//Normal Animation
		// 			const inputRange = [-1, 0, (height * 0.1 + 15) * index, (height * 0.1 + 15) * (index + 3)];
		// 			const scale = 1;
		// 			const opacity = scrollY.interpolate({
		// 				inputRange,
		// 				outputRange: [1, 1, 1, 0],
		// 			});
		// 			const Offset = scrollY.interpolate({
		// 				inputRange,
		// 				outputRange: [0, 0, 0, 500],
		// 			});

		// 			return (
		// 				<Animated.View
		// 					style={{
		// 						transform: [{ scale: scale }, { translateX: Offset }],
		// 						opacity: opacity,
		// 					}}
		// 					key={index}
		// 				>
		// 					<Surface style={styles.surface}>
		// 						<View>
		// 							<Text style={{ fontFamily: "poppinsBold", fontSize: 16, color: "black" }} numberOfLines={1}>
		// 								{/* {index + 1}  Session du */} {item.sessionId["date"]}
		// 							</Text>
		// 						</View>
		// 						<View>
		// 							<Text style={{ fontSize: 13, marginBottom: -5, marginLeft: 15, fontFamily: "poppinsMedium" }}>
		// 								Total des épargnes :{" "}
		// 								<Text style={{ fontFamily: "poppinsLight", fontSize: 15 }}>{item.saving} XAF</Text>
		// 							</Text>
		// 							<Text style={{ fontSize: 13, marginBottom: -5, marginLeft: 15, fontFamily: "poppinsMedium" }}>
		// 								Total des remboursements :{" "}
		// 								<Text style={{ fontFamily: "poppinsLight", fontSize: 15 }}>{item.refund} XAF</Text>
		// 							</Text>
		// 							<Text style={{ fontSize: 13, marginBottom: -5, marginLeft: 15, fontFamily: "poppinsMedium" }}>
		// 								Total des emprunts :{" "}
		// 								<Text style={{ fontFamily: "poppinsLight", fontSize: 15 }}>{item.borrow} XAF</Text>
		// 							</Text>
		// 						</View>
		// 					</Surface>
		// 				</Animated.View>
		// 			);
		// 		}}
		// 	/>
		// 	<Icon
		// 		name={isPlusSession ? "add-circle" : "cancel"}
		// 		size={70}
		// 		disabled={isBlurSession ? true : false}
		// 		color={isBlurSession ? "#bbb" : "#ff884b"}
		// 		containerStyle={{ position: "absolute", bottom: 10, right: 10 }}
		// 		onPress={handleModalOpenning}
		// 	/>
		// </View>
		null
	);
	// } else {
	// 	return false;
	// }
};

export default Session;

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		justifyContent: "center",
// 		marginTop: Dimensions.get("window").height * 0.02,
// 		alignSelf: "center",
// 	},
// 	surface: {
// 		height: 110,
// 		backgroundColor: "white",
// 		width: Dimensions.get("window").width * 0.85,
// 		marginBottom: 10,
// 		padding: 2,
// 		paddingLeft: 15,
// 		marginHorizontal: 10,
// 		borderRadius: 8,
// 		flexDirection: "column",
// 	},
// });
