import React, { useContext, useEffect, useState } from "react";
import { Alert, Modal, StyleSheet, Text, View, ActivityIndicator } from "react-native";
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

export default function Accueil({ navigation }) {
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
	const [preState, setPreState] = useState("");
	const [nextState, setNextState] = useState("");
	const [loadingContent, setLoadingContent] = useState(true);
	const [blurExoYear, setBlurExoYear] = useState(false);
	const [changedSession, setChangedSession] = useState(false);

	console.log("REFUNDS:", refunds);

	console.log("SAVINGS:", savings);
	console.log("BORROWINGS:", borrowings);

	const french = {
		SAVING: "Epargnes",
		REFUND: "Remboursements",
		BORROWING: "Emprunts",
	};

	const next = {
		SAVING: "REFUND",
		REFUND: "BORROWING",
		BORROWING: "END",
	};

	const prev = {
		REFUND: "SAVING",
		BORROWING: "REFUND",
	};
	// console.log("AUTH FROM ACCUEIL:    ", auth);

	useEffect(() => {
		if (auth.current_state == "SAVING") {
			setPreState("");
			setNextState("remboursements");
		} else if (auth.current_state == "REFUND") {
			setPreState("epargnes");
			setNextState("emprunts");
		} else if (auth.current_state == "BORROWING") {
			setPreState("remboursements");
			setNextState("terminer");
		} else if (auth.current_state == "END") {
			setPreState("");
			setNextState("commencer");
		}
	}, [auth.current_state]);

	let membersWithCrown = members.filter((member) => member.social_crown == 1);
	let part1 = members.length * configs.inscription_per_member;
	let part2 = membersWithCrown.length * configs.social_funds_per_member;
	let fondSocial = part1 + part2;

	let bors = 0;
	let saves = 0;
	let refs = 0;
	if (savings.length > 0) {
		savings.forEach((saving) => {
			saves += saving.amount;
		});
	}
	if (refunds.length > 0) {
		refunds.forEach((refund) => {
			refs += refund.amount;
		});
	}
	if (borrowings.length > 0) {
		borrowings.forEach((borrowing) => {
			bors += borrowing.amount;
		});
	}
	let tresorie = saves + refs - bors;

	// useEffect(() => {
	// 	if (savings) setTresorie(tresorie + savings[savings.length - 1].amount);
	// }, [savings]);

	// useEffect(() => {
	// 	if (refunds.length > 0) setTresorie(tresorie + refunds[refunds.length - 1].amount);
	// }, [refunds]);

	// useEffect(() => {
	// 	if (borrowings.length > 0) setTresorie(tresorie - borrowings[borrowings.length - 1].amount);
	// }, [borrowings]);

	useEffect(() => {
		const setCurrent = async () => {
			try {
				const result = await axiosNoTokenInstance.get("/exercises/");
				// console.log("SESSIONS:", result.data);
				if (result.data.length > 0) {
					const theExercise = result.data[result.data.length - 1];
					dispatch({
						type: "UPDATE_AUTH",
						payload: theExercise.id,
						prop: "current_exercise_id",
					});

					dispatch({
						type: "UPDATE_AUTH",
						payload: result.data.length,
						prop: "current_exercise_no",
					});

					const result2 = await axiosNoTokenInstance.get("/sessions_/");
					const theSession = result2.data[result2.data.length - 1];
					// console.log("SESSION STATE:", theSession.state);
					dispatch({
						type: "UPDATE_AUTH",
						payload: theSession.state,
						prop: "current_state",
					});

					dispatch({
						type: "UPDATE_AUTH",
						payload: theSession.id,
						prop: "current_session_id",
					});

					const sessionWithCurId = result2.data.filter((session) => session.exercise_id == theExercise.id);

					dispatch({
						type: "UPDATE_AUTH",
						payload: sessionWithCurId.length,
						prop: "current_session_no",
					});
					setLoadingContent(false);
				}
			} catch (err) {
				console.log(err.message);
				console.log(err.response.data);
				console.log(err.response.status);
			}
		};

		setCurrent();
	}, [changedSession]);

	useEffect(() => {
		//set members to context
		const membersGotten = users.filter((user) => user.type == "member");
		memberDispatch({ type: "INITIALIZE_MEMBERS", payload: membersGotten });
		let membersToModify = membersGotten;
		// Add to members info from members table

		// console.log("MEMBERSTOMODIFY:", membersToModify);
		memberDispatch({ type: "INITIALIZE_MEMBERS", payload: membersToModify });

		const addMoreToAuth = async () => {
			try {
				let fetchedAdministrators = await axiosNoTokenInstance.get(`/administrators/`);
				fetchedAdministrators = fetchedAdministrators.data;
				fetchedAdministrators.forEach((fetchedAdministrator) => {
					let user_id = fetchedAdministrator.user_id;
					if (auth.user.id == user_id) {
						auth.user.administrator_id = fetchedAdministrator.id;
						auth.user.root = fetchedAdministrator.root;
						auth.user.username = fetchedAdministrator.username;
						if (fetchedAdministrator.root == 1) {
							auth.permissions = true;
						} else {
							auth.permissions = false;
						}
					}
				});
			} catch (err) {
				console.log(err.message);
				console.log(err.response.data);
				console.log(err.response.status);
			}
		};

		addMoreToAuth();
	}, []);

	useEffect(() => {
		const addMoreToMembers = async () => {
			try {
				let membersFetched = await axiosNoTokenInstance.get(`/members/`);
				membersFetched = membersFetched.data;
				membersFetched.forEach((fetchedMember) => {
					let user_id = fetchedMember.user_id;
					members.forEach((member) => {
						if (member.id == user_id) {
							member.username = fetchedMember.username;
							member.social_crown = fetchedMember.social_crown;
							member.inscription = fetchedMember.inscription;
							member.administrator_id = fetchedMember.administrator_id;
						}
					});
				});
			} catch (err) {
				console.log(err.message);
				console.log(err.response.data);
				console.log(err.response.status);
			}
		};

		addMoreToMembers();
	}, [members]);

	const [date, setDate] = useState(new Date());
	const [annee, setAnnee] = useState(new Date());

	const handleCreateExercise = async () => {
		try {
			let res;
			if (!blurExoYear) {
				res = await axiosNoTokenInstance.post("/exercises/", {
					year: annee.getFullYear(),
					administrator_id: auth.user.administrator_id,
					create_at: date,
				});
				exerciseDispatch({
					type: "ADD_EXERCISE",
					payload: res.data,
				});
				dispatch({
					type: "UPDATE_AUTH",
					payload: res.data.id,
					prop: "current_exercise_id",
				});
				dispatch({
					type: "UPDATE_AUTH",
					payload: exercises.length++,
					prop: "current_exercise_no",
				});
			}
			let res2;
			if (auth.current_session_no < 10) {
				res2 = await axiosNoTokenInstance.post("/sessions_/", {
					exercise_id: auth.current_exercise_id,
					administrator_id: auth.user.administrator_id,
					state: "SAVING",
					create_at: date,
					date: date,
				});
			} else {
				res2 = await axiosNoTokenInstance.post("/sessions_/", {
					exercise_id: res.data.id,
					administrator_id: auth.user.administrator_id,
					state: "SAVING",
					create_at: date,
					date: date,
				});
			}

			sessionDispatch({
				type: "ADD_SESSION",
				payload: res2.data,
			});
			dispatch({
				type: "UPDATE_AUTH",
				payload: res2.data.id,
				prop: "current_session_id",
			});
			dispatch({
				type: "UPDATE_AUTH",
				payload: res2.data.state,
				prop: "current_state",
			});
			setChangedSession(!changedSession);
			// console.log("SESSION NO:", res.data.user);

			// if (auth.current_session_no < 10) {
			// 	dispatch({
			// 		type: "UPDATE_AUTH",
			// 		payload: auth.current_session_no++,
			// 		prop: "current_session_no",
			// 	});
			// } else {
			// 	dispatch({
			// 		type: "UPDATE_AUTH",
			// 		payload: 1,
			// 		prop: "current_session_no",
			// 	});
			// }

			setLoading(false);
			setModalOpen(false);
			Alert.alert("SUCCESS", "Une nouvelle session et exercise vien de commencer", [
				{
					text: "OKAY",
				},
			]);
		} catch (err) {
			console.log(err.message);
			console.log(err.response.data);
			console.log(err.response.status);
		}
	};

	const [showAnneeDP, setShowAnneeDP] = useState(false);
	const [showDateDP, setShowDateDP] = useState(false);
	// console.log("DATE:", date.toDateString());

	const onDateChange = (event, selectedDate) => {
		const currentDate = selectedDate || date;
		setShowDateDP(Platform.OS === "ios");
		setDate(currentDate);
	};

	const onAnneeChange = (event, selectedDate) => {
		const currentDate = selectedDate || date;
		setShowAnneeDP(Platform.OS === "ios");
		setAnnee(currentDate);
	};

	const handleCurrentState = () => {
		navigation.navigate(french[auth.current_state]);
	};

	const handleNextState = () => {
		if ((auth.current_state == "SAVING") | (auth.current_state == "REFUND")) {
			Alert.alert("ATTENTION!!", `Êtes-vous sûr(e) de vouloir passer aux ${french[next[auth.current_state]]}`, [
				{
					text: "OUI",
					onPress: async () => {
						try {
							const res = await axiosNoTokenInstance.patch(`/sessions_/${auth.current_session_id}/`, {
								state: next[auth.current_state],
							});
							dispatch({
								type: "UPDATE_AUTH",
								payload: res.data.state,
								prop: "current_state",
							});
						} catch (err) {
							console.log(err.message);
							console.log(err.response.data);
							console.log(err.response.status);
						}
					},
				},

				{
					text: "ANNULER",
				},
			]);
		} else if (auth.current_state == "BORROWING") {
			Alert.alert(
				"ATTENTION!!",
				`Êtes-vous sûr(e) de vouloir cloturer la session? Vous ne pourrez plus faire aucun enregistrerment.`,
				[
					{
						text: "OUI",
						onPress: async () => {
							try {
								const res = await axiosNoTokenInstance.patch(`/sessions_/${auth.current_session_id}/`, {
									state: next[auth.current_state],
								});
								dispatch({
									type: "UPDATE_AUTH",
									payload: res.data.state,
									prop: "current_state",
								});
							} catch (err) {
								console.log(err.message);
								console.log(err.response.data);
								console.log(err.response.status);
							}
						},
					},

					{
						text: "ANNULER",
					},
				]
			);
		} else {
			console.log("clicked");
			setModalOpen(true);
			if (auth.current_session_no == 10) {
				setBlurExoYear(false);
			} else {
				setBlurExoYear(true);
			}
		}
	};

	const handlePreviousState = () => {
		Alert.alert("ATTENTION!!", `Êtes-vous sûr de vouloir revenir à la phase ${preState} ?`, [
			{
				text: "OUI",
				onPress: async () => {
					try {
						const res = await axiosNoTokenInstance.patch(`/sessions_/${auth.current_session_id}/`, {
							state: prev[auth.current_state],
						});
						dispatch({
							type: "UPDATE_AUTH",
							payload: res.data.state,
							prop: "current_state",
						});
					} catch (err) {
						console.log(err.message);
						console.log(err.response.data);
						console.log(err.response.status);
					}
				},
			},

			{
				text: "ANNULER",
			},
		]);
	};

	if (loadingContent) {
		return (
			<View style={globalStyles.container}>
				<ActivityIndicator size="large" color="#ff751a" />
			</View>
		);
	}
	return (
		<View style={globalStyles.container}>
			<Modal visible={modalOpen} animationType="slide">
				<View style={globalStyles.container}>
					<Icon name="close" onPress={() => setModalOpen(false)} />
					<Formik
						// validationSchema={helpTypeCreateSchema}
						initialValues={{
							annee: annee.getFullYear().toString(),
							date: date.toDateString(),
						}}
						onSubmit={(values) => {
							handleCreateExercise();
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
										value={annee.getFullYear().toString()}
										theme={{ colors: { disabled: "#ff751a" } }}
									/>
									<Icon
										name="calendar"
										size={50}
										type="foundation"
										color="#ff751a"
										onPress={() => setShowAnneeDP(true)}
									/>
								</View>

								<HelperText type="error" visible={true}></HelperText>

								{blurExoYear ? (
									<></>
								) : (
									showAnneeDP && (
										<DateTimePicker
											testID="dateTimePicker"
											value={annee}
											mode="date"
											is24Hour={true}
											display="default"
											onChange={onAnneeChange}
										/>
									)
								)}

								<View style={{ flexDirection: "row", alignItems: "center" }}>
									<TextInput
										label="Date date de début de la session"
										mode="outlined"
										disabled
										style={{ flex: 3, marginRight: 20 }}
										value={date.toDateString()}
										theme={{ colors: { disabled: "#ff751a" } }}
									/>
									<Icon
										name="calendar"
										size={50}
										type="foundation"
										color="#ff751a"
										onPress={() => setShowDateDP(true)}
									/>
								</View>
								<HelperText type="error" visible={true}></HelperText>
								{showDateDP && (
									<DateTimePicker
										testID="dateTimePicker"
										value={date}
										mode="date"
										is24Hour={true}
										display="default"
										onChange={onDateChange}
									/>
								)}
								<FlatButton
									text={
										loading
											? "loading..."
											: blurExoYear
											? "Commencer une nouvelle session"
											: "Commencer une nouvelle exercice"
									}
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
			{exercises.length ? (
				<View>
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
						{auth.current_state != "END" && <Card.Title>{`PHASE ${french[auth.current_state]}`}</Card.Title>}
						{auth.current_state != "END" && (
							<Button
								title={`Faire les ${french[auth.current_state]}`}
								buttonStyle={{
									backgroundColor: "#ff751a",
									borderColor: "transparent",
									borderRadius: 5,
								}}
								raised
								// icon={{
								// 	name: "next",
								// 	type: "foundation",
								// 	size: 15,
								// 	color: "white",
								// }}
								iconRight
								onPress={() => {
									handleCurrentState();
								}}
							/>
						)}
						<Card.Divider />
						<View style={{ alignItems: "center", justifyContent: "center" }}>
							<View>
								<Button
									title={
										nextState != "terminer"
											? auth.current_state == "END"
												? `${nextState} session`
												: `passer aux ${nextState}`
											: `${nextState} session`
									}
									buttonStyle={{
										backgroundColor: "#ff751a",
										borderColor: "transparent",
										borderRadius: 5,
									}}
									raised
									icon={{
										name: "next",
										type: "foundation",
										size: 15,
										color: "white",
									}}
									iconRight
									onPress={() => {
										handleNextState();
									}}
								/>
								{preState != "" && (
									<Button
										raised
										title={`rentourner aux ${preState}`}
										buttonStyle={{
											backgroundColor: "#ff751a",
											borderColor: "transparent",
											borderRadius: 5,
										}}
										containerStyle={{ marginVertical: 20 }}
										icon={{
											name: "previous",
											type: "foundation",
											size: 15,
											color: "white",
										}}
										iconLeft
										onPress={() => {
											handlePreviousState();
										}}
									/>
								)}
							</View>
						</View>
						<Card.Divider />
						{auth.current_state != "END" && (
							<Card.Title>{`SESSION ${auth.current_session_no} de DE L'EXERCICE ${auth.current_exercise_no}`}</Card.Title>
						)}
					</Card>

					<Card containerStyle={{ borderRadius: 10 }}>
						<Card.Title>Evenements de la mutuelle</Card.Title>

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
				<View>
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
			)}
		</View>
	);
}

const styles = StyleSheet.create({});
