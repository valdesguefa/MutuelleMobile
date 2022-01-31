import React, { useEffect, useState, useContext } from "react";
import {
	TouchableOpacity,
	Image,
	ImageBackground,
	ScrollView,
	StyleSheet,
	Switch,
	Text,
	TouchableHighlight,
	View,
	Platform,
	Alert,
} from "react-native";
import { t, color } from "react-native-tailwindcss";
import Input from "./Input";
import Button from "./Button";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import headerObj from '../../shared/token';
import { AuthContext } from "../../contexts/AuthContext";
import URL from '../../shared/URL';
//import RN from 'react-native';
import * as ImagePicker from "expo-image-picker";
//import { Icon } from 'react-native-vector-icons/icon';
import { TextInput } from "react-native-paper";
//const SCREEN_HEIGHT = RN.Dimensions.get('window').height;
import * as Animatable from "react-native-animatable";
const EMAIL_REGEX =
	/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default function ProfilUpdate() {
	const [isBillingDifferent, setIsBillingDifferent] = useState(false);
	// const { handleSubmit, control, errors } = useForm();
	const [pickedImagePath, setPickedImagePath] = useState("");

	const {
		handleSubmit,
		control,
		setError,
		formState: { errors },
		setValue,
	} = useForm({
		criteriaMode: "all",
	});
	const toggleBilling = () => {
		setIsBillingDifferent((prev) => !prev);
	};
	const [userPassword, setuserPassword] = useState(null);
	const [newPassword, setnewPassword] = useState(null);
	const [confirmPassword, setconfirmPassword] = useState(null);
	const [password, setPassword] = useState("");
	const [email, setemail] = useState("");
	const [boolPassword1, setboolPassword1] = useState(true);
	const [boolPassword2, setboolPassword2] = useState(true);
	const [boolPassword3, setboolPassword3] = useState(true);
	const [user, setuser] = useState({});
	const [member, setmember] = useState({});
	const [users, setusers] = useState([]);
	const { auth, dispatch } = useContext(AuthContext);
	const [members, setmembers] = useState([]);
	const [loadingSubmit, setloadingSubmit] = useState(false);

	  //recuperation du password et email
	  useEffect(() => {
		//console.log("^^^^^^^^^^^^^^^",auth.user.email)
		setemail(auth.user.email);
		setPassword(auth.user.password);
	}, [auth]);
	//requete vers l'API pour avoir le user correspondant
	useEffect(() => {
		axios
			.get(URL + `users/`, headerObj)
			.then((response) => {
				var val = [];
				// console.log('donner recu',response.data)
				for (let obj of response.data) {
					if (password === obj.password && email === obj.email) {
						setuser(obj);
					}
					val.push(obj);
				}
				setusers(val);
			})
			.catch((error) => {
				console.log("voici l'erreur", error);
			});
	}, [password, email]);

	//requete pour avoir le username de l'utilisateur correspondant
	useEffect(() => {
		axios
			.get(URL + `members/`, headerObj)
			.then((response) => {
				var val = [];
				//console.log('userr infos',user['url'])
				for (let temp of response.data) {
					if (temp["user_id"] === user["id"]) {
						setmember(temp);
					}
					val.push(temp);
				}
				setmembers(val);
			})
			.catch((error) => {
				console.log("voici l'erreur", error);
			});
	}, [user]);

	useEffect(() => {
		if (user) {
			if (member["username"] !== null || member["username"] !== undefined) {
				setValue("username", member["username"]);
				setValue("first_name", user["first_name"]);
				setValue("name", user["name"]);
				setValue("telephone", user["tel"]);
				setValue("email", user["email"]);
				setValue("adresse", user["address"]);
			}
		}
	}, [user, member["username"]]);

	const AlreadyExist = (userApp) => {
		//console.log('*********************userApp***************',userApp)
		var bool = false;
		var tab1 = users.filter((us) => us["id"] !== user["id"]);
		console.log("................filtre des users..............", tab1);
		var tab2 = members.filter((us) => us["username"] !== member["username"]);
		console.log("................filtre des membres..............", tab2);
		for (let obj of tab1) {
			if (
				obj["name"].toLowerCase() === userApp["name"].toLowerCase() &&
				obj["first_name"].toLowerCase() === userApp["first_name"].toLowerCase()
			) {
				setError("name", {
					message: null,
					types: {
						myError: "ce membre existe deja",
					},
				});
				setError("first_name", {
					message: null,
					types: {
						myError: "ce membre existe deja",
					},
				});
				bool = true;
				setloadingSubmit(false);
			}
			if (obj["tel"] === userApp["telephone"]) {
				setError("telephone", {
					message: null,
					types: {
						myError: "ce numero de telephone est celui d'un autre membre",
					},
				});
				bool = true;
				setloadingSubmit(false);
			}

			if (obj["email"] === userApp["email"]) {
				setError("email", {
					message: null,
					types: {
						myError: "cet email est celui d'un autre membre",
					},
				});
				bool = true;
				setloadingSubmit(false);
			}
		}
		for (let mem of tab2) {
			if (mem["username"].toLowerCase() === userApp["username"].toLowerCase()) {
				setError("username", {
					message: null,
					types: {
						myError: "ce nom d'utilisateur est celui d'un autre membre",
					},
				});
				bool = true;
				setloadingSubmit(false);
			}
		}
		return bool;
	};

	const onSubmit = (data) => {
		//console.log('**************************member***********************',member)
		setloadingSubmit(true);
		var rep = AlreadyExist(data);
		if (userPassword !== null && userPassword !== password && isBillingDifferent) {
			setError("userPassword", {
				message: null,
				types: {
					myError: "mot de passe incorrecte",
				},
			});
			setloadingSubmit(false);
		}

		if (newPassword !== null && confirmPassword !== null && newPassword !== confirmPassword && isBillingDifferent) {
			setError("confirmPassword", {
				message: null,
				types: {
					myError: "verifier le mot de passe de confirmation",
				},
			});
			setloadingSubmit(false);
		} else {
			if (!rep) {
				const val = new FormData();
				const val2 = new FormData();
				if (!isBillingDifferent) {
					// val2.append('username', data['username'])
					//  val2.append('active', member['active'])
					//  val2.append('social_crown', member['social_crown'])
					//  val2.append('user_id', data['user_id'])
					//  val2.append('inscription', member['inscription'])
					//  val2.append('administrator_id', member['administrator_id'])
					axios
						.patch(
						URL+`members/${member["id"]}/`,
							{
								username: data["username"],
								user_id: member["user_id"],
								administrator_id: member["administrator_id"],
							},
							headerObj
						)
						.then((response) => {
							console.log("response2", response.data);
						})
						.catch((error) => console.log("error2", error));

					val.append("name", data["name"]);
					val.append("first_name", data["first_name"]);
					val.append("sex", user["sex"]);
					val.append("email", data["email"]);
					val.append("tel", data["telephone"]);
					val.append("address", data["adresse"]);
					val.append("password", user["password"]);
					if (pickedImagePath !== "") {
						val.append("avatar", {
							uri: pickedImagePath,
							name: "user.png",
							fileName: "image",
							type: "image/png",
						});
					}
					if (pickedImagePath === "") {
						val.append("avatar", {
							uri: user["avatar"],
							name: "user.png",
							fileName: "image",
							type: "image/png",
						});
					}
					axios
						.put(URL+`users/${user["id"]}/`, val, headerObj)
						.then((response) => {
							console.log("response1"); //,response)
							setloadingSubmit(false);
						})
						.catch((error) => {
							setloadingSubmit(false);
							console.log("error1", error);
						});
				} else {
					// val2.append('username', data['username'])
					//  val2.append('active', member['active'])
					//  val2.append('social_crown', member['social_crown'])
					//  val2.append('user_id', data['user_id'])
					//  val2.append('inscription', member['inscription'])
					//  val2.append('administrator_id', member['administrator_id'])
					axios
						.put(
							URL+`members/${member["id"]}/`,
							{
								username: data["username"],
								user_id: member["user_id"],
								administrator_id: member["administrator_id"],
							},
							headerObj
						)
						.then((response) => {
							console.log("response2"); //,response)
							//setloadingSubmit(false)
						})
						.catch((error) => {
							console.log("error2", error);
						});

					val.append("name", data["name"]);
					val.append("first_name", data["first_name"]);
					val.append("sex", user["sex"]);
					val.append("email", data["email"]);
					val.append("tel", data["telephone"]);
					val.append("address", data["adresse"]);
					val.append("password", data["confirmPassword"]);
					if (pickedImagePath !== "") {
						val.append("avatar", {
							uri: pickedImagePath,
							name: "user.png",
							fileName: "image",
							type: "image/png",
						});
					}
					if (pickedImagePath === "") {
						val.append("avatar", {
							uri: user["avatar"],
							name: "user.png",
							fileName: "image",
							type: "image/png",
						});
					}
					axios
						.put(URL+`users/${user["id"]}/`, val, headerObj)
						.then((response) => {
							console.log("la modification des informations utilisateurs c'est bien passee"); //,response)
							setloadingSubmit(false);
						})
						.catch((error) => {
							setloadingSubmit(false);
							console.log("error1", error);
						});
				}
				//setloadingSubmit(false)
			}
		}
	};

	// This function is triggered when the "Select an image" button pressed
	const showImagePicker = async () => {
		// Ask the user for the permission to access the media library
		const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

		if (permissionResult.granted === false) {
			alert("You've refused to allow this appp to access your photos!");
			return;
		}

		const result = await ImagePicker.launchImageLibraryAsync();

		// Explore the result
		// console.log(result);

		if (!result.cancelled) {
			setPickedImagePath(result.uri);
			console.log(result.uri);
		}
	};

	// This function is triggered when the "Open camera" button pressed
	const openCamera = async () => {
		// Ask the user for the permission to access the camera
		const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

		if (permissionResult.granted === false) {
			alert("You've refused to allow this appp to access your camera!");
			return;
		}

		const result = await ImagePicker.launchCameraAsync();

		// Explore the result
		//console.log(result);

		if (!result.cancelled) {
			setPickedImagePath(result.uri);
		}
	};
	const onSelectImage = async () => {
		Alert.alert("Profile Picture", "Choose an option", [
			{ text: "Camera", onPress: openCamera },
			{ text: "Gallery", onPress: showImagePicker },
			{ text: "Cancel", onPress: () => {} },
		]);
	};

	return (
		<View style={styles.container}>
			<ScrollView horizontal={false}>
				<View style={styles.viewImage}>
					{
						<Animatable.View
							animation="bounceIn"
							duration={2500}
							style={[styles.profileImgContainer, styles.imageProfil, { borderColor: "#FE7C00", borderWidth: 0.5 }]}
						>
							{pickedImagePath === "" ? (
								user["avatar"] !== "" && user["avatar"] !== null && user["avatar"] !== undefined ? (
									<Animatable.Image
										animation="bounceIn"
										duraton="2500"
										source={{ uri: user["avatar"] }}
										style={styles.profileImg}
									/>
								) : (
									<Animatable.Image
										animation="bounceIn"
										duraton="2500"
										source={require("../../assets/userProfil.png")}
										style={styles.profileImg}
									/>
								)
							) : (
								<Animatable.Image
									animation="bounceIn"
									duraton="2500"
									source={{ uri: pickedImagePath }}
									style={styles.profileImg}
								/>
							)}
							<TouchableOpacity onPress={onSelectImage} style={styles.roundButton1}>
								<Image source={require("../../assets/camera.png")} />
							</TouchableOpacity>
						</Animatable.View>
					}
				</View>
				<Controller
					defaultValue=""
					name="username"
					rules={{
						required: { value: true, message: "Nom d'utilisateur requis" },
					}}
					control={control}
					render={({ field: { onChange, value } }) => (
						<Input
							onChangeText={(text) => {
								onChange(text);
							}}
							value={value}
							error={errors.username}
							errorText={errors?.username?.message}
							MyerrorText={errors?.username?.types?.myError}
							label="Nom d'utilisateur"
						/>
					)}
				/>
				<Controller
					defaultValue=""
					name="first_name"
					control={control}
					rules={{
						required: { value: true, message: "Prenom requis" },
					}}
					render={({ field: { onChange, value } }) => (
						<Input
							onChangeText={(text) => {
								onChange(text);
							}}
							error={errors.first_name}
							errorText={errors?.first_name?.message}
							MyerrorText={errors?.first_name?.types?.myError}
							value={value}
							label="Prenom"
						/>
					)}
				/>
				<Controller
					defaultValue=""
					name="name"
					control={control}
					rules={{
						required: { value: true, message: "Nom requis" },
					}}
					render={({ field: { onChange, value } }) => (
						<Input
							onChangeText={(text) => {
								onChange(text);
							}}
							error={errors.name}
							errorText={errors?.name?.message}
							MyerrorText={errors?.name?.types?.myError}
							value={value}
							label="Nom"
						/>
					)}
				/>

				<Controller
					defaultValue=""
					name="telephone"
					control={control}
					rules={{
						required: { value: true, message: "Numero de telephone requis" },
					}}
					render={({ field: { onChange, value } }) => (
						<Input
							onChangeText={(text) => {
								onChange(text);
							}}
							error={errors.telephone}
							errorText={errors?.telephone?.message}
							MyerrorText={errors?.telephone?.types?.myError}
							keyboardType="phone-pad"
							value={value}
							label="Telephone"
						/>
					)}
				/>
				<Controller
					defaultValue=""
					name="email"
					control={control}
					rules={{
						required: { value: true, message: "Email requis" },
						pattern: {
							value: EMAIL_REGEX,
							message: "Email invalide",
						},
					}}
					render={({ field: { onChange, value } }) => (
						<Input
							onChangeText={(text) => {
								onChange(text);
							}}
							error={errors.email}
							errorText={errors?.email?.message}
							MyerrorText={errors?.email?.types?.myError}
							value={value}
							label="Email"
						/>
					)}
				/>
				<Controller
					defaultValue=""
					name="adresse"
					control={control}
					rules={{
						required: { value: true, message: "Adresse requise" },
					}}
					render={({ field: { onChange, value } }) => (
						<Input
							onChangeText={(text) => {
								onChange(text);
							}}
							error={errors.adresse}
							errorText={errors?.adresse?.message}
							value={value}
							label="Adresse"
						/>
					)}
				/>
				<View style={styles.switch}>
					<Text style={styles.switchText}>Changer Mot de Passe</Text>
					<Switch
						trackColor={{ false: color.gray200, true: color.orange600 }}
						thumbColor={color.gray100}
						ios_backgroundColor={color.orange600}
						onValueChange={toggleBilling}
						value={isBillingDifferent}
					/>
				</View>
				{isBillingDifferent && (
					<>
						<Controller
							defaultValue=""
							name="userPassword"
							control={control}
							rules={{
								required: { value: true, message: "Ancien mot de passe requis" },
							}}
							render={({ field: { onChange, value } }) => (
								<Input
									onChangeText={(text) => {
										onChange(text);
										setuserPassword(text);
									}}
									error={errors.userPassword}
									errorText={errors.userPassword?.message}
									MyerrorText={errors?.userPassword?.types?.myError}
									value={value}
									label="Ancien mot de passe"
									secureTextEntry={boolPassword1}
									right={
										<TextInput.Icon
											onPress={() => setboolPassword1(!boolPassword1)}
											name={boolPassword1 ? "eye" : "eye-off"}
										/>
									}
								/>
							)}
						/>
						<Controller
							defaultValue=""
							name="newPassword"
							control={control}
							rules={{
								required: { value: true, message: "Nouveau mot de passe requis" },
							}}
							render={({ field: { onChange, value } }) => (
								<Input
									onChangeText={(text) => {
										onChange(text);
										setnewPassword(text);
									}}
									error={errors.newPassword}
									secureTextEntry={boolPassword2}
									right={
										<TextInput.Icon
											onPress={() => setboolPassword2(!boolPassword2)}
											name={boolPassword2 ? "eye" : "eye-off"}
										/>
									}
									errorText={errors.newPassword?.message}
									value={value}
									label="Nouveau mot de passe"
								/>
							)}
						/>
						<Controller
							defaultValue=""
							name="confirmPassword"
							control={control}
							rules={{
								required: { value: true, message: "Confirmation du nouveau mot de passe requis" },
							}}
							render={({ field: { onChange, value } }) => (
								<View style={styles.passwordContainer}>
									<Input
										onChangeText={(text) => {
											onChange(text);
											setconfirmPassword(text);
										}}
										error={errors.confirmPassword}
										errorText={errors.confirmPassword?.message}
										secureTextEntry={boolPassword3}
										right={
											<TextInput.Icon
												onPress={() => setboolPassword3(!boolPassword3)}
												name={boolPassword3 ? "eye" : "eye-off"}
											/>
										}
										MyerrorText={errors?.confirmPassword?.types?.myError}
										value={value}
										label="Confirmation du nouveau mot de passe"
									/>
								</View>
							)}
						/>
					</>
				)}
				<Animatable.View animation="bounceIn" duration={3500}>
					<Button
						onPress={handleSubmit(onSubmit)}
						labelIcon="pencil"
						label="Modifier"
						style={styles.button}
						loading={loadingSubmit}
					/>
				</Animatable.View>
			</ScrollView>
		</View>
	);
}

const styles = {
	button: {
		backgroundColor: "#FE7C00",
	},
	passwordContainer: {
		flexDirection: "row",
		borderColor: "#000",
		paddingBottom: 10,
	},
	container: [t.flex1, t.justifyCenter, t.itemsCenter, t.p6],
	switch: [t.mB4, t.selfStart, t.flexRow, t.itemsCenter],
	switchText: [t.textBase, t.mR3, t.textGray800],
	imageProfil: {
		alignSelf: "center",
	},
	profileImgContainer: {
		marginLeft: 8,
		height: 179,
		width: 179,
		borderRadius: 40,
		marginTop: 30,
		marginBottom: 10,
	},
	profileImg: {
		height: 178,
		width: 178,
		borderRadius: 40,
	},
	viewImage: {
		justifyContent: "center",
	},
	roundButton1: {
		width: 50,
		height: 50,
		padding: 10,
		borderRadius: 100,
		backgroundColor: "#FE7C00",
		marginTop: -47,
		marginLeft: 138,
	},
};
