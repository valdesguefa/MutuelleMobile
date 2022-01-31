import React, { useContext, useEffect, useState } from "react";
import { Alert, Modal, StyleSheet, Text, View } from "react-native";
import { Button, Card, Icon } from "react-native-elements";
import { AuthContext } from "../../contexts/AuthContext";
import { ConfigContext } from "../../contexts/configContext";
import { MemberContext } from "../../contexts/memberContext";
import { UserContext } from "../../contexts/userContext";
import FlatButton from "../../shared/button";
import { globalStyles } from "../../styles/global";
import axiosNoTokenInstance from "../../utils/axiosNoTokenInstance";
import * as yup from "yup";
import { Formik } from "formik";
import { TextInput, HelperText } from "react-native-paper";
import { ExerciseContext } from "../../contexts/exerciseContext";
import { SessionContext } from "../../contexts/sessionContext";
import { SavingContext } from "../../contexts/savingContext";
import { RefundContext } from "../../contexts/refundContext";
import { BorrowingContext } from "../../contexts/borrowingContext";
import { HelpContext } from "../../contexts/helpContext";
import DateTimePicker from "@react-native-community/datetimepicker";

// const helpTypeCreateSchema = yup.object({
// 	annee: yup
// 		.string()
// 		.required("un l'annee doit etre preciser")
// 		.test("isValidNumber", "annee invalid", (val) => parseInt(val) > 0),
// });

