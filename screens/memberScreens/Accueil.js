import React, { useContext, useState, useEffect } from "react";
import { StyleSheet, Text, View, Modal, Alert, TouchableOpacity, FlatList } from "react-native";
import FabExample from "./utils/Fab";
import { Avatar, Icon, Card } from "react-native-elements";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { Formik } from "formik";
import axios from "axios";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getIconType, ListItem } from "react-native-elements";
import { HelperText, TextInput } from "react-native-paper";
import { globalStyles } from "../../styles/global";
import { authReducer } from "../../reducers/authReducer";
import { AuthContext } from "../../contexts/AuthContext";
import { SessionContext } from "../../contexts/sessionContext";
import { SavingContext } from "../../contexts/borrowingContext";
import { MemberContext } from "../../contexts/memberContext";
import { UserContext } from "../../contexts/userContext";
import axiosNoTokenInstance from "../../utils/axiosNoTokenInstance";
import * as yup from "yup";
import headerObj from "../../shared/token";
import { Dropdown } from "react-native-element-dropdown";
import FlatButton from "../../shared/button";
import { BorrowingContext } from "../../contexts/borrowingContext";
import { ConfigContext } from "../../contexts/configContext";
import URL from "../../shared/URL";
import { Pressable } from "react-native";
import * as Animatable from "react-native-animatable";

const helpTypeCreateSchema = yup.object({
	montant: yup
		.string()
		.required("un montant est requis")
		.test("isValidNumber", "montant invalid", (val) => parseInt(val) > 0),
});

