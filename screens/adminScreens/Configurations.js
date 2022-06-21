import { Formik } from "formik";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { Button, TextInput, HelperText } from "react-native-paper";

import { View, Text, TouchableWithoutFeedback, Keyboard, ScrollView, Alert, StyleSheet } from "react-native";
import { Avatar, Icon, ListItem } from "react-native-elements";
import FlatButton from "../../shared/button";
import { globalStyles } from "../../styles/global";
import * as yup from "yup";
import { ConfigContext } from "../../contexts/configContext";
import axiosNoTokenInstance from "../../utils/axiosNoTokenInstance";

const configChangeSchema = yup.object({
	interet: yup
		.string()
		.required("un montant est requis")
		.test("isValidNumber", "valuer invalid", (val) => parseInt(val) > 0),
	fond: yup
		.string()
		.required("un montant du fond social est requis")
		.test("isValidNumber", "montant invalid", (val) => parseInt(val) > 0),
	inscription: yup
		.string()
		.required("un montant de l'inscription est requis")
		.test("isValidNumber", "montant invalid", (val) => parseInt(val) > 0),
	pret: yup
		.string()
		.required("un montant de l'inscription est requis")
		.test("isValidNumber", "montant invalid", (val) => parseInt(val) > 0),
});

export default function Configurations() {
	const [loading, setLoading] = useState(false);
	const { configs, configDispatch } = useContext(ConfigContext);
	// console.log("CONFIGS:", configs);
	const [modalOpen, setModalOpen] = useState(false);

	const handleSaveConfig = async (
		interest_per_borrow,
		monthly_contribution_per_member,
		inscription_per_member,
		no_months_to_pay_0_to_300K
	) => {
		const body = JSON.stringify({
			interest_per_borrow,
			monthly_contribution_per_member,
			inscription_per_member,
			no_months_to_pay_0_to_300K,
		});
		try {
			const res = await axiosNoTokenInstance.put("/configs/1/", body);
			console.log("RESULT:", res.data);
			console.log("configs", configs);
			console.log("res.data", res.data);
			configDispatch({
				type: "INITIALIZE_CONFIG",
				payload: res.data,
			});
			setLoading(false);
			setModalOpen(false);

			Alert.alert("SUCCESS", "Configuraions have been modified and saved", [
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
				<Formik
					validationSchema={configChangeSchema}
					initialValues={{
						interet: configs.interest_per_borrow.toString(),
						fond: configs.monthly_contribution_per_member.toString(),
						inscription: configs.inscription_per_member.toString(),
						pret: configs.no_months_to_pay_0_to_300K.toString(),
					}}
					onSubmit={(values) => {
						handleSaveConfig(values.interet, values.fond, values.inscription, values.pret);
						// handlePress();
					}}
				>
					{(props) => (
						<View
							style={{
								flex: 1,
								opacity: 1,
								marginTop: 100,
								borderBottomWidth: 1,
								borderBottomColor: "#222",
								borderTopColor: "#222",
								borderTopWidth: 1,
								justifyContent: "center",
								marginBottom: 100,
							}}
						>
							<TextInput
								keyboardType="numeric"
								mode="outlined"
								label="Montant de l'inscription a payer par membre"
								onChangeText={props.handleChange("inscription")}
								value={props.values.inscription}
								onBlur={props.handleBlur("inscription")}
							/>
							<HelperText type="error" visible={true} style={styles.helper}>
								{props.touched.inscription && props.errors.inscription}
							</HelperText>

							<TextInput
								keyboardType="numeric"
								mode="outlined"
								label="Montant des cotisations obligatoires"
								onChangeText={props.handleChange("fond")}
								value={props.values.fond}
								onBlur={props.handleBlur("fond")}
							/>
							<HelperText type="error" visible={true} style={styles.helper}>
								{props.touched.fond && props.errors.fond}
							</HelperText>

							<TextInput
								keyboardType="numeric"
								mode="outlined"
								label="Pourcentage interet par mois sur un emprunt"
								onChangeText={props.handleChange("interet")}
								value={props.values.interet}
								onBlur={props.handleBlur("interet")}
							/>
							<HelperText type="error" visible={true} style={styles.helper}>
								{props.touched.interet && props.errors.interet}
							</HelperText>

							<TextInput
								keyboardType="numeric"
								mode="outlined"
								label="Nombre de mois pour rembourser les prêts"
								onChangeText={props.handleChange("pret")}
								value={props.values.pret}
								onBlur={props.handleBlur("pret")}
							/>
							<HelperText type="error" visible={true} style={styles.helper}>
								{props.touched.pret && props.errors.pret}
							</HelperText>

							<FlatButton
								text={loading ? "loading..." : "Sauvegarde Configuration"}
								onPress={() => {
									Alert.alert("WARNING!!", "This Configuration would replace the previous", [
										{
											text: "Yes replace",
											onPress: () => {
												setLoading(true);
												props.handleSubmit();
											},
										},

										{
											text: "CANCEL",
										},
									]);
								}}
								color="black"
							/>
						</View>
					)}
				</Formik>
			</View>
		</TouchableWithoutFeedback>
	);
}

const styles = StyleSheet.create({
	helper: {
		marginBottom: 15,
	},
});
