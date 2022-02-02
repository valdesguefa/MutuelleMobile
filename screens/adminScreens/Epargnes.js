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

const helpTypeCreateSchema = yup.object({
	montant: yup
		.string()
		.required("un montant est requis")
		.test("isValidNumber", "montant invalid", (val) => parseInt(val) > 0),
});

export default function Epargnes({ navigation }) {
	const { auth, dispatch } = useContext(AuthContext);
	const { sessions, sessionDispatch } = useContext(SessionContext);
	const { savings, savingDispatch } = useContext(SavingContext);
	const { members, memberDispatch } = useContext(MemberContext);
	const { users, userDispatch } = useContext(UserContext);
	const [modalOpen, setModalOpen] = useState(false);
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(false);

	// console.log("SESSIONS:", sessions);

	// console.log("SAVINGS:", savings);
	// console.log("MEMBERS:", members);

	useEffect(() => {
		sessions.forEach((session) => {
			let session_id = session.id;
			session.savings = [];

			savings.forEach((saving) => {
				if (session_id == saving.session_id) {
					console.log("session", session);
					session.savings.push({
						id: saving.id,
						amount: saving.amount,
						create_at: saving.create_at,
						administrator_id: saving.administrator_id,
						member_id: saving.member_id,
					});
				}
			});
		});
	}, [sessions, savings]);

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
		if (session.savings) {
			session.savings.forEach((saving) => {
				amount += saving.amount;
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

	console.log("sessions", sessions);

	const [value, setValue] = useState(null);
	const [isFocus, setIsFocus] = useState(false);

	const renderLabel = () => {
		if (value || isFocus) {
			return <Text style={[styles.label, isFocus && { color: "#ff751a" }]}>Choisir membre</Text>;
		}
		return null;
	};

	const handleMakeSaving = async (amount) => {
		try {
			const res = await axiosNoTokenInstance.post("/savings/", {
				amount: amount,
				administrator_id: auth.user.administrator_id,
				member_id: value,
				session_id: auth.current_session_id,
			});
			console.log("RESULT:", res.data);
			savingDispatch({
				type: "ADD_SAVING",
				payload: res.data,
			});
			setLoading(false);
			setModalOpen(false);

			Alert.alert("SUCCESS", "Une épargne a été réalisée", [
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
	};
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
									text={loading ? "loading..." : "Confirmer Epargne"}
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
						<TouchableOpacity onPress={() => navigation.navigate("Details sur L'epargne", item)}>
							<ListItem bottomDivider containerStyle={{ borderRadius: 20, marginBottom: 20 }}>
								<ListItem.Content>
									<ListItem.Title>{`Session id: ${item.id}`}</ListItem.Title>
									<ListItem.Subtitle>{`Session date: ${getDate(item.date)}`}</ListItem.Subtitle>
									<ListItem.Subtitle>{`montant total des eparges: ${getTotal(item)}`}</ListItem.Subtitle>
								</ListItem.Content>
								<Icon name="arrow-forward-ios" type="material" color="#ff751a" />
							</ListItem>
						</TouchableOpacity>
					)}
				/>
			) : (
				<Text>l'epargnes n'a pas encore été faite</Text>
			)}

			<Icon
				name="add-circle"
				size={70}
				disabled={auth.current_state == "SAVING" ? false : true}
				color={auth.current_state == "SAVING" ? "#f4511e" : "#bbb"}
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
