import { View, Text, Button, Modal, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import React, { useContext, useState, useEffect } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Avatar, getIconType, Icon, ListItem } from "react-native-elements";
import { HelperText, TextInput } from "react-native-paper";
import { globalStyles } from "../../styles/global";
import { authReducer } from "../../reducers/authReducer";
import { AuthContext } from "../../contexts/AuthContext";
import { SessionContext } from "../../contexts/sessionContext";
import { SavingContext } from "../../contexts/savingContext";
import { MemberContext } from "../../contexts/memberContext";
import { UserContext } from "../../contexts/userContext";
import axiosNoTokenInstance from "../../utils/axiosNoTokenInstance";
import { Formik } from "formik";
import * as yup from "yup";
import { Dropdown } from "react-native-element-dropdown";
import FlatButton from "../../shared/button";
import { useFocusEffect } from "@react-navigation/native";

export default function ObligatoryContrib({ navigation }) {
	const { auth, dispatch } = useContext(AuthContext);
	const { sessions, sessionDispatch } = useContext(SessionContext);
	const { savings, savingDispatch } = useContext(SavingContext);
	const { members, memberDispatch } = useContext(MemberContext);
	const { users, userDispatch } = useContext(UserContext);
	const [modalOpen, setModalOpen] = useState(false);
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [currentSessionsState, setCurrentSessionsState] = useState("");
	const [currentSession, setCurrentSession] = useState(null);
	const [obligatoryContribs, setObligatoryContribs] = useState(null);
	const [sessionsObligContribs, setSessionsObligContribs] = useState([]);
	const [newSessions, setNewSessions] = useState(null);
	const fixObligatoryContributionsBySession = async () => {
		try {
			let res = await axiosNoTokenInstance.get("/obligatory_contributions/");
			const obligatoryContributions = res.data;
			setObligatoryContribs(obligatoryContributions);
			res = await axiosNoTokenInstance.get("/sessions_/");
			const newSessions = res.data;
			setNewSessions(newSessions);
			if (newSessions.length) {
				let currentSessionState = newSessions[newSessions.length - 1].active;
				setCurrentSession(newSessions[newSessions.length - 1]);
				setCurrentSessionsState(currentSessionState == 0 ? "inActiveSession" : "activeSession");
			} else {
				setCurrentSessionsState("inActiveSession");
			}
			const sessionsWithTheirObliContribs = newSessions.map((session) => ({
				obliContribs: obligatoryContributions.filter((contrib) => contrib.session_id == session.id),
				id: session.id,
				create_at: session.create_at,
				active: session.active,
			}));
			setSessionsObligContribs(sessionsWithTheirObliContribs);
			console.log("sessionsWithTheirObliContribs", sessionsWithTheirObliContribs);
			// console.log("sessions", sessions);
		} catch (err) {
			console.log(err.message);
			console.log(err.response.data);
			console.log(err.response.status);
		}
	};

	const addMoreMembers = async () => {
		try {
			let gottenMems = await axiosNoTokenInstance.get("/members/");
			gottenMems = gottenMems.data;
			members.forEach((member) => {
				let user_id = member.id;
				gottenMems.forEach((mem) => {
					if (user_id == mem.user_id) {
						member.member_id = mem.id;
					}
				});
			});
		} catch (err) {
			console.log(err.message);
			console.log(err.response.data);
			console.log(err.response.status);
		}

		const mappedMembers = members.map((member) => {
			return {
				label: `${member.first_name} ${member.name}`,
				value: member.member_id,
			};
		});
		setData(mappedMembers);
	};

	const getSessionStringDate = (sessionId) => {
		const sessionWithId = newSessions.find((session) => session.id == sessionId);
		const dateOfSession = new Date(sessionWithId.create_at);
		return dateOfSession.toDateString();
	};
	useFocusEffect(
		React.useCallback(() => {
			fixObligatoryContributionsBySession();
			addMoreMembers();
			console.log("focused");
			return () => {
				// Do something when the screen is unfocused
				// Useful for cleanup functions
			};
		}, [])
	);
	// console.log("currentSessionsState", currentSessionsState);
	// console.log("SESSIONS:", sessions);

	// console.log("SAVINGS:", savings);
	// console.log("MEMBERS:", members);

	const getDate = (string) => {
		const date = new Date(string);
		return date.toDateString();
	};

	const [value, setValue] = useState(null);
	const [isFocus, setIsFocus] = useState(false);

	const renderLabel = () => {
		if (value || isFocus) {
			return <Text style={[styles.label, isFocus && { color: "#ff751a" }]}>Choisir membre</Text>;
		}
		return null;
	};
	// console.log("sessions", sessions);
	const handleMakeContribution = async () => {
		const membersId = value;
		//Ensure member had not already contributed for session
		const theMembersObligatoryContributionsForCurrentSession = obligatoryContribs.filter(
			(contrib) => contrib.session_id == currentSession.id && contrib.member_id == membersId
		);
		if (theMembersObligatoryContributionsForCurrentSession.length) {
			Alert.alert("NOTICE", "Ce membre a déjà donné sa contribution obligatoire pour cette session.", [
				{
					text: "OKAY",
				},
			]);
		} else {
			try {
				const res = await axiosNoTokenInstance.post("/obligatory_contributions/", {
					contributed: 1,
					create_at: new Date(),
					administrator_id: auth.user.administrator_id,
					member_id: value,
					session_id: currentSession.id,
				});
				console.log("RESULT:", res.data);

				setLoading(false);
				setModalOpen(false);

				Alert.alert("SUCCESS", "La contribution obligatoire a été enregistrée", [
					{
						text: "OKAY",
					},
				]);
				fixObligatoryContributionsBySession();
			} catch (err) {
				console.log(err.message);
				console.log(err.response.data);
				console.log(err.response.status);
				// Alert.alert("OOPS!", "A user with this credentials does not exist.", [
				// 	{
				// 		text: "Understood",
				// 	},
				// ]);
			}
		}
	};
	return (
		<View style={globalStyles.container}>
			<Modal visible={modalOpen} animationType="slide">
				<View style={globalStyles.container}>
					<Icon name="close" onPress={() => setModalOpen(false)} />
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
						<View style={styles.container}>
							{renderLabel()}
							<Dropdown
								style={[styles.dropdown, isFocus && { borderColor: "#ff751a" }]}
								placeholderStyle={styles.placeholderStyle}
								selectedTextStyle={styles.selectedTextStyle}
								inputSearchStyle={styles.inputSearchStyle}
								iconStyle={styles.iconStyle}
								data={data}
								search
								maxHeight={300}
								labelField="label"
								valueField="value"
								placeholder={!isFocus ? "  Chosir Membre" : "..."}
								searchPlaceholder="Search..."
								value={value}
								onFocus={() => setIsFocus(true)}
								onBlur={() => setIsFocus(false)}
								onChange={(item) => {
									setValue(item.value);
									setIsFocus(false);
								}}
								renderLeftIcon={() => <Icon name="user" type="simple-line-icon" color="#ff751a" />}
							/>
						</View>
						{/* <TextInput
									keyboardType="numeric"
									mode="outlined"
									label="Montant"
									onChangeText={props.handleChange("montant")}
									value={props.values.montant}
									onBlur={props.handleBlur("montant")}
								/>
								<HelperText type="error" visible={true} style={{ marginBottom: 20 }}>
									{props.touched.montant && props.errors.montant}
								</HelperText> */}

						<FlatButton
							text={loading ? "loading..." : "Confirmer contibution obligatoire"}
							onPress={() => {
								setLoading(true);
								handleMakeContribution();
							}}
							color="black"
						/>
					</View>
				</View>
			</Modal>
			{
				sessionsObligContribs ? (
					<FlatList
						data={sessionsObligContribs}
						keyExtractor={(item, index) => index.toString()}
						renderItem={({ item }) => (
							<TouchableOpacity
								onPress={() =>
									navigation.navigate("Details sur les contributions", {
										item,
									})
								}
							>
								<ListItem bottomDivider containerStyle={{ borderRadius: 20, marginBottom: 20 }}>
									<ListItem.Content>
										<ListItem.Title>
											{`Session de: ${getDate(item.create_at)}${item.active ? "\n(en cours)" : ""}`}
										</ListItem.Title>
										<ListItem.Subtitle>{`Nombre de membres qui ont donné leur contribution: ${item.obliContribs.length}`}</ListItem.Subtitle>
									</ListItem.Content>
									<Icon name="arrow-forward-ios" type="material" color="#ff751a" />
								</ListItem>
							</TouchableOpacity>
						)}
					/>
				) : null
				// <Text>Contribution obligatoire n'a pas encore été faite</Text>
			}

			<Icon
				name="add-circle"
				size={70}
				disabled={currentSessionsState == "inActiveSession" ? true : false}
				color={currentSessionsState == "inActiveSession" ? "#bbb" : "#ff884b"}
				containerStyle={{ position: "absolute", bottom: 10, right: 10 }}
				onPress={() => setModalOpen(true)}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "white",
		padding: 16,
		borderRadius: 8,
	},
	dropdown: {
		height: 50,
		borderColor: "gray",
		borderWidth: 0.5,
		borderRadius: 8,
		paddingHorizontal: 8,
	},
	icon: {
		marginRight: 5,
	},
	label: {
		position: "absolute",
		backgroundColor: "white",
		left: 22,
		top: 8,
		zIndex: 999,
		paddingHorizontal: 8,
		fontSize: 14,
	},
	placeholderStyle: {
		fontSize: 16,
	},
	selectedTextStyle: {
		fontSize: 16,
	},
	iconStyle: {
		width: 20,
		height: 20,
	},
	inputSearchStyle: {
		height: 40,
		fontSize: 16,
	},
});
