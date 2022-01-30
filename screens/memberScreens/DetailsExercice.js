import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import DropDownItem from "react-native-drop-down-item";
import headerObj from "../../shared/token";
import URL from "../../shared/URL";
import * as Font from "expo-font";
import DropDownPicker from "react-native-dropdown-picker";
import { LogBox } from "react-native";
import { Avatar, Button, Card, Title, Paragraph } from "react-native-paper";
import axiosNoTokenInstance from "../../utils/axiosNoTokenInstance";

const IC_ARR_DOWN = require("../../assets/double_down_26px.png");
const IC_ARR_UP = require("../../assets/double_up_26px.png");

const DetailsExercice = (props) => {
	const [email, setemail] = useState("");
	const [password, setpassword] = useState("");
	const [member, setmember] = useState({});
	const [user, setuser] = useState({});
	const [exercises, setexercises] = useState([
		{
			exercice: {},
			sessions: [],
		},
	]);
	const [sessionsElt, setsessionsElt] = useState([]);
	const [fontsLoaded, setfontsLoaded] = useState(false);
	// const [epargne, setepargne] = useState(0);
	const [borrowing, setborrowing] = useState([]);
	const [rembourse, setrembourse] = useState(0);
	const [saving, setsaving] = useState([]);
	const [AllExecises, setAllExecises] = useState([]);
	const [refund, setrefund] = useState([]);
	const [style1, setstyle1] = useState(Dimensions.get("window").height * 0.25);
	const [style2, setstyle2] = useState(Dimensions.get("window").height * 0.3);

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
			.get("/savings")
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

		var val = [];
		var val6 = [];
		axiosNoTokenInstance
			.get("/exercises")
			.then((response) => {
				// console.log('donner recu',response.data)
				for (let obj of response.data) {
					val.push({
						exercice: obj,
						sessions: [{}],
					});
					val6.push(obj);
				}
				setexercises(val);
				setAllExecises(val6);
			})
			.catch((error) => {
				console.log("voici l'erreur", error);
			});

		//borrowings/
		var val5 = [];
		axiosNoTokenInstance
			.get("/borrowings")
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
			.get("/refunds")
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

	useEffect(() => {
		var val1 = [];
		var val2 = exercises;
		/*  
           for (var j = 0; j < val2.length; j++) {
               val2[j].sessions.splice(0, val2[j].sessions.length)
           }
           */
		var val = [];

		var val3 = exercises;
		var i = 0;
		//  if (exercises[0].sessions.length === 0) {
		sessionsElt.forEach((item) => {
			i = 0;
			for (let obj of val2) {
				if (obj.exercice.url === item["exercise_id"]) {
					obj.sessions.push(item);
					val3[i].sessions = getUniqueListBy(obj.sessions, "url");
					setexercises(val3);
				}
				i = i + 1;
			}
		});
		//}
		//  setexercises(val1)
	}, [sessionsElt, exercises]);

	function getUniqueListBy(array, key) {
		return array.reduce((arr, item) => {
			const removed = arr.filter((i) => i[key] !== item[key]);
			return [...removed, item];
		}, []);
	}

	/*      useEffect(() => {
              console.log('voici le resultat attendu', exercises);
          }, [exercises]);
      */

	useEffect(() => {
		setemail(props.Email);
		setpassword(props.password);
	}, [props]);

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
				}
			})
			.catch((error) => {
				console.log("voici l'erreur", error);
			});
	}, [password, email]);

	//requete pour avoir le username de l'utilisateur correspondant
	useEffect(() => {
		axiosNoTokenInstance
			.get("/members")
			.then((response) => {
				//console.log('userr infos',user['url'])
				for (let temp of response.data) {
					if (temp["user_id"] === user["url"]) {
						setmember(temp);
					}
				}
			})
			.catch((error) => {
				console.log("voici l'erreur", error);
			});
	}, [user]);

	const getEpargne = (sessionParam) => {
		//var uniqueLis

		// console.log('sessionParam',saving)
		// console.log('member.url',member.url)
		var epargne = 0;
		for (let obj4 of saving) {
			for (let obj of sessionParam) {
				if (obj.url == obj4["session_id"] && obj4["member_id"] == member.url) {
					//   console.log('jsuis la',obj4)
					epargne = epargne + obj4["amount"];
				}
			}
		}
		// console.log('voici les epargnes', epargne)
		return epargne;
	};

	const getborrowing = (sessionParam) => {
		var borrow = 0;
		//console.log('borrowing',borrowing)
		for (let obj4 of borrowing) {
			for (let obj of sessionParam) {
				if (obj.url === obj4["session_id"] && obj4["member_id"] === member.url) {
					borrow = borrow + obj4["amount"];
				}
			}
		}
		return borrow;
	};

	const getInterest = (sessionParam) => {
		var interest = 0;
		//console.log('borrowing',borrowing)
		for (let obj4 of borrowing) {
			for (let obj of sessionParam) {
				if (obj.url === obj4["session_id"] && obj4["member_id"] === member.url) {
					interest = interest + (obj4["amount"] * obj4["interest"]) / 100;
				}
			}
		}
		return interest;
	};

	const getrefund = (sessionParam) => {
		var refundAmount = 0;
		var tempo = {};
		// console.log('borrowing',refund)
		for (let obj4 of refund) {
			//  console.log('refund',obj4)
			for (let obj of borrowing) {
				if (obj["url"] == obj4["borrowing_id"]) {
					tempo = obj;
				}
			}

			for (let obj2 of sessionParam) {
				if (obj2.url === obj4["session_id"] && tempo["member_id"] === member.url) {
					refundAmount = refundAmount + obj4["amount"];
					console.log("refundAmount", refundAmount);
				}
			}
		}
		return refundAmount;
	};

	const getTotal = (sessionParam) => {
		var total = 0;
		total = getEpargne(sessionParam) - getborrowing(sessionParam) + getrefund(sessionParam) + getInterest(sessionParam);
		return total;
	};

	const getStyle = (param) => {
		var valdo = style1;
		var valdo2 = style2;
		if (param.exercice.active !== 1) {
			return valdo;
		} else {
			return valdo2;
		}
	};
	if (fontsLoaded) {
		return (
			<View style={styles.container}>
				<ScrollView style={{ alignSelf: "stretch" }}>
					<View style={{ height: Dimensions.get("window").height }}>
						{exercises
							? exercises.map((param, index) => {
									return (
										<View
											key={index}
											style={{
												backgroundColor: "orange",
												marginBottom: 40,
												width: Dimensions.get("window").width * 0.87,
												paddingLeft: 30,
												height: getStyle(param),
												borderRadius: 20,
											}}
										>
											{param.exercice.active === 1 ? (
												<View>
													<Text
														style={{
															fontSize: 18,
															fontFamily: "poppinsBold",
															color: "blue",
														}}
														numberOfLines={2}
													>
														Exercice de l'année : {param.exercice["year"]} {"\n"}
														<Text style={{ color: "red" }}>(En cours)</Text>
													</Text>
												</View>
											) : (
												<View>
													<Text
														style={{
															fontSize: 19,
															fontFamily: "poppinsBold",
															color: "blue",
														}}
													>
														Exercice de l'année : {param.exercice["year"]}
													</Text>
												</View>
											)}

											<View>
												<Text
													style={{
														fontSize: 17,
														fontFamily: "poppinsMedium",
														color: "black",
													}}
												>
													Montant épargné : <Text style={styles.text}>{getEpargne(param.sessions)} XAF</Text>
												</Text>

												<Text
													style={{
														fontSize: 17,
														fontFamily: "poppinsMedium",
														color: "black",
													}}
												>
													Montant emprunté : <Text style={styles.text}>{getborrowing(param.sessions)} XAF</Text>
												</Text>

												<Text
													style={{
														fontSize: 17,
														fontFamily: "poppinsMedium",
														color: "black",
													}}
												>
													Montant remboursé : <Text style={styles.text}>{getrefund(param.sessions)} XAF</Text>
												</Text>

												<Text
													style={{
														fontSize: 17,
														fontFamily: "poppinsMedium",
														color: "black",
													}}
												>
													Intérêt : <Text style={styles.text}>{getInterest(param.sessions)} XAF</Text>
												</Text>

												{param.exercice.active !== 1 ? (
													<Text style={{ fontFamily: "poppinsBold", fontSize: 19 }}>
														Total obtenu : {getTotal(param.sessions)} XAF
													</Text>
												) : (
													<Text style={{ fontFamily: "poppinsBold", fontSize: 19 }}>Total obtenu : ####</Text>
												)}
											</View>
										</View>
									);
							  })
							: null}
						<View style={{ height: Dimensions.get("window").height * 0.85 }} />
					</View>
				</ScrollView>
			</View>
		);
	} else {
		return false;
	}
};

export default DetailsExercice;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 10,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "white",
	},
	dropDownItem: {
		top: Dimensions.get("window").height * 0.2,
		backgroundColor: "orange",
		width: Dimensions.get("window").width * 0.87,
		marginBottom: 20,
		paddingLeft: 20,
		borderRadius: 20,
		marginLeft: 10,
		marginRight: 10,
	},
	text: {
		fontFamily: "PoppinsLight",
		fontSize: 17,
	},
});
