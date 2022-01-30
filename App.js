import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import AuthContextProvider from "./contexts/AuthContext";
import WelcomeStack from "./routes/welcomeStack";
import { globalStyles } from "./styles/global";
import { SafeAreaProvider } from "react-native-safe-area-context";
import MemberContextProvider from "./contexts/memberContext";
import AdministratorContextProvider from "./contexts/administratorContext";
import UserContextProvider from "./contexts/userContext";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import HelpTypeContextProvider from "./contexts/helpTypeContext";
import SessionContextProvider from "./contexts/sessionContext";
import ExerciseContextProvider from "./contexts/exerciseContext";
import HelpContextProvider from "./contexts/helpContext";
import SavingContextProvider from "./contexts/savingContext";
import RefundContextProvider from "./contexts/refundContext";
import BorrowingContextProvider from "./contexts/borrowingContext";
import ConfigContextProvider from "./contexts/configContext";

const theme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		primary: "tomato",
		accent: "#ff751a",
	},
};

export default function App() {
	//console.log("APP.JS");
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
}

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		backgroundColor: "#fff",
// 		alignItems: "center",
// 		justifyContent: "center",
// 	},
// });