export default function Accueil() {
	const [askHelp, setAskHelp] = useState(false);
	const [askBorrowing, setAskBorrowing] = useState(false);
	const { auth } = useContext(AuthContext);
	//const { auth, dispatch } = useContext(AuthContext);
	const { sessions, sessionDispatch } = useContext(SessionContext);
	const { borrowings, borrowingDispatch } = useContext(BorrowingContext);
	const { members, memberDispatch } = useContext(MemberContext);
	const { configs, configDispatch } = useContext(ConfigContext);
	const { users, userDispatch } = useContext(UserContext);
	const [modalOpen, setModalOpen] = useState(false);
	const [data, setData] = useState(null);
	//const [Allmembers, setAllmembers] = useState([])
	const [loading, setLoading] = useState(false);
	const [askBorrowingsHelps, setaskBorrowingsHelps] = useState([]);
	const [askBorrowingsHelps2, setaskBorrowingsHelps2] = useState([]);

	useEffect(() => {
		console.log("voici les demandes");
		console.log(askBorrowingsHelps2);
	}, [askBorrowingsHelps2]);
	const loadAsk = () => {
		axios
			.get(URL + `ask_Borrowings_Helps/`, headerObj)
			.then((response) => {
				var val2 = [];
				var val = [];
				for (let temp of response.data) {
					if (temp.user_id == auth.user.id && temp.state == 1 && temp.type == "emprunt") {
						//console.log(`Ask demande ${temp.user_id}`)
						val.push(temp);
					}
					if (temp.user_id == auth.user.id && temp.state == 1 && temp.type == "aide") {
						//console.log(`Ask demande ${temp.user_id}`)
						val2.push(temp);
					}
				}
				setaskBorrowingsHelps(val);
				setaskBorrowingsHelps2(val2);
				//setmembersId(val)
			})
			.catch((error) => {
				console.log("voici l'erreur", error);
			});
	};
	useEffect(() => {
		loadAsk();
	}, []);

	function fAskHelp() {
		setAskHelp(true);
		console.log(`demande daide ${askHelp}`);
	}

	function fAskBorrowing() {
		setAskBorrowing(true);
		console.log(`demande demprunt ${askBorrowing}`);
	}

	const [value, setValue] = useState(null);
	const [isFocus, setIsFocus] = useState(false);
	const deleteask = async (id) => {
		console.log(`voici votre id ${id}`);
		const res = await axiosNoTokenInstance.delete(`/ask_Borrowings_Helps/${id}`);
		console.log("RESULT:", res.data);

		Alert.alert("SUCCESS", "Votre Demande a été supprimee", [
			{
				text: "OKAY",
			},
		]);
	};

	const handleMakeSaving = async (params) => {
		var elt = {
			title: params.title,
			body: params.body,
			type: params.types,
			amount: params.montant,
			user_id: auth.user.id,
			state: 1, //auth.current_session_id,
		};

		try {
			const res = await axiosNoTokenInstance.post("/ask_Borrowings_Helps/", elt);
			console.log("RESULT:", res.data);

			setLoading(false);
			setAskBorrowing(false);
			setAskHelp(false);
			loadAsk();
			Alert.alert("SUCCESS", "Votre Demande a été Enregistré", [
				{
					text: "OKAY",
				},
			]);
			//console.log('pppppppppp')
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
		<View style={{ flex: 1, marginTop: 20, alignItems: "center", justifyContent: "center" }}>
			<View style={{ paddingTop: 10 }}>
				<FlatList
					data={askBorrowingsHelps}
					style={{ height: 2 }}
					renderItem={({ item }) => (
						<TouchableOpacity
							key={item.id}
							onPress={() =>
								Alert.alert(`${item.title}`, `${item.body} \n Emprunt de : ${item.amount} XAF`, [
									{
										text: "Supprimer",
										onPress: async () => {
											console.log(`voici votre id ${item.id}`);
											const res = await axiosNoTokenInstance.delete(`/ask_Borrowings_Helps/${item.id}/`);
											console.log("RESULT:", res.data);
											loadAsk();

											Alert.alert("SUCCESS", "Votre Demande a été supprimee", [
												{
													text: "OKAY",
												},
											]);
										},
										style: "cancel",
									},
									{
										text: "ok",
									},
								])
							}
						>
							<ListItem bottomDivider containerStyle={{ borderRadius: 20, marginBottom: 5, height: 60 }}>
								<Avatar
									size={40}
									rounded
									icon={{ name: "hand-holding-usd", type: "font-awesome-5" }}
									containerStyle={{ backgroundColor: "#ff884b", marginBottom: 5 }}
								/>

								<ListItem.Title>
									<Text>{`${item.title}`}</Text>
								</ListItem.Title>
								<Icon
									name="arrow-forward-ios"
									type="material"
									// disabled={permissions ? false : true}
									color="#ff751a"
								/>
							</ListItem>
						</TouchableOpacity>
					)}
					keyExtractor={(item) => item.id}
				/>
				{/*Demande des aides */}
				<FlatList
					data={askBorrowingsHelps2}
					renderItem={({ item }) => (
						<TouchableOpacity
							key={item.id}
							onPress={() =>
								Alert.alert(`${item.title}`, `${item.body} \n Aide de : ${item.amount} XAF`, [
									{
										text: "Supprimer",
										onPress: async () => {
											console.log(`voici votre id ${item.id}`);
											const res = await axiosNoTokenInstance.delete(`/ask_Borrowings_Helps/${item.id}/`);
											console.log("RESULT:", res.data);
											loadAsk();

											Alert.alert("SUCCESS", "Votre Demande a été supprimee", [
												{
													text: "OKAY",
												},
											]);
										},
										style: "cancel",
									},
									{
										text: "ok",
									},
								])
							}
						>
							<ListItem bottomDivider containerStyle={{ borderRadius: 20, marginBottom: 5, height: 60 }}>
								<Avatar
									size={40}
									rounded
									icon={{ name: "hand-holding-medical", type: "font-awesome-5" }}
									containerStyle={{ backgroundColor: "#ff884b", marginBottom: 5 }}
								/>

								<ListItem.Title>
									<Text>{`${item.title}`}</Text>
								</ListItem.Title>
								<Icon
									name="arrow-forward-ios"
									type="material"
									// disabled={permissions ? false : true}
									color="#ff751a"
								/>
							</ListItem>
						</TouchableOpacity>
					)}
					keyExtractor={(item) => item.id}
				/>
			</View>
			<Modal visible={askBorrowing} animationType="slide">
				<View style={globalStyles.container}>
					<Icon name="close" onPress={() => setAskBorrowing(false)} />
					<Formik
						validationSchema={helpTypeCreateSchema}
						initialValues={{
							montant: "",
						}}
						onSubmit={(values) => {
							//handleMakeSaving(values.montant);
							// handlePress();
							var param = {
								title: values.title,
								body: values.body,
								montant: values.montant,
								types: askHelp ? "aide" : askBorrowing ? "emprunt" : null,
							};

							handleMakeSaving(param);
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
								<TextInput
									style={{ marginBottom: 30 }}
									keyboardType="default"
									mode="outlined"
									multiline={true}
									label="Objet"
									onChangeText={props.handleChange("title")}
									value={props.values.title}
									onBlur={props.handleBlur("title")}
								/>
								<TextInput
									style={{ marginBottom: 30 }}
									keyboardType="default"
									mode="outlined"
									multiline={true}
									label="Commentaires"
									onChangeText={props.handleChange("body")}
									value={props.values.body}
									onBlur={props.handleBlur("body")}
								/>

								<TextInput
									style={{ marginBottom: 30 }}
									keyboardType="numeric"
									mode="outlined"
									label="Montant"
									onChangeText={props.handleChange("montant")}
									value={props.values.montant}
									onBlur={props.handleBlur("montant")}
								/>
								<HelperText type="error" visible={true} style={{ marginBottom: 20 }}>
									{props.touched.montant && props.errors.montant}
									{props.touched.title && props.errors.title}
									{props.touched.body && props.errors.body}
								</HelperText>
								<FlatButton
									text={loading ? "loading..." : "Confirmer la demande d'Emprunt"}
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
			{/* Demande d'aide */}
			<Modal visible={askHelp} animationType="slide">
				<View style={globalStyles.container}>
					<Icon name="close" onPress={() => setAskHelp(false)} />
					<Formik
						validationSchema={helpTypeCreateSchema}
						initialValues={{
							montant: "",
						}}
						onSubmit={(values) => {
							//handleMakeSaving(values.montant);
							// handlePress();
							var param2 = {
								title: values.title,
								body: values.body,
								montant: values.montant,
								types: "aide",
							};

							handleMakeSaving(param2);
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
								<TextInput
									style={{ marginBottom: 30 }}
									keyboardType="default"
									mode="outlined"
									multiline={true}
									label="Objet"
									onChangeText={props.handleChange("title")}
									value={props.values.title}
									onBlur={props.handleBlur("title")}
								/>
								<TextInput
									style={{ marginBottom: 30 }}
									keyboardType="default"
									mode="outlined"
									multiline={true}
									label="Commentaires"
									onChangeText={props.handleChange("body")}
									value={props.values.body}
									onBlur={props.handleBlur("body")}
								/>

								<TextInput
									style={{ marginBottom: 30 }}
									keyboardType="numeric"
									mode="outlined"
									label="Montant"
									onChangeText={props.handleChange("montant")}
									value={props.values.montant}
									onBlur={props.handleBlur("montant")}
								/>
								<HelperText type="error" visible={true} style={{ marginBottom: 20 }}>
									{props.touched.montant && props.errors.montant}
									{props.touched.title && props.errors.title}
									{props.touched.body && props.errors.body}
								</HelperText>
								<FlatButton
									text={loading ? "loading..." : "Confirmer la demande d'une Aide"}
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
			<FabExample displayHelp={() => fAskHelp()} displayBorrowing={() => fAskBorrowing()} />
		</View>
	);
}

const styles = StyleSheet.create({});
