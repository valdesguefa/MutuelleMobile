import { View, Text, Button, Modal, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import React, { useContext, useState, useEffect } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Avatar, getIconType, Icon, ListItem } from "react-native-elements";
import { HelperText, TextInput } from "react-native-paper";
import { globalStyles } from "../../styles/global";
import { authReducer } from "../../reducers/authReducer";
import { AuthContext } from "../../contexts/AuthContext";
import { SessionContext } from "../../contexts/sessionContext";
import { RefundContext } from "../../contexts/refundContext";
import { MemberContext } from "../../contexts/memberContext";
import { UserContext } from "../../contexts/userContext";
import axiosNoTokenInstance from "../../utils/axiosNoTokenInstance";
import { Formik } from "formik";
import * as yup from "yup";
import { Dropdown } from "react-native-element-dropdown";
import FlatButton from "../../shared/button";
import { useFocusEffect } from "@react-navigation/native";
import { patchWebProps } from "react-native-elements/dist/helpers";
import { BorrowingContext } from "../../contexts/borrowingContext";

const helpTypeCreateSchema = yup.object({
	montant: yup
		.string()
		.required("un montant est requis")
		.test("isValidNumber", "montant invalid", (val) => parseInt(val) > 0),
});

export default function Remboursements({ navigation }) {
	const { borrowings, borrowingDispatch } = useContext(BorrowingContext);
	const { auth, dispatch } = useContext(AuthContext);
	const { sessions, sessionDispatch } = useContext(SessionContext);
	const { refunds, refundDispatch } = useContext(RefundContext);
	const { members, memberDispatch } = useContext(MemberContext);
	const { users, userDispatch } = useContext(UserContext);
	const [modalOpen, setModalOpen] = useState(false);
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [currentSessionsState, setCurrentSessionsState] = useState("");
	const [newBorrowings, setNewBorrowings] = useState(null);
	const [newSavings, setNewSavings] = useState(null);
	const [newRefunds, setNewRefunds] = useState(null);
	// console.log("SESSIONS:", sessions);

	// console.log("REFUNDS:", refunds);
	// console.log("MEMBERS:", members);

	const fetchAndSetCurrentSessionState = async () => {
		try {
			let res = await axiosNoTokenInstance.get("/sessions_/");
			const newSessions = res.data;
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

	const fetchNewBorrowingsSavingRefunds = async () => {
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
		} catch (err) {
			console.log(err.message);
			console.log(err.response.data);
			console.log(err.response.status);
		}
	};

	useFocusEffect(
		React.useCallback(() => {
			fetchAndSetCurrentSessionState();
			fetchNewBorrowingsSavingRefunds();
			return () => {
				// Do something when the screen is unfocused
				// Useful for cleanup functions
			};
		}, [])
	);
	useEffect(() => {
		sessions.forEach((session) => {
			let session_id = session.id;
			session.refunds = [];

			refunds.forEach((refund) => {
				if (session_id == refund.session_id) {
					console.log("session", session);
					session.refunds.push({
						id: refund.id,
						amount: refund.amount,
						create_at: refund.create_at,
						administrator_id: refund.administrator_id,
						member_id: refund.member_id,
					});
				}
			});
		});
	}, [sessions, refunds]);

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

	// console.log("members", members);

	const getTotal = (session) => {
		let amount = 0;
		if (session.refunds) {
			session.refunds.forEach((refund) => {
				amount += refund.amount;
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

	const handleMakeRefund = async (amount) => {
		amount = Number(amount);
		const membersId = value;
		let alertContent = "";
		let showAlert;

		let unPaidBorrow;
		//Ensuring he borrowed
		const hisBorrowings = newBorrowings.filter((borrowing) => borrowing.member_id == membersId);
		if (!hisBorrowings.length) {
			showAlert = true;
			alertContent += `- Ce membre n'a jamais emprunté, ce membre ne peut donc pas rembourser..\n`;
		} else {
			unPaidBorrow = hisBorrowings.find((borrowing) => borrowing.state == 0);
			if (!unPaidBorrow) {
				showAlert = true;
				alertContent += `- Ce membre a payé toutes ses dettes.\n`;
			} else {
				const leftToPay = unPaidBorrow.amount_to_pay - unPaidBorrow.amount_paid;
				if (amount > leftToPay) {
					showAlert = true;
					alertContent += `- Un membre ne devrait pas rembourser plus que ce qu'il a emprunté. ce membre doit rembourser ${leftToPay}frs CFA \n`;
				}
			}
		}

		if (showAlert) {
			Alert.alert("Nous ne pouvons pas confirmer le remboursement", alertContent);
		} else {
			try {
				const res = await axiosNoTokenInstance.patch(`/borrowings/${unPaidBorrow.id}/`, {
					amount_paid: unPaidBorrow.amount_paid + amount,
					state: unPaidBorrow.amount_paid + amount == unPaidBorrow.amount_to_pay ? 1 : 0,
				});
				borrowingDispatch({
					type: "ADD_BORROWING",
					payload: res.data,
				});
			} catch (err) {
				console.log(err.message);
				console.log(err.response.data);
				console.log(err.response.status);
			}

			try {
				const res = await axiosNoTokenInstance.post("/refunds/", {
					amount: amount,
					administrator_id: auth.user.administrator_id,
					member_id: value,
					session_id: auth.current_session_id,
				});
				// console.log("RESULT:", res.data);
				refundDispatch({
					type: "ADD_REFUND",
					payload: res.data,
				});
				setLoading(false);
				setModalOpen(false);

				Alert.alert("SUCCESS", "Une remboursement a été réalisée", [
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
	console.log("sessions", sessions);
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
							handleMakeRefund(values.montant);
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
									text={loading ? "loading..." : "Confirmer Remboursement"}
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
						<TouchableOpacity onPress={() => navigation.navigate("Details sur le remboursement", item)}>
							<ListItem bottomDivider containerStyle={{ borderRadius: 20, marginBottom: 20 }}>
								<ListItem.Content>
									<ListItem.Title>{`Session de: ${getDate(item.create_at)}${
										item.active ? "\n(en cours)" : ""
									}`}</ListItem.Title>
									<ListItem.Subtitle>{`montant total des remboursements: ${getTotal(item)}`}</ListItem.Subtitle>
								</ListItem.Content>
								<Icon name="arrow-forward-ios" type="material" color="#ff751a" />
							</ListItem>
						</TouchableOpacity>
					)}
				/>
			) : (
				<Text>Un remboursement n'a pas encore été faite</Text>
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
