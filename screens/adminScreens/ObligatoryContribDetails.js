import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import React, { useContext, useState, useEffect } from "react";
import { globalStyles } from "../../styles/global";
import { Button, Card, ListItem } from "react-native-elements";
import { MemberContext } from "../../contexts/memberContext";
import axiosNoTokenInstance from "../../utils/axiosNoTokenInstance";
import { UserContext } from "../../contexts/userContext";
import { AuthContext } from "../../contexts/AuthContext";
import { AdministratorContext } from "../../contexts/administratorContext";

const ObligatoryContribDetails = (props) => {
	const { admins, adminDispatch } = useContext(AdministratorContext);
	const { users, userDispatch } = useContext(UserContext);
	const { members, memberDispatch } = useContext(MemberContext);
	const { auth, dispatch } = useContext(AuthContext);
	const [permissions, setPermissions] = useState(auth.permissions);
	const [theObjectS, setTheObjectS] = useState(null);
	const [loadin, setLoadin] = useState(false);
	const getMemberNames = (id) => {
		const him = members.find((member) => member.member_id == id);
		return `${him.first_name} ${him.name}`;
	};

	// console.log("savings", savings);
	// console.log("MEMBERS:", members);
	// id, password, last_login, name, first_name, sex, email, avatar, tel, address, create_at, type;
	// const date = props.route.params.date;
	// const id = props.route.params.id;
	// const administrator_id = props.route.params.administrator_id;
	// const savings = props.route.params.savings;
	// const exercise_id = props.route.params.exercise_id;

	let date = new Date(props.route.params.create_at);
	const year = date.getFullYear();
	const theDate = date.getDate();
	const month = date.getMonth();
	const hisDate = `${theDate}-${month + 1}-${year}`;

	const getDate = (string) => {
		const date = new Date(string);
		return date.toDateString();
	};

	const itemSent = props.route.params;
	console.log("itemSent", itemSent);
	const obliContribs = itemSent.item.obliContribs;

	// console.log("CREATED AT:", created_at);
	// const created_by = props.route.params.name;
	// const GetMemberWhoContributed = async (borrow) => {
	// 	let res = await axiosNoTokenInstance.get(`/members/${borrow.member_id}`);
	// 	const user_id = res.data.user_id;r
	// 	res = await axiosNoTokenInstance.get(`/users/${user_id}`);
	// 	borrow.userName = res.data.first_name + " " + res.data.name;
	// 	console.log("theObject", theObject);
	// 	setTheObjectS(theObject);
	// };
	console.log("obliContribs", obliContribs);

	// const asyncCall = async () => {
	// 	const waitForThis = async () => {
	// 		obliContribs.forEach((borrow) => {
	// 			GetMemberWhoContributed(borrow);
	// 		});
	// 	};

	// 	await waitForThis();
	// 	setTheObjectS(theObject);
	// };

	// useEffect(() => {
	// 	asyncCall();
	// }, []);
	// setTimeout(() => {
	// 	setTheObjectS({ ...theObject });
	// }, 200);

	return (
		<View style={globalStyles.container}>
			{obliContribs ? (
				<Card style={{ display: "flex" }} containerStyle={{ borderRadius: 10, flex: 1 }}>
					<Card.Title>{`Membres qui ont contribué pendant la Session de: ${getDate(
						props.route.params.item.create_at
					)}`}</Card.Title>
					<Card.Divider />
					{obliContribs.length == 0 && <Text>Aucune Contribution obligatoire faite</Text>}
					<FlatList
						data={obliContribs}
						keyExtractor={(item, index) => index.toString()}
						renderItem={({ item }) => (
							<ListItem bottomDivider containerStyle={{ borderRadius: 20, marginBottom: 20 }}>
								<ListItem.Content>
									<ListItem.Title>{`${getMemberNames(item.member_id)}`}</ListItem.Title>
								</ListItem.Content>
							</ListItem>
						)}
					/>
					<Card.Divider />
				</Card>
			) : (
				<Text>Aucune Contribution obligatoire faite</Text>
			)}
		</View>
	);
};

export default ObligatoryContribDetails;

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
