import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import AuthContextProvider from "./contexts/AuthContext";
import WelcomeStack from "./routes/welcomeStack";
import { globalStyles } from "./styles/global";
import { SafeAreaProvider } from "react-native-safe-area-context";
import MemberContextProvider from "./contexts/memberContext";
import AdministratorContextProvider from "./contexts/administratorContext";
import UserContextProvider from "./contexts/userContext";
import { configureFonts, DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import HelpTypeContextProvider from "./contexts/helpTypeContext";
import SessionContextProvider from "./contexts/sessionContext";
import ExerciseContextProvider from "./contexts/exerciseContext";
import HelpContextProvider from "./contexts/helpContext";
import SavingContextProvider from "./contexts/savingContext";
import RefundContextProvider from "./contexts/refundContext";
import BorrowingContextProvider from "./contexts/borrowingContext";
import ConfigContextProvider from "./contexts/configContext";
import AppLoading from "expo-app-loading";
import { useFonts } from "expo-font";

const fontConfig = {
	web: {
		regular: {
			fontFamily: "sans-serif",
			fontWeight: "normal",
		},
		medium: {
			fontFamily: "sans-serif-medium",
			fontWeight: "normal",
		},
		light: {
			fontFamily: "roboto-light",
			fontWeight: "normal",
		},
		thin: {
			fontFamily: "roboto-thin",
			fontWeight: "normal",
		},
	},
	ios: {
		regular: {
			fontFamily: "roboto-regular",
			fontWeight: "normal",
		},
		medium: {
			fontFamily: "sans-serif-medium",
			fontWeight: "normal",
		},
		light: {
			fontFamily: "sans-serif-light",
			fontWeight: "normal",
		},
		thin: {
			fontFamily: "sans-serif-thin",
			fontWeight: "normal",
		},
	},
	android: {
		regular: {
			fontFamily: "roboto-regular",
			fontWeight: "normal",
		},
		medium: {
			fontFamily: "sans-serif-medium",
			fontWeight: "normal",
		},
		light: {
			fontFamily: "roboto-light",
			fontWeight: "normal",
		},
		thin: {
			fontFamily: "roboto-thin",
			fontWeight: "normal",
		},
	},
};

const theme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		roundness: 10,
		primary: "tomato",
		accent: "#ff751a",
	},
	fonts: configureFonts(fontConfig),
};

export default function App() {
	let [fontsLoaded] = useFonts({
		"roboto-bold": require("./assets/fonts/Roboto-Bold.ttf"),
		poppinsLight: require("./assets/fonts/Poppins-Light.otf"),
		poppinsBold: require("./assets/fonts/poppins-bold.ttf"),
		PoppinsMedium: require("./assets/fonts/Poppins-Medium.otf"),
		newFont: require("./assets/fonts/Montserrat-VariableFont_wght.ttf"),
		"roboto-regular": require("./assets/fonts/Roboto-Regular.ttf"),
		"roboto-light": require("./assets/fonts/Roboto-Light.ttf"),
		"roboto-thin": require("./assets/fonts/Roboto-Thin.ttf"),
	});

	if (!fontsLoaded) {
		return <AppLoading />;
	}

	return (
		<AuthContextProvider>
			<ConfigContextProvider>
				<UserContextProvider>
					<AdministratorContextProvider>
						<MemberContextProvider>
							<HelpTypeContextProvider>
								<SessionContextProvider>
									<ExerciseContextProvider>
										<HelpContextProvider>
											<SavingContextProvider>
												<RefundContextProvider>
													<BorrowingContextProvider>
														<SafeAreaProvider>
															<PaperProvider theme={theme}>
																<WelcomeStack />
															</PaperProvider>
														</SafeAreaProvider>
													</BorrowingContextProvider>
												</RefundContextProvider>
											</SavingContextProvider>
										</HelpContextProvider>
									</ExerciseContextProvider>
								</SessionContextProvider>
							</HelpTypeContextProvider>
						</MemberContextProvider>
					</AdministratorContextProvider>
				</UserContextProvider>
			</ConfigContextProvider>
		</AuthContextProvider>
	);

	//console.log("APP.JS");
}

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		backgroundColor: "#fff",
// 		alignItems: "center",
// 		justifyContent: "center",
// 	},
// });
