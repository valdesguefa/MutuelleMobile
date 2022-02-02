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
	// console.log("CREATED AT:", created_at);
	// const created_by = props.route.params.name;
	return (
		<View style={globalStyles.container}>
			{borrowings ? (
				<Card style={{ display: "flex" }} containerStyle={{ borderRadius: 10 }}>
					<Card.Title>{`${hisDate}  Session id: ${id}`}</Card.Title>
					<Card.Divider />
					<FlatList
						data={borrowings}
						keyExtractor={(item, index) => index.toString()}
						renderItem={({ item }) => (
							<ListItem bottomDivider containerStyle={{ borderRadius: 20, marginBottom: 20 }}>
								<ListItem.Content>
									<ListItem.Title>{`Emprunt du membre : ${getMemberNames(item.member_id)}`}</ListItem.Title>
									<ListItem.Subtitle>{`montant total de l'emprunts': ${item.amount}`}</ListItem.Subtitle>
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
