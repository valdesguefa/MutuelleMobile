import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import React, { useContext, useState } from "react";
import { globalStyles } from "../../styles/global";
import { Button, Card, ListItem } from "react-native-elements";
import { MemberContext } from "../../contexts/memberContext";
import axiosNoTokenInstance from "../../utils/axiosNoTokenInstance";
import { UserContext } from "../../contexts/userContext";
import { AuthContext } from "../../contexts/AuthContext";
import { AdministratorContext } from "../../contexts/administratorContext";

const EmpruntsDetail = (props) => {
	const { admins, adminDispatch } = useContext(AdministratorContext);
	const { users, userDispatch } = useContext(UserContext);
	const { members, memberDispatch } = useContext(MemberContext);
	const { auth, dispatch } = useContext(AuthContext);
	const [permissions, setPermissions] = useState(auth.permissions);

	const getMemberNames = (id) => {
		const him = members.find((member) => member.member_id == id);
		return `${him.first_name} ${him.name}`;
	};

	// console.log("MEMBERS:", members);
	// id, password, last_login, name, first_name, sex, email, avatar, tel, address, create_at, type;
	// const date = props.route.params.date;
	const id = props.route.params.id;
	const administrator_id = props.route.params.administrator_id;
	const borrowings = props.route.params.borrowings;
	const exercise_id = props.route.params.exercise_id;

	let date = new Date(props.route.params.create_at);
	const year = date.getFullYear();
	const theDate = date.getDate();
	const month = date.getMonth();
	const hisDate = `${theDate}-${month + 1}-${year}`;

	const getDate = (string) => {
		const date = new Date(string);
		return date.toDateString();
	};
	console.log("borrowings", borrowings);
	// console.log("CREATED AT:", created_at);
	// const created_by = props.route.params.name;
	return (
		<View style={globalStyles.container}>
			{borrowings ? (
				<Card style={{ display: "flex" }} containerStyle={{ borderRadius: 10, flex: 1 }}>
					<Card.Title>{`Session de: ${getDate(props.route.params.date)}`}</Card.Title>
					<Card.Divider />
					{borrowings.length == 0 && <Text>Aucun Emprunt faite</Text>}
					<FlatList
						data={borrowings}
						keyExtractor={(item, index) => index.toString()}
						renderItem={({ item }) => (
							<ListItem bottomDivider containerStyle={{ borderRadius: 20, marginBottom: 20 }}>
								<ListItem.Content>
									<ListItem.Title>{`Emprunt du membre : ${getMemberNames(item.member_id)}`}</ListItem.Title>
									<ListItem.Subtitle>{`montant total de l'emprunts: ${item.amount_borrowed}`}</ListItem.Subtitle>
									<ListItem.Subtitle>{`intérêt ajouté': ${item.interest}`}</ListItem.Subtitle>
									<ListItem.Subtitle>{`montant à rembourser: ${item.amount_to_pay}`}</ListItem.Subtitle>
									<ListItem.Subtitle>{`montant remboursé: ${item.amount_paid}`}</ListItem.Subtitle>
									<ListItem.Subtitle>{`délai de paiement: ${getDate(item.payment_date_line)}`}</ListItem.Subtitle>
								</ListItem.Content>
							</ListItem>
						)}
					/>
					<Card.Divider />
				</Card>
			) : (
				<Text>Aucun Emprunt faite</Text>
			)}
		</View>
	);
};

export default EmpruntsDetail;

const styles = StyleSheet.create({
	row: {
		position: "relative",
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 20,
	},
	col2: {
		position: "absolute",
		left: 140,
	},
});
