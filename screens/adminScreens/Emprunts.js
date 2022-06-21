import { View, Text, Button, Modal, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import React, { useContext, useState, useEffect } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Avatar, getIconType, Icon, ListItem } from "react-native-elements";
import { HelperText, TextInput } from "react-native-paper";
import { globalStyles } from "../../styles/global";
import { authReducer } from "../../reducers/authReducer";
import { AuthContext } from "../../contexts/AuthContext";
import { SessionContext } from "../../contexts/sessionContext";
import { SavingContext } from "../../contexts/borrowingContext";
import { MemberContext } from "../../contexts/memberContext";
import { UserContext } from "../../contexts/userContext";
import axiosNoTokenInstance from "../../utils/axiosNoTokenInstance";
import { Formik } from "formik";
import * as yup from "yup";
import { Dropdown } from "react-native-element-dropdown";
import FlatButton from "../../shared/button";
import { BorrowingContext } from "../../contexts/borrowingContext";
import { ConfigContext } from "../../contexts/configContext";
import { useFocusEffect } from "@react-navigation/native";

const helpTypeCreateSchema = yup.object({
	montant: yup
		.string()
		.required("un montant est requis")
		.test("isValidNumber", "montant invalid", (val) => parseInt(val) > 0),
});

export default function Emprunts({ navigation }) {
	const { auth, dispatch } = useContext(AuthContext);
	const { sessions, sessionDispatch } = useContext(SessionContext);
	const { borrowings, borrowingDispatch } = useContext(BorrowingContext);
	const { members, memberDispatch } = useContext(MemberContext);
	const { configs, configDispatch } = useContext(ConfigContext);
	const { users, userDispatch } = useContext(UserContext);
	const [modalOpen, setModalOpen] = useState(false);
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [newSessions, setNewSessions] = useState(null);
	const [obligatoryContributions, setObligatoryContributions] = useState(null);
	const [newBorrowings, setNewBorrowings] = useState(null);
	const [newSavings, setNewSavings] = useState(null);
	const [newRefunds, setNewRefunds] = useState(null);
	const [tresorie, setTresorie] = useState(0);
	const [currentSessionsState, setCurrentSessionsState] = useState("");
	const [currentExoYear, setCurrentExoYear] = useState(2022);
	// console.log("SESSIONS:", sessions);

	// console.log("BORROWINGS:", borrowings);
	// console.log("MEMBERS:", members);
	useFocusEffect(
		React.useCallback(() => {
			fetchAndSetNewSessions();
			fetchObligatoryContributions();
			fetchNewBorrowingsSavingRefundsAndGetTresorie();

			return () => {
				// Do something when the screen is unfocused
				// Useful for cleanup functions
			};
		}, [])
	);

	//Get Sessions
	const fetchAndSetNewSessions = async () => {
		try {
			let res = await axiosNoTokenInstance.get("/sessions_/");
			const newSessions = res.data;
			setNewSessions(newSessions);
			if (newSessions.length) {
				let currentSessionState = newSessions[newSessions.length - 1].active;
				setCurrentSessionsState(currentSessionState == 0 ? "inActiveSession" : "activeSession");
			} else {
				setCurrentSessionsState("inActiveSession");
			}
		} catch (err) {
			console.log(err.message);
			console.log(err.response.data);
			console.log(err.response.status);
		}
	};

	const fetchObligatoryContributions = async () => {
		try {
			let res = await axiosNoTokenInstance.get("/obligatory_contributions/");
			const obligatoryContributions = res.data;
			setObligatoryContributions(obligatoryContributions);
		} catch (err) {
			console.log(err.message);
			console.log(err.response.data);
			console.log(err.response.status);
		}
	};

	const fetchNewBorrowingsSavingRefundsAndGetTresorie = async () => {
		try {
			let res = await axiosNoTokenInstance.get("/borrowings/");
			const newBorrowings = res.data;
			setNewBorrowings(newBorrowings);

			res = await axiosNoTokenInstance.get("/exercises/");
			if (res.data.length) {
				const currentExoYear = res.data[res.data.length - 1].year;
				setCurrentExoYear(currentExoYear);
			}

			res = await axiosNoTokenInstance.get("/savings/");
			const newSavings = res.data;
			setNewSavings(newSavings);

			res = await axiosNoTokenInstance.get("/refunds/");
			const newRefunds = res.data;
			setNewRefunds(newRefunds);

			//Get tresorie
			let tempTresorie = 0;
			newSavings.forEach((saving) => (tempTresorie += saving.amount));
			newRefunds.forEach((refund) => (tempTresorie += refund.amount));
			newBorrowings.forEach((borrowing) => (tempTresorie -= borrowing.amount_borrowed));
			setTresorie(tempTresorie);
		} catch (err) {
			console.log(err.message);
			console.log(err.response.data);
			console.log(err.response.status);
		}
	};

	// console.log("newSessions", newSessions);
	// console.log("obligatoryContributions", obligatoryContributions);

	console.log("session I am using", "session");
	useEffect(() => {
		sessions.forEach((session) => {
			let session_id = session.id;
			session.borrowings = [];

			borrowings.forEach((borrowing) => {
				if (session_id == borrowing.session_id) {
					// console.log("session", session);
					session.borrowings.push({
						amount_paid: borrowing.amount_paid,
						interest: borrowing.interest,
						state: borrowing.state == 0 ? "non géré" : "géré",
						session_id: borrowing.session_id,
						amount_borrowed: borrowing.amount_borrowed,
						amount_to_pay: borrowing.amount_to_pay,
						payment_date_line: borrowing.payment_date_line,
						id: borrowing.id,
						create_at: borrowing.create_at,
						administrator_id: borrowing.administrator_id,
						member_id: borrowing.member_id,
					});
				}
			});
		});
	}, [sessions, borrowings]);

	useEffect(() => {
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
		addMoreMembers();
	}, [members, users]);

	// console.log("sessions", sessions);

	const getTotal = (session) => {
		let amount = 0;
		if (session.borrowings) {
			session.borrowings.forEach((borrowing) => {
				amount += borrowing.amount_borrowed;
			});
		} else {
			return 0;
		}
		return amount;
	};

	const getDate = (string) => {
		const date = new Date(string);
		return date.toDateString();
	};

	// console.log("sessions", sessions);

	const [value, setValue] = useState(null);
	const [isFocus, setIsFocus] = useState(false);

	const renderLabel = () => {
		if (value || isFocus) {
			return <Text style={[styles.label, isFocus && { color: "#ff751a" }]}>Choisir membre</Text>;
		}
		return null;
	};

	const handleMakeSaving = async (amount) => {
		amount = Number(amount);
		const membersId = value;
		let alertContent = "";
		let showAlert;

		//Ensuring the amount he is borrowing is less than what is in the tresorie
		const amountIsLessThanTresorie = amount < tresorie ? true : false;
		if (!amountIsLessThanTresorie) {
			showAlert = true;
			alertContent += `- Il n'y a pas assez d'argent dans la trésorerie.\n`;
		}
		// console.log("amountIsLessThanTresorie", amountIsLessThanTresorie);
		// console.log(alertContent);
		// console.log("showAlert", showAlert);

		//Ensuring he has no unpaid debt(he handled his past borrowing)
		const hisBorrowings = newBorrowings.filter((borrowing) => borrowing.member_id == membersId);
		const borrowingsPending = hisBorrowings.filter((borrowings) => borrowings.state == "pending");
		const hasUnhandledDebts = borrowingsPending.length ? true : false;
		if (hasUnhandledDebts) {
			showAlert = true;
			alertContent += `- Le membre doit d'abord régler ses dettes impayées.\n`;
		}
		console.log("hisBorrowings", hisBorrowings);
		console.log("hasUnhandledDebts", hasUnhandledDebts);
		console.log("borrowingsPending", borrowingsPending);
		//Ensuring member contributed for month
		const currentSessionId = newSessions[newSessions.length - 1].id;
		const ContributionsForCurrentSession = obligatoryContributions.filter(
			(contrib) => (contrib.session_id = currentSessionId)
		);
		const arrayForMembersContribution = obligatoryContributions.filter((contrib) => (contrib.member_id = membersId));
		const memberPayedHisMonthlyContribution = arrayForMembersContribution.length ? true : false;
		if (!memberPayedHisMonthlyContribution) {
			showAlert = true;
			alertContent += `- Le membre doit tout d'abord payer ses contributions obligatoires.\n`;
		}
		// console.log("memberPayedHisMonthlyContribution", memberPayedHisMonthlyContribution);

		//Ensure member has saved more than what he is borrowing
		const membersSavings = newSavings.filter((saving) => saving.member_id == value);
		let totalAmountHeHasSaved = 0;
		membersSavings.forEach((saving) => (totalAmountHeHasSaved += saving.amount));
		if (totalAmountHeHasSaved < amount) {
			showAlert = true;
			alertContent +=
				totalAmountHeHasSaved == 0
					? `- ce membre n'a jamais fait une épargne il ne peut pas emprunter`
					: `- Jusqu'à présent, ce membre a épargné seulement ${totalAmountHeHasSaved}, il ne peut pas emprunter plus que cela.\n`;
		}

		if (showAlert) {
			Alert.alert("L'emprunt de ce membre ne peut être accordé", alertContent);
		} else {
			const todayDate = new Date();
			const newDate = new Date(todayDate);
			const noMonthsToPay = configs.no_months_to_pay_0_to_300K;
			const interest = configs.interest_per_borrow;
			const interestToSave = (interest / 100.0) * amount;
			const amount_to_pay = (interest / 100.0) * amount + amount;
			console.log("amount_to_pay", amount_to_pay);
			const yearEnd = new Date(currentExoYear, 11, 31);
			const normalDateline = new Date(
				todayDate.getFullYear(),
				todayDate.getMonth() + noMonthsToPay,
				todayDate.getDate()
			);
			const paymentDateline = normalDateline < yearEnd ? normalDateline : yearEnd;
			console.log(new Date(2022, 5 + 12, 14) < todayDate);

			try {
				const res = await axiosNoTokenInstance.post("/borrowings/", {
					interest: interestToSave,
					amount_borrowed: amount,
					administrator_id: auth.user.administrator_id,
					member_id: value,
					session_id: currentSessionId,
					state: 0,
					create_at: todayDate,
					amount_to_pay: amount_to_pay,
					payment_date_line: paymentDateline,
				});
				// console.log("RESULT:", res.data);
				borrowingDispatch({
					type: "ADD_BORROWING",
					payload: res.data,
				});
				setLoading(false);
				setModalOpen(false);

				Alert.alert("SUCCESS", "un emprunt a été réalisée", [
					{
						text: "OKAY",
					},
				]);
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
		setLoading(false);
	};
	// console.log("sessions", sessions);
	//
	console.log("theSessions", sessions);
	return (
		<View style={globalStyles.container}>
			<Modal visible={modalOpen} animationType="slide">
				<View style={globalStyles.container}>
					<Icon name="close" onPress={() => setModalOpen(false)} />
					<Formik
						validationSchema={helpTypeCreateSchema}
						initialValues={{
							montant: "",
						}}
						onSubmit={(values) => {
							handleMakeSaving(values.montant);
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
								<TextInput
									keyboardType="numeric"
									mode="outlined"
									label="Montant"
									onChangeText={props.handleChange("montant")}
									value={props.values.montant}
									onBlur={props.handleBlur("montant")}
								/>
								<HelperText type="error" visible={true} style={{ marginBottom: 20 }}>
									{props.touched.montant && props.errors.montant}
								</HelperText>

								<FlatButton
									text={loading ? "loading..." : "Confirmer Emprunt"}
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
			{sessions ? (
				<FlatList
					data={sessions}
					keyExtractor={(item, index) => index.toString()}
					renderItem={({ item }) => (
						<TouchableOpacity onPress={() => navigation.navigate("Details sur l'emprunt", item)}>
							<ListItem bottomDivider containerStyle={{ borderRadius: 20, marginBottom: 20 }}>
								<ListItem.Content>
									<ListItem.Title>{`Session de: ${getDate(item.create_at)}${
										item.active ? "\n(en cours)" : ""
									}`}</ListItem.Title>
									<ListItem.Subtitle>{`montant total des emprunts: ${getTotal(item)}`}</ListItem.Subtitle>
								</ListItem.Content>
								<Icon name="arrow-forward-ios" type="material" color="#ff751a" />
							</ListItem>
						</TouchableOpacity>
					)}
				/>
			) : (
				<Text>l'emprunt n'a pas encore été faite</Text>
			)}

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
