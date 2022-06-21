import React, { useContext, useState, useEffect } from "react";
import { View, Text, FlatList, Modal, Keyboard, ScrollView, Alert } from "react-native";
import { Avatar, Icon, ListItem } from "react-native-elements";
import { TouchableWithoutFeedback } from "react-native";
import { AdministratorContext } from "../../contexts/administratorContext";
import { UserContext } from "../../contexts/userContext";
import { globalStyles } from "../../styles/global";
import { Button, TextInput, HelperText } from "react-native-paper";
import FlatButton from "../../shared/button";
import * as yup from "yup";

import { Formik } from "formik";
import axiosNoTokenInstance from "../../utils/axiosNoTokenInstance";
import { AuthContext } from "../../contexts/AuthContext";
import { TouchableOpacity } from "react-native";

const adminCreateSchema = yup.object({
	nom: yup.string().required("un nom est requis"),
	prenom: yup.string().required("un prenom est requis"),
	telephone: yup
		.string()
		.required("un numero de telephone est requis")
		.test(
			"isValidNumber",
			"Numero de telephone invalid",
			(val) => parseInt(val) > 600000000 && parseInt(val) < 700000000
		),
	email: yup.string().required("un email est requis").email("l'email n'est pas sur le bon format"),
	adresse: yup.string().required("un adresse est requis").min(4, "minimum 4 charactere pour l'addresse"),
	motDePasse: yup.string().required("un mot de passe est requis").min(4, "minimum 4 charactere pour le mot de passse"),
	motDePasseR: yup.string().oneOf([yup.ref("motDePasse"), null], "les mot de passes ne correspond pas"),
});

