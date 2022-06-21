import React, { useContext, useEffect, useState } from "react";
import { Alert, Modal, StyleSheet, Text, View, ActivityIndicator, FlatList, TouchableOpacity } from "react-native";
import { Button, Card, Icon, ListItem } from "react-native-elements";
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
import { useFocusEffect } from "@react-navigation/native";

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
	const [newBorrowings, setNewBorrowings] = useState(null);
	const [newSavings, setNewSavings] = useState(null);
	const [newRefunds, setNewRefunds] = useState(null);
	const [newTresorie, setNewTresorie] = useState(0);
	const [newObligContribs, setNewObligContribs] = useState(null);
	const [newMembers, setNewMembers] = useState(null);
	const [newFondSocial, setNewFondSocial] = useState(0);
	const [isPlusSession, setIsPlusSession] = useState(false);
	const [isBlurSession, setIsBlurSession] = useState(false);
	const [isPlusExo, setIsPlusExo] = useState(false);
	const [currentSession, setCurrentSession] = useState(null);
	const [currentExercise, setCurrentExercise] = useState(null);
	const [sessionModalOpen, setSessionModalOpen] = useState(false);
	const [exoModalOpen, setExoModalOpen] = useState(false);
	const [asks, setAsks] = useState([]);
	const [unhandledAsks, setUnhandledAsks] = useState(null);
	const [newUsers, setNewUsers] = useState(null);
	const [changed, setChanged] = useState(true);

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

	const fetchAskBorrowingHelps = async () => {
		try {
			let res = await axiosNoTokenInstance.get("/users/");
			const users = res.data;
			setNewUsers(users);

			res = await axiosNoTokenInstance.get("/ask_Borrowings_Helps/");
			const asks = res.data;
			setAsks(asks);

			const unHandledAsks = asks.filter((ask) => ask.state == 1);
			const orderedUnhandledAsks = unHandledAsks.reverse();
			setAsks(orderedUnhandledAsks);

			res = await axiosNoTokenInstance.get("/sessions_/");
			const newSessions = res.data;
		} catch (err) {
			console.log(err.message);
			console.log(err.response.data);
			console.log(err.response.status);
		}
	};

	const setExerciseExistAndSessionState = async () => {
		try {
			let res = await axiosNoTokenInstance.get("/exercises/");
			const newExercises = res.data;

			res = await axiosNoTokenInstance.get("/sessions_/");
			const newSessions = res.data;

			let currentExerciseI;
			if (newExercises.length) {
				currentExerciseI = newExercises[newExercises.length - 1];
				setCurrentExercise(currentExerciseI);

				let currentSessionI;
				currentSessionI = newSessions[newSessions.length - 1];
				setCurrentSession(currentSessionI);

				if (currentExerciseI.active == 0) {
					setIsPlusExo(true);
					setIsBlurSession(true);
				} else {
					if (newSessions.length) {
						// let currentSessionI;
						// currentSessionI = newSessions[newSessions.length - 1];
						// setCurrentSession(currentSessionI);
						if (currentSessionI.active == 0) setIsPlusSession(true);
					} else {
						setIsPlusSession(true);
					}
				}
			} else {
				setIsPlusExo(true);
				setIsBlurSession(true);
			}
		} catch (err) {
			console.log(err.message);
			console.log(err.response.data);
			console.log(err.response.status);
		}
	};

	const fetchTresorieFondSocial = async () => {
		try {
			let res = await axiosNoTokenInstance.get("/borrowings/");
			const newBorrowings = res.data;
			setNewBorrowings(newBorrowings);

			res = await axiosNoTokenInstance.get("/savings/");
			const newSavings = res.data;
			setNewSavings(newSavings);

			res = await axiosNoTokenInstance.get("/refunds/");
			const newRefunds = res.data;
			setNewRefunds(newRefunds);

			res = await axiosNoTokenInstance.get("/obligatory_contributions/");
			const obligatoryContributions = res.data;
			setNewObligContribs(obligatoryContributions);

			res = await axiosNoTokenInstance.get("/members/");
			const newMembers = res.data;
			setNewMembers(newMembers);

			//Get tresorie
			let tempTresorie = 0;
			newSavings.forEach((saving) => (tempTresorie += saving.amount));
			newRefunds.forEach((refund) => (tempTresorie += refund.amount));
			newBorrowings.forEach((borrowing) => (tempTresorie -= borrowing.amount_borrowed));
			setNewTresorie(tempTresorie);

			let tempFonds = 0;
			tempFonds =
				obligatoryContributions.length * configs.monthly_contribution_per_member +
				newMembers.length * configs.inscription_per_member;
			setNewFondSocial(tempFonds);
		} catch (err) {
			console.log(err.message);
			console.log(err.response.data);
			console.log(err.response.status);
		}
	};

	useFocusEffect(
		React.useCallback(() => {
			fetchAskBorrowingHelps();
			fetchTresorieFondSocial();
			setExerciseExistAndSessionState();

			return () => {
				// Do something when the screen is unfocused
				// Useful for cleanup functions
			};
		}, [modalOpen, sessionModalOpen, changed])
	);

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
				setLoadingContent(false);
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
					active: 1,
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
	const getFormattedDate = (string) => {
		const date = new Date(string);
		return date.toDateString();
	};

	const getDate = (string) => {
		return new Date(string);
	};
	const handleSessionModalOpenning = () => {
		if (isPlusSession) {
			setSessionModalOpen(true);
		} else {
			Alert.alert("ATTENTION!!", `Êtes-vous sûr(e) de vouloir cloturer la session? `, [
				{
					text: "OUI",
					onPress: async () => {
						try {
							const res = await axiosNoTokenInstance.patch(`/sessions_/${currentSession.id}/`, {
								state: "END",
								active: 0,
							});
							sessionDispatch({
								type: "UPDATE_SESSION",
								payload: res.data,
								id: res.data.id,
							});
						} catch (err) {
							console.log(err.message);
							console.log(err.response.data);
							console.log(err.response.status);
						}
						setIsPlusSession(!isPlusSession);
					},
				},

				{
					text: "ANNULER",
				},
			]);
		}
	};

	const handleCreateSession = async () => {
		try {
			let res = await axiosNoTokenInstance.post("/sessions_/", {
				exercise_id: currentExercise.id,
				administrator_id: auth.user.administrator_id,
				create_at: date,
				date: date,
			});

			setLoading(false);
			setSessionModalOpen(false);
			Alert.alert("SUCCESS", "Une nouvelle session a ete commencer", [
				{
					text: "OKAY",
				},
			]);

			sessionDispatch({
				type: "ADD_SESSION",
				payload: res.data,
			});
			dispatch({
				type: "UPDATE_AUTH",
				payload: res.data.id,
				prop: "current_session_id",
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
		setIsPlusSession(!isPlusSession);
		setSessionModalOpen(false);
	};

	if (loadingContent) {
		return (
			<View style={globalStyles.container}>
				<ActivityIndicator size="large" color="#ff751a" />
			</View>
		);
	}

	const handleExoModalOpenning = () => {
		if (isPlusExo) {
			setExoModalOpen(true);
		} else {
			Alert.alert(
				"ATTENTION!!",
				`Êtes-vous sûr de vouloir cloturer l'exercice ? \n Aucune transaction non gérée ne serait reportée sur le nouvel exercice. \n`,
				[
					{
						text: "OUI",
						onPress: async () => {
							try {
								const res = await axiosNoTokenInstance.patch(`/exercises/${currentExercise.id}/`, {
									active: 0,
								});
							} catch (err) {
								console.log(err.message);
								console.log(err.response.data);
								console.log(err.response.status);
							}
							setIsPlusExo(!isPlusExo);
						},
					},

					{
						text: "NON",
					},
				]
			);
		}
	};

	const getUsersNames = (id) => {
		console.log("id", id);
		const him = newUsers.find((user) => user.id == id);
		console.log("him", him);
		return `${him.first_name} ${him.name}`;
	};

	console.log("asks", asks);
	console.log("newUsers", newUsers);

	return (
		<View style={globalStyles.container}>
			<Modal visible={sessionModalOpen} animationType="slide">
				<View style={globalStyles.container}>
					<Icon name="close" onPress={() => setSessionModalOpen(false)} />
					<Formik
						// validationSchema={helpTypeCreateSchema}
						initialValues={{
							annee: currentExercise ? getDate(currentExercise.create_at).getFullYear().toString() : null,
							date: date.toDateString(),
						}}
						onSubmit={(values) => {
							handleCreateSession(values);
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
										// onPress={}
										// () => setShowAnneeDP(true)
									/>
								</View>

								<HelperText type="error" visible={true}></HelperText>

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
									text={loading ? "loading..." : "Commencer une nouvelle session"}
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

			<View style={{ flex: 1 }}>
				<Card containerStyle={{ borderRadius: 10, marginBottom: 20 }}>
					<Card.Title>
						{currentExercise ? `Exercise de l'annee ${currentExercise.year}/ ${currentExercise.year + 1}` : "COMMENCER"}
					</Card.Title>
					<Card.Divider />
					<View style={{ alignItems: "center" }}>
						<Text style={{ marginBottom: 10 }}>
							{" "}
							{currentExercise && currentSession
								? isPlusSession
									? `Session de ${getFormattedDate(currentSession.create_at)} terminé `
									: `Session de ${getFormattedDate(currentSession.create_at)} en cours `
								: "Aucun exercice et aucune session n'ont été créés "}
						</Text>
						{currentExercise ? (
							<Button
								iconRight
								icon={
									<Icon
										name={isPlusSession ? "add-circle" : "cancel"}
										size={50}
										// disabled={exerciseExist ? false : true}
										color="white"
										containerStyle={{ paddingEnd: 20, paddingStart: 10 }}
									/>
								}
								title={isPlusSession ? "Commencer une nouvelle session " : "Terminer la session en cours "}
								buttonStyle={{ backgroundColor: "#ff751a", width: "80%", borderRadius: 15 }}
								onPress={handleSessionModalOpenning}
							/>
						) : (
							<Button
								title="Créez-les"
								icon={<Icon name="arrow-right" size={30} color="white" />}
								buttonStyle={{
									backgroundColor: "#ff751a",
									borderColor: "transparent",
									borderRadius: 5,
								}}
								onPress={() => {
									setModalOpen(true);
								}}
							/>
						)}
					</View>
				</Card>
				<View style={{ display: "flex", flexDirection: "row", justifyContent: "center", marginBottom: 20 }}>
					<Card containerStyle={{ borderRadius: 10, width: 150 }}>
						<Card.Title>Tresorie</Card.Title>
						<Card.Divider />
						<View style={{ alignItems: "center" }}>
							<Text>{`${newTresorie} XAF`}</Text>
						</View>
					</Card>
					<Card containerStyle={{ borderRadius: 10, width: 150 }}>
						<Card.Title>Fond social</Card.Title>
						<Card.Divider />
						<View style={{ alignItems: "center" }}>
							<Text>{`${newFondSocial} XAF`}</Text>
						</View>
					</Card>
				</View>

				<View style={{ borderRadius: 10, flex: 1 }}>
					<Card style={{ alignItems: "center", flex: 1 }}>
						<Card.Title>Evenements de la mutuelle</Card.Title>
						{asks.length ? (
							<FlatList
								data={asks}
								keyExtractor={(item, index) => index.toString()}
								renderItem={({ item }) => (
									<TouchableOpacity
										onPress={() =>
											Alert.alert(`${item.title}`, `${item.body} \n Emprunt de : ${item.amount} XAF`, [
												{
													text: "Gerer",
													onPress: async () => {
														console.log(`voici votre id ${item.id}`);
														const res = await axiosNoTokenInstance.patch(`/ask_Borrowings_Helps/${item.id}/`, {
															state: 0,
														});
														console.log("RESULT:", res.data);
														setChanged(!changed);

														Alert.alert("SUCCESS", "Votre Demande a été prise en compte", [
															{
																text: "OKAY",
															},
														]);
													},
													style: "cancel",
												},
												{
													text: "Ok",
												},
											])
										}
										key={item.index}
									>
										<ListItem bottomDivider containerStyle={{ borderRadius: 20, marginBottom: 20 }}>
											<ListItem.Content>
												<ListItem.Title>{`${getUsersNames(item.user_id)}  ${item.title}  ${getFormattedDate(
													item.create_at
												)}`}</ListItem.Title>
												<ListItem.Subtitle>{`${item.body}`}</ListItem.Subtitle>
											</ListItem.Content>
											<Icon name="arrow-forward-ios" type="material" color="#ff751a" />
										</ListItem>
									</TouchableOpacity>
								)}
							/>
						) : (
							<Text style={{ marginBottom: 10 }}>Aucune aide active </Text>
						)}
					</Card>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({});

{
	/* <Modal visible={exoModalOpen} animationType="slide">
				<View style={globalStyles.container}>
					<Icon name="close" onPress={() => setExoModalOpen(false)} />
					<Formik
						// validationSchema={helpTypeCreateSchema}
						initialValues={{
							annee: currentExercise ? getDate(currentExercise.create_at).getFullYear().toString() : null,
							date: date.toDateString(),
						}}
						onSubmit={(values) => {
							handleCreateExercise(values);
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

								{showAnneeDP && (
									<DateTimePicker
										testID="dateTimePicker"
										value={annee}
										mode="date"
										is24Hour={true}
										display="default"
										onChange={onAnneeChange}
									/>
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
									text={loading ? "loading..." : "Commencez un nouvel exercice"}
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
			</Modal> */
}

// {exercises.length ? (
// 	<View>
// 		<View style={{ display: "flex", flexDirection: "row", justifyContent: "center", marginBottom: 20 }}>
// 			<Card containerStyle={{ borderRadius: 10, width: 150 }}>
// 				<Card.Title>Tresorie</Card.Title>
// 				<Card.Divider />
// 				<View style={{ alignItems: "center" }}>
// 					<Text>{`${newTresorie} frs CFA`}</Text>
// 				</View>
// 			</Card>
// 			<Card containerStyle={{ borderRadius: 10, width: 150 }}>
// 				<Card.Title>Fond social</Card.Title>
// 				<Card.Divider />
// 				<View style={{ alignItems: "center" }}>
// 					<Text>{`${newFondSocial} frs CFA`}</Text>
// 				</View>
// 			</Card>
// 		</View>
// 		<View style={{ display: "flex", flexDirection: "row", justifyContent: "center", marginBottom: 20 }}>
// 			<Card containerStyle={{ borderRadius: 10, width: 150 }}>
// 				<Card.Title>Exercise </Card.Title>
// 				<Card.Divider />
// 				<View style={{ alignItems: "center" }}>
// 					<Icon
// 						name={isPlusExo ? "add-circle" : "cancel"}
// 						size={70}
// 						// disabled={exerciseExist ? false : true}
// 						color="#ff884b"
// 						onPress={handleExoModalOpenning}
// 					/>
// 				</View>
// 			</Card>
// 			<Card containerStyle={{ borderRadius: 10, width: 150 }}>
// 				<Card.Title>Session </Card.Title>
// 				<Card.Divider />
// 				<View style={{ alignItems: "center" }}>
// 					<Icon
// 						name={isPlusSession ? "add-circle" : "cancel"}
// 						size={70}
// 						disabled={isBlurSession ? true : false}
// 						color={isBlurSession ? "#bbb" : "#ff884b"}
// 						onPress={handleSessionModalOpenning}
// 					/>
// 				</View>
// 			</Card>
// 		</View>
