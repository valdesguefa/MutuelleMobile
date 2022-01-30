import React, { useEffect, useContext } from "react";
import { StyleSheet, Button, View, Text, Alert, ImageBackground } from "react-native";
import { globalStyles } from "../styles/global.js";
import { Formik } from "formik";
import FlatButton from "../shared/button.js";
import { AuthContext } from "../contexts/AuthContext";
import axiosNoTokenInstance from "../utils/axiosNoTokenInstance.js";
import * as yup from "yup";
import AccueilDrawer from "../routes/AdminRoutes/AccueilDrawer.js";
import { Image } from "react-native";
import { HelperText, TextInput } from "react-native-paper";
import MemAccueilDrawer from "../routes/AdminRoutes/MemAccueilDrawer.js";

const reviewSchema = yup.object({
	email: yup.string().required().email(),
	password: yup.string().required(),
});

export default function Login({ navigation }) {
	//console.log("LOGIN.JS\n");

	const { auth, dispatch } = useContext(AuthContext);

	const login = (email, password) => {
		dispatch({ type: "LOADING" });

		// Request Body
		const body = JSON.stringify({ email, password });

		axiosNoTokenInstance
			.post("/auth/login", body)
			.then((res) => {
				//console.log(res.data);
				dispatch({
					type: "LOGIN_SUCCESS",
					payload: res.data,
				});
			})
			.catch((err) => {
				dispatch({ type: "LOADED" });
				//console.log(err.response.data);
				Alert.alert("OOPS!", "A user with this credentials does not exist.", [
					{
						text: "Understood",
					},
				]);
			});
	};

	// if (auth.isAuthenticated) {
	// 	// navigation.setOptions({ headerShown: false });
	// }
	if (!auth.isAuthenticated) {
		return (
			<ImageBackground
				style={{ ...globalStyles.container, ...styles.container }}
				// source={require("../assets/login1.jpg")}
			>
				<Formik
					validationSchema={reviewSchema}
					initialValues={{ email: "", password: "" }}
					onSubmit={(values) => {
						// //console.log(values);
						login(values.email, values.password);
						// handlePress();
					}}
				>
					{(props) => (
						<View style={{ ...styles.formikView, opacity: 1 }}>
							<Image
								source={require("../assets/polytech-logo.png")}
								style={{
									width: 200,
									height: 200,
									alignSelf: "center",
									// position: "absolute",
									// top: 10,
								}}
							></Image>
							<TextInput
								style={{ marginTop: 30 }}
								label="Email"
								onChangeText={props.handleChange("email")}
								value={props.values.email}
								onBlur={props.handleBlur("email")}
							/>
							<HelperText type="error" visible={true}>
								{props.touched.email && props.errors.email}
							</HelperText>

							<TextInput
								secureTextEntry={true}
								label="Password"
								onChangeText={props.handleChange("password")}
								value={props.values.password}
								onBlur={props.handleBlur("password")}
							/>
							<HelperText type="error" visible={true} style={{ marginBottom: 20 }}>
								{props.touched.password && props.errors.password}
							</HelperText>

							<FlatButton text={auth.loading ? "loading..." : "login"} onPress={props.handleSubmit} color="black" />
						</View>
					)}
				</Formik>
			</ImageBackground>
		);
	} else {
		return auth.user.type == "member" ? <MemAccueilDrawer /> : <AccueilDrawer />;
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#ff751a",
		justifyContent: "center",
	},
	formikView: {
		padding: 30,
		marginTop: 50,
		flex: 1,
		// justifyContent: "center",
	},
});