export default function Administrateurs({ navigation }) {
	// const { administrators } = useContext(AdministratorContext);
	const [modalOpen, setModalOpen] = useState(false);
	const { users, userDispatch } = useContext(UserContext);
	const { auth, dispatch } = useContext(AuthContext);
	const { admins, adminDispatch } = useContext(AdministratorContext);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const adminsGotten = users.filter((user) => user.type == "administrator");
		// console.log("ADMINS:", adminsGotten);
		adminDispatch({
			type: "INITIALIZE_ADMINISTRATORS",
			payload: adminsGotten,
		});
		// console.log("ADMIN:", admins);
	}, []);

	const handleCreateAdmin = async (name, first_name, tel, email, address, password) => {
		// dispatch({ type: "LOADING" });

		// Request Body
		const type = "administrator";
		const body = JSON.stringify({
			name,
			first_name,
			tel,
			email,
			address,
			password,
			type,
		});
		try {
			const res = await axiosNoTokenInstance.post("/auth/register", body);
			adminDispatch({
				type: "ADD_ADMIN",
				payload: res.data.user,
			});
			setLoading(false);
			setModalOpen(false);
			userDispatch({
				type: "ADD_USER",
				payload: res.data.user,
			});

			Alert.alert("SUCCESS", "A new administrator has been created", [
				{
					text: "OKAY",
				},
			]);
			const res2 = await axiosNoTokenInstance.post("/administrators/", { user_id: res.data.user.id });
			// dispatch({
			// 	type: "UPDATE_AUTH",
			// 	prop: "administrator",
			// 	payload: res2.data,
			// });
		} catch (err) {
			// dispatch({ type: "LOADED" });
			console.log(err);
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
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<View style={globalStyles.container}>
				<Modal visible={modalOpen} animationType="slide">
					<View style={globalStyles.container}>
						<Icon name="close" onPress={() => setModalOpen(false)} />
						<Formik
							validationSchema={adminCreateSchema}
							initialValues={{
								nom: "",
								prenom: "",
								telephone: "",
								email: "",
								adresse: "",
								motDePasse: "",
								motDePasseR: "",
							}}
							onSubmit={(values) => {
								handleCreateAdmin(
									values.nom,
									values.prenom,
									values.telephone,
									values.email,
									values.adresse,
									values.motDePasse
								);
								// handlePress();
							}}
						>
							{(props) => (
								<ScrollView style={{ flex: 1, opacity: 1, paddingTop: 15 }}>
									<TextInput
										label="Nom"
										mode="outlined"
										onChangeText={props.handleChange("nom")}
										value={props.values.nom}
										onBlur={props.handleBlur("nom")}
									/>
									<HelperText type="error" visible={true}>
										{props.touched.nom && props.errors.nom}
									</HelperText>

									<TextInput
										label="Prenom"
										mode="outlined"
										onChangeText={props.handleChange("prenom")}
										value={props.values.prenom}
										onBlur={props.handleBlur("prenom")}
									/>
									<HelperText type="error" visible={true}>
										{props.touched.prenom && props.errors.prenom}
									</HelperText>

									<TextInput
										keyboardType="numeric"
										mode="outlined"
										label="Telephone"
										onChangeText={props.handleChange("telephone")}
										value={props.values.telephone}
										onBlur={props.handleBlur("telephone")}
									/>
									<HelperText type="error" visible={true}>
										{props.touched.telephone && props.errors.telephone}
									</HelperText>

									<TextInput
										keyboardType="email-address"
										label="Email"
										mode="outlined"
										onChangeText={props.handleChange("email")}
										value={props.values.email}
										onBlur={props.handleBlur("email")}
									/>
									<HelperText type="error" visible={true}>
										{props.touched.email && props.errors.email}
									</HelperText>

									<TextInput
										label="Addresse"
										mode="outlined"
										onChangeText={props.handleChange("adresse")}
										value={props.values.adresse}
										onBlur={props.handleBlur("adresse")}
									/>
									<HelperText type="error" visible={true}>
										{props.touched.adresse && props.errors.adresse}
									</HelperText>

									<TextInput
										secureTextEntry={true}
										label="Mot de passe"
										mode="outlined"
										onChangeText={props.handleChange("motDePasse")}
										value={props.values.motDePasse}
										onBlur={props.handleBlur("motDePasse")}
									/>
									<HelperText type="error" visible={true}>
										{props.touched.motDePasse && props.errors.motDePasse}
									</HelperText>

									<TextInput
										secureTextEntry={true}
										label="Repeter mot de passe"
										mode="outlined"
										onChangeText={props.handleChange("motDePasseR")}
										value={props.values.motDePasseR}
										onBlur={props.handleBlur("motDePasseR")}
									/>
									<HelperText type="error" visible={true}>
										{props.touched.motDePasseR && props.errors.motDePasseR}
									</HelperText>

									<FlatButton
										text={loading ? "loading..." : "Add Administrator"}
										onPress={() => {
											setLoading(true);
											props.handleSubmit();
										}}
										color="black"
									/>
								</ScrollView>
							)}
						</Formik>
					</View>
				</Modal>

				<FlatList
					data={admins}
					keyExtractor={(admin, index) => index.toString()}
					renderItem={({ item }) => (
						<TouchableOpacity onPress={() => navigation.navigate("Details de l'admin", item)}>
							<ListItem bottomDivider containerStyle={{ borderRadius: 20, marginBottom: 20 }}>
								<Avatar size={35} rounded source={{ uri: item.avatar }} />
								<ListItem.Content>
									<ListItem.Title>{`${item.first_name} ${item.name}`}</ListItem.Title>
									<ListItem.Subtitle>{item.email}</ListItem.Subtitle>
								</ListItem.Content>
								<Icon
									name="arrow-forward-ios"
									type="material"
									// disabled={permissions ? false : true}
									color="#ff751a"
								/>
							</ListItem>
						</TouchableOpacity>
					)}
				/>
				<Icon
					name="add-circle"
					size={70}
					color="#ff884b"
					// color={auth.permissions ? "#f4511e" : "#bbb"}
					containerStyle={{ position: "absolute", bottom: 10, right: 10 }}
					onPress={() => setModalOpen(true)}
					// disabled={auth.permissions ? false : true}
				/>
			</View>
		</TouchableWithoutFeedback>
	);
}
