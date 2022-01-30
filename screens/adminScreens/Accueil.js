import React, { useContext, useEffect, useState } from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
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

// const helpTypeCreateSchema = yup.object({
// 	titre: yup.string().required("un titre est requis"),
// 	montant: yup
// 		.string()
// 		.required("un montant est requis")
// 		.test("isValidNumber", "montant invalid", (val) => parseInt(val) > 0),
// });

export default function Accueil() {
	const { auth, dispatch } = useContext(AuthContext);
	const { members, memberDispatch } = useContext(MemberContext);
	const { configs, configDispatch } = useContext(ConfigContext);
	const { users, userDispatch } = useContext(UserContext);
	const [modalOpen, setModalOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const tresorie = 0;

	let membersWithCrown = members.filter((member) => member.social_crown == 1);

	// console.log("MEMBERS LENGTH:", members.length);
	// console.log("CONF :", configs.inscription_per_member);
	// console.log("CROWN LENGTH:", membersWithCrown.length);
	let part1 = members.length * configs.inscription_per_member;
	let part2 = membersWithCrown.length * configs.social_funds_per_member;

	// console.log("PART 1:", part1);
	// console.log("PART 1:", part1);

	let fondSocial = part1 + part2;
	// console.log("SOCIAL FUNDS:", fondSocial);
	// console.log("CONFIGS:", configs);
	// console.log("MEMBERS:", members);

	useEffect(() => {
		//set members to context
		const membersGotten = users.filter((user) => user.type == "member");

		// let newMembers = [];
		// membersGotten.forEach((gottenMember) => {
		// 	newMembers.push({
		// 		user: gottenMember,
		// 	});
		// });

		memberDispatch({ type: "INITIALIZE_MEMBERS", payload: membersGotten });
		let membersToModify = membersGotten;
		// console.log("MEMBERS TO MODIFY:", membersGotten);

		// Add to members info from members table
		const addMoreToMembers = async () => {
			for (let i = 1; i <= membersGotten.length; i++) {
				let gottenObj = await axiosNoTokenInstance.get(`/members/${i}`);
				gottenObj = gottenObj.data;
				// console.log("GOTTENOBJ:", gottenObj);
				membersToModify.forEach((member) => {
					if (member.id == gottenObj.user_id) {
						member.username = gottenObj.username;
						member.social_crown = gottenObj.social_crown;
						member.inscription = gottenObj.inscription;
						member.administrator_id = gottenObj.administrator_id;
					}
				});
			}
			// console.log("MEMBERSTOMODIFY:", membersToModify);
			memberDispatch({ type: "INITIALIZE_MEMBERS", payload: membersToModify });
		};

		addMoreToMembers();

		const loadAdmin = async () => {
			try {
				const res = await axiosNoTokenInstance.get("/administrators");
				// console.log("RES:", res.data);
				const theAdmin = res.data.filter((admin) => admin.user_id == auth.user.id);

				dispatch({
					type: "UPDATE_AUTH",
					payload: theAdmin[0].id,
					prop: "myAdminId",
				});
				if (theAdmin[0].root == 1) {
					dispatch({
						type: "UPDATE_AUTH",
						payload: true,
						prop: "permissions",
					});
				} else {
					dispatch({
						type: "UPDATE_AUTH",
						payload: false,
						prop: "permissions",
					});
				}
			} catch (err) {
				console.log(err.message);
				console.log(err.response.data);
				console.log(err.response.status);
			}
		};
		loadAdmin();
	}, []);

	return (
		<View style={{ ...globalStyles.container }}>
			<Modal visible={modalOpen} animationType="slide">
				<View style={globalStyles.container}>
					<Icon name="close" onPress={() => setModalOpen(false)} />
					<Formik
						// validationSchema={helpTypeCreateSchema}
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
									text={loading ? "loading..." : "Commencer premiere exercice"}
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
	);
}

const styles = StyleSheet.create({});