export default function Accueil() {
	const { auth, dispatch } = useContext(AuthContext);
	const { members, memberDispatch } = useContext(MemberContext);
	const { configs, configDispatch } = useContext(ConfigContext);
	const { users, userDispatch } = useContext(UserContext);
	const { exercises, exerciseDispatch } = useContext(ExerciseContext);
	const { sessions, sessionDispatch } = useContext(SessionContext);
	const { savings, savingDispatch } = useContext(SavingContext);
	const { refunds, refundDispatch } = useContext(RefundContext);
	const { helps, helpDispatch } = useContext(HelpContext);
	const { borrowings, borrowingDispatch } = useContext(BorrowingContext);
	const [modalOpen, setModalOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [tresorie, setTresorie] = useState(0);

	// eparges;
	console.log("AUTH:", auth);
	// console.log("EXERCISES:", exercises);
	// console.log("USERS:", users);

	const currenDate = new Date();

	let prePhase;
	let nextPhase;

	if (auth.state == "SAVING") {
		prePhase == "";
		nextPhase == "remboursements";
	}
	if (auth.state == "REFUND") {
		prePhase == "epargnes";
		nextPhase == "emprunts";
	}
	if (auth.state == "BORROWING") {
		prePhase == "refunds";
		nextPhase == "terminer";
	}
	if (auth.state == "END") {
		prePhase == "";
		nextPhase == "commencer";
	}

	let membersWithCrown = members.filter((member) => member.social_crown == 1);
	let part1 = members.length * configs.inscription_per_member;
	let part2 = membersWithCrown.length * configs.social_funds_per_member;
	let fondSocial = part1 + part2;

	useEffect(() => {
		savings.forEach((saving) => {
			tresorie += saving.amount;
		});
		refunds.forEach((refund) => {
			tresorie += refund.amount;
		});
		borrowings.forEach((borrowing) => {
			tresorie += borrowing.amount;
		});
	}, [savings, refunds, borrowings]);

	useEffect(() => {
		const setPhaseState = async () => {
			const result = await axiosNoTokenInstance.get("/sessions_");
			console.log("SESSIONS:", result.data);
			if (result.data.length > 0) {
				const theSession = result.data[result.data.length - 1];
				dispatch({
					type: "UPDATE_AUTH",
					payload: theSession.state,
					prop: "state",
				});
			}
		};

		setPhaseState();

		//set members to context
		const membersGotten = users.filter((user) => user.type == "member");
		memberDispatch({ type: "INITIALIZE_MEMBERS", payload: membersGotten });
		let membersToModify = membersGotten;
		// Add to members info from members table
		const addMoreToMembers = async () => {
			for (let i = 1; i <= membersGotten.length; i++) {
				let gottenObj = await axiosNoTokenInstance.get(`/members/${i}`);
				gottenObj = gottenObj.data;
				// console.log("GOTTENOBJ:", gottenObj);
				membersToModify.forEach((member) => {
					if (member.id == gottenObj.user_id) {
						member.username = gottenObj.username;
						member.social_crown = gottenObj.social_crown;
						member.inscription = gottenObj.inscription;
						member.administrator_id = gottenObj.administrator_id;
					}
				});
			}
			//Add to auth more info

			// console.log("MEMBERSTOMODIFY:", membersToModify);
			memberDispatch({ type: "INITIALIZE_MEMBERS", payload: membersToModify });
		};

		const addMoreToAuth = async () => {
			let gottenObj = await axiosNoTokenInstance.get(`/administrators/${auth.user.id}`);
			dispatch({
				type: "UPDATE_AUTH",
				prop: "administrator_id",
				payload: gottenObj.data.id,
			});
		};

		addMoreToAuth();

		addMoreToMembers();

		const loadAdmin = async () => {
			try {
				const res = await axiosNoTokenInstance.get("/administrators");
				// console.log("RES:", res.data);
				const theAdmin = res.data.filter((admin) => admin.user_id == auth.user.id);

				dispatch({
					type: "UPDATE_AUTH",
					payload: theAdmin[0].id,
					prop: "administrator_id",
				});
				if (theAdmin[0].root == 1) {
					dispatch({
						type: "UPDATE_AUTH",
						payload: true,
						prop: "permissions",
					});
				} else {
					dispatch({
						type: "UPDATE_AUTH",
						payload: false,
						prop: "permissions",
					});
				}
			} catch (err) {
				console.log(err.message);
				console.log(err.response.data);
				console.log(err.response.status);
			}
		};
		loadAdmin();
	}, []);

	const handleCreateExercise = async (annee, value) => {
		try {
			const res = await axiosNoTokenInstance.post("/exercises/", {
				year: currenDate.getFullYear(),
				administrator_id: auth.administrator_id,
			});
			// console.log("RESULT:", res.data.user);
			exerciseDispatch({
				type: "ADD_EXERCISE",
				payload: res.data,
			});
			dispatch({
				type: "UPDATE_AUTH",
				payload: res.data.id,
				prop: "exercise_id",
			});

			const res2 = await axiosNoTokenInstance.post("/sessions_/", {
				exercise_id: res.data.id,
				administrator_id: auth.administrator_id,
				state: "SAVING",
			});

			sessionDispatch({
				type: "ADD_SESSION",
				payload: res2.data,
			});
			dispatch({
				type: "UPDATE_AUTH",
				payload: res2.data.id,
				prop: "session_id",
			});
			dispatch({
				type: "UPDATE_AUTH",
				payload: res2.data.state,
				prop: "state",
			});
			setLoading(false);
			setModalOpen(false);
			Alert.alert("SUCCESS", "Une nouvelle session et exercise vien de commencer", [
				{
					text: "OKAY",
				},
			]);
		} catch (err) {
			console.log(err.response.data);
			console.log(err.message);
			console.log(err.response.data);
			console.log(err.response.status);
		}
	};

	const [date, setDate] = useState(new Date());
	const [mode, setMode] = useState("date");
	const [show, setShow] = useState(false);
	console.log("DATE:", date.toDateString());

	const onChange = (event, selectedDate) => {
		const currentDate = selectedDate || date;
		setShow(Platform.OS === "ios");
		setDate(currentDate);
	};

	const showMode = (currentMode) => {
		setShow(true);
		setMode(currentMode);
	};

	const showDatepicker = () => {
		showMode("date");
	};

	const showTimepicker = () => {
		showMode("time");
	};

	return exercises.length ? (
		<View style={globalStyles.container}>
			<View style={{ display: "flex", flexDirection: "row", justifyContent: "center", marginBottom: 20 }}>
				<Card containerStyle={{ borderRadius: 10, width: 150 }}>
					<Card.Title>Tresorie</Card.Title>
					<Card.Divider />
					<View style={{ alignItems: "center" }}>
						<Text>{`${tresorie} XAF`}</Text>
					</View>
				</Card>
				<Card containerStyle={{ borderRadius: 10, width: 150 }}>
					<Card.Title>Fond social</Card.Title>
					<Card.Divider />
					<View style={{ alignItems: "center" }}>
						<Text>{`${fondSocial} XAF`}</Text>
					</View>
				</Card>
			</View>

			<Card containerStyle={{ borderRadius: 10, marginBottom: 20 }}>
				<Card.Title>PHASE ACTIVE</Card.Title>
				<Card.Divider />
				<View style={{ alignItems: "center" }}>
					<Text style={{ marginBottom: 10 }}>{`PHASE DE ${auth.state}`}</Text>
					<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
						<Button
							title={`${prePhase}`}
							buttonStyle={{
								backgroundColor: "#ff751a",
								borderColor: "transparent",
								borderRadius: 5,
							}}
							onPress={() => {
								handlePrePhase();
							}}
						/>
						<Button
							title={`${nextPhase}`}
							buttonStyle={{
								backgroundColor: "#ff751a",
								borderColor: "transparent",
								borderRadius: 5,
							}}
							onPress={() => {
								handleNextPhase();
							}}
						/>
					</View>
				</View>
			</Card>

			<Card containerStyle={{ borderRadius: 10 }}>
				<Card.Title>Evenements de la mutuelle</Card.Title>
				<Card.Divider />
				{/* <View style={{ alignItems: "center" }}>
					{helps.length && <Text style={{ marginBottom: 10 }}>Aucune aide active</Text>}
					<Button
						title={helps.lenght ? "Consulter les aides disponible" : ""}
						buttonStyle={{
							backgroundColor: "#ff751a",
							borderColor: "transparent",
							borderRadius: 5,
						}}
					/>
				</View> */}
			</Card>
		</View>
	) : (
		<View style={globalStyles.container}>
			<Modal visible={modalOpen} animationType="slide">
				<View style={globalStyles.container}>
					<Icon name="close" onPress={() => setModalOpen(false)} />
					<Formik
						// validationSchema={helpTypeCreateSchema}
						initialValues={{
							annee: currenDate.getFullYear().toString(),
							date: currenDate.toDateString(),
						}}
						onSubmit={(values) => {
							handleCreateExercise(values.annee, values.date);
							// handlePress();
						}}
					>
						{(props) => (
							<View
								style={{
									// paddingVertical: 20,
									flex: 1,
									opacity: 1,
									marginTop: 120,
									borderBottomWidth: 1,
									borderBottomColor: "#222",
									borderTopColor: "#222",
									borderTopWidth: 1,
									justifyContent: "center",
									marginBottom: 120,
								}}
							>
								<View style={{ flexDirection: "row", alignItems: "center" }}>
									<TextInput
										label="Annee de l'exercice"
										mode="outlined"
										disabled
										style={{ flex: 3, marginRight: 20 }}
										value={props.values.annee}
										theme={{ colors: { disabled: "#ff751a" } }}
									/>
									<Icon name="calendar" size={50} type="foundation" color="#ff751a" onPress={showDatepicker} />
								</View>
								<HelperText type="error" visible={true}></HelperText>

								<View style={{ flexDirection: "row", alignItems: "center" }}>
									<TextInput
										label="Date de la rencontre de la premiere session"
										mode="outlined"
										disabled
										style={{ flex: 3, marginRight: 20 }}
										value={props.values.date}
										theme={{ colors: { disabled: "#ff751a" } }}
									/>
									<Icon name="calendar" size={50} type="foundation" color="#ff751a" onPress={showDatepicker} />
								</View>
								<HelperText type="error" visible={true}></HelperText>

								<FlatButton
									text={loading ? "loading..." : "Commencer premiere exercice"}
									onPress={() => {
										setLoading(true);
										props.handleSubmit();
									}}
									color="black"
								/>
							</View>
						)}
					</Formik>
				</View>
			</Modal>
			<View style={{ display: "flex", flexDirection: "row", justifyContent: "center", marginBottom: 20 }}>
				<Card containerStyle={{ borderRadius: 10, width: 150 }}>
					<Card.Title>Tresorie</Card.Title>
					<Card.Divider />
					<View style={{ alignItems: "center" }}>
						<Text>{`${tresorie} XAF`}</Text>
					</View>
				</Card>
				<Card containerStyle={{ borderRadius: 10, width: 150 }}>
					<Card.Title>Fond social</Card.Title>
					<Card.Divider />
					<View style={{ alignItems: "center" }}>
						<Text>{`${fondSocial} XAF`}</Text>
					</View>
				</Card>
			</View>

			<Card containerStyle={{ borderRadius: 10, marginBottom: 20 }}>
				<Card.Title>Exrcice</Card.Title>
				<Card.Divider />
				<View style={{ alignItems: "center" }}>
					<Text style={{ marginBottom: 10 }}>Aucun exercice en activite</Text>
					<Button
						title="COMMENCER UN NOUVEL EXERCICE"
						buttonStyle={{
							backgroundColor: "#ff751a",
							borderColor: "transparent",
							borderRadius: 5,
						}}
						onPress={() => {
							setModalOpen(true);
						}}
					/>
				</View>
			</Card>

			<Card containerStyle={{ borderRadius: 10 }}>
				<Card.Title>Evenements de la mutuelle</Card.Title>
				<Card.Divider />
				<View style={{ alignItems: "center" }}>
					<Text style={{ marginBottom: 10 }}>Aucune aide active</Text>
					<Button
						title="CREER UNE NOUVELLE AIDE"
						buttonStyle={{
							backgroundColor: "#ff751a",
							borderColor: "transparent",
							borderRadius: 5,
						}}
					/>
				</View>
			</Card>
		</View>
	);
}

const styles = StyleSheet.create({});
