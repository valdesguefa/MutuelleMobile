import { Alert, StyleSheet, Text, View } from "react-native";
import React, { useContext, useState } from "react";
import { globalStyles } from "../../styles/global";
import { Button, Card } from "react-native-elements";
import { MemberContext } from "../../contexts/memberContext";
import axiosNoTokenInstance from "../../utils/axiosNoTokenInstance";
import { UserContext } from "../../contexts/userContext";
import { AuthContext } from "../../contexts/AuthContext";

const MembreDetails = (props) => {
	const { members, memberDispatch } = useContext(MemberContext);
	const { users, userDispatch } = useContext(UserContext);
	const { auth, dispatch } = useContext(AuthContext);
	const [permissions, setPermissions] = useState(auth.permissions);

	// console.log("MEMBERS:", members);
	// id, password, last_login, name, first_name, sex, email, avatar, tel, address, create_at, type;
	const name = props.route.params.name;
	const first_name = props.route.params.first_name;
	const email = props.route.params.email;
	const avatar = props.route.params.avatar;
	const tel = props.route.params.tel;
	const id = props.route.params.id;
	const address = props.route.params.address;
	let created_at = new Date(props.route.params.create_at);
	let date = new Date(props.route.params.create_at);
	const year = date.getFullYear();
	const theDate = date.getDate();
	const month = date.getMonth();
	const hisDate = `${theDate}-${month + 1}-${year}`;
	// console.log("CREATED AT:", created_at);
	// const created_by = props.route.params.name;
	return (
		<View style={globalStyles.container}>
			<Card style={{ display: "flex" }} containerStyle={{ borderRadius: 10 }}>
				<Card.Title>{`${first_name} ${name}`}</Card.Title>
				<Card.Divider />
				<Card.Image
					style={{ padding: 0 }}
					source={{
						uri: avatar,
					}}
				/>
				{/* <Text style={{ marginBottom: 10 }}>{FirstName} </Text> */}
				<View style={styles.row}>
					<View style={styles.col1}>
						<Text>First name:</Text>
					</View>
					<View style={styles.col2}>
						<Text>{first_name}</Text>
					</View>
				</View>
				<View style={styles.row}>
					<View style={styles.col1}>
						<Text>Last name:</Text>
					</View>
					<View style={styles.col2}>
						<Text>{name}</Text>
					</View>
				</View>
				<View style={styles.row}>
					<View style={styles.col1}>
						<Text>Email:</Text>
					</View>
					<View style={styles.col2}>
						<Text>{email}</Text>
					</View>
				</View>
				<View style={styles.row}>
					<View style={styles.col1}>
						<Text>Contact:</Text>
					</View>
					<View style={styles.col2}>
						<Text>{tel}</Text>
					</View>
				</View>
				<View style={styles.row}>
					<View style={styles.col1}>
						<Text>Address:</Text>
					</View>
					<View style={styles.col2}>
						<Text>{address}</Text>
					</View>
				</View>
				<View style={styles.row}>
					<View style={styles.col1}>
						<Text>Added on:</Text>
					</View>
					<View style={styles.col2}>
						<Text>{hisDate}</Text>
					</View>
				</View>
				<Card.Divider />
				<Button
					disabled={permissions ? false : true}
					color="red"
					// color={permissions ? "red" : "#bbb"}
					title="Delete"
					icon={{
						name: "deleteuser",
						type: "antdesign",
						size: 15,
						color: "white",
					}}
					iconContainerStyle={{ marginRight: 5 }}
					buttonStyle={{
						backgroundColor: "red",
						// backgroundColor: permissions ? "red" : "#bbb",
						borderColor: "transparent",
						borderWidth: 0,
						borderRadius: 30,
					}}
					containerStyle={{
						alignSelf: "flex-end",
						width: 90,
						marginHorizontal: 5,
						marginVertical: 3,
					}}
					onPress={() =>
						Alert.alert("WARNING!!", "This member would be deleted", [
							{
								text: "DELETE",
								onPress: async () => {
									try {
										const res = await axiosNoTokenInstance.delete(`/users/${id}/`);
										memberDispatch({
											type: "DELETE_MEMBER",
											id: id,
										});
										userDispatch({
											type: "DELETE_USER",
											id: id,
										});
										props.navigation.goBack();
										Alert.alert("SUCCESS", "Member was deleted", [
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
			</Card>
		</View>
	);
};

export default MembreDetails;

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
