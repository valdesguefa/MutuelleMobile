import { Formik } from "formik";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { Button, TextInput, HelperText } from "react-native-paper";

import { View, Text, Modal, TouchableWithoutFeedback, Keyboard, ScrollView, FlatList, Alert } from "react-native";
import { Avatar, Icon, ListItem } from "react-native-elements";
import FlatButton from "../../shared/button";
import { globalStyles } from "../../styles/global";
import * as yup from "yup";
import { HelpTypeContext } from "../../contexts/helpTypeContext";
import axiosNoTokenInstance from "../../utils/axiosNoTokenInstance";

const helpTypeCreateSchema = yup.object({
	titre: yup.string().required("un titre est requis"),
	montant: yup
		.string()
		.required("un montant est requis")
		.test("isValidNumber", "montant invalid", (val) => parseInt(val) > 0),
});

export default function TypeDaides() {
	const [loading, setLoading] = useState(false);
	const { helpTypes, helpTypeDispatch } = useContext(HelpTypeContext);
	const [modalOpen, setModalOpen] = useState(false);

	const handleCreateMember = async (title, amount) => {
		const body = JSON.stringify({
			title,
			amount,
		});
		try {
			const res = await axiosNoTokenInstance.post("/help_types/", body);
			console.log("RESULT:", res.data);
			helpTypeDispatch({
				type: "ADD_HELPTYPE",
				payload: res.data,
			});
			setLoading(false);
			setModalOpen(false);

			Alert.alert("SUCCESS", "A new Help type has been created", [
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
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<View style={globalStyles.container}>
				<Modal visible={modalOpen} animationType="slide">
					<View style={globalStyles.container}>
						<Icon name="close" onPress={() => setModalOpen(false)} />
						<Formik
							validationSchema={helpTypeCreateSchema}
							initialValues={{
								titre: "",
								montant: "",
							}}
							onSubmit={(values) => {
								handleCreateMember(values.titre, values.montant);
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
									<TextInput
										label="Titre de l'aide"
										mode="outlined"
										onChangeText={props.handleChange("titre")}
										value={props.values.titre}
										onBlur={props.handleBlur("titre")}
									/>
									<HelperText type="error" visible={true} style={{ marginBottom: 20 }}>
										{props.touched.titre && props.errors.titre}
									</HelperText>

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
										text={loading ? "loading..." : "Ajouter type de l'aide"}
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

				{helpTypes ? (
					<FlatList
						data={helpTypes}
						keyExtractor={(member, index) => index.toString()}
						renderItem={({ item }) => (
							<ListItem bottomDivider containerStyle={{ borderRadius: 20, marginBottom: 20 }}>
								<Avatar
									rounded
									icon={{
										name: "hand-holding-heart",
										type: "font-awesome-5",
										color: "#ff751a",
									}}
								/>
								<ListItem.Content>
									<ListItem.Title>{item.title}</ListItem.Title>
									<ListItem.Subtitle>{item.amount}</ListItem.Subtitle>
								</ListItem.Content>
								<Icon
									name="delete"
									type="antdesign"
									color="red"
									onPress={() =>
										Alert.alert("WARNING!!", "This Help Type would be deleted", [
											{
												text: "DELETE",
												onPress: async () => {
													try {
														const res = await axiosNoTokenInstance.delete(`/help_types/${item.id}/`);
														helpTypeDispatch({
															type: "DELETE_HELPTYPE",
															id: item.id,
														});

														Alert.alert("SUCCESS", "Help type was deleted", [
															{
																text: "OKAY",
															},
														]);
													} catch (err) {
														console.log(err);
													}
												},
											},

											{
												text: "CANCEL",
											},
										])
									}
								/>
							</ListItem>
						)}
					/>
				) : (
					"loading help types...."
				)}
				{/* <Button onPress={console.log("MEMBERS LOG:", members)}>Press me</Button> */}
				<Icon
					name="add-circle"
					size={70}
					color="#ff884b"
					containerStyle={{ position: "absolute", bottom: 10, right: 10 }}
					onPress={() => setModalOpen(true)}
				/>
			</View>
		</TouchableWithoutFeedback>
	);
}
