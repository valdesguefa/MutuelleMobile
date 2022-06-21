import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Header from "../shared/header";
import { Icon } from "react-native-elements";
import EpargnesDetail from "../screens/adminScreens/EpargnesDetail";
import Epargnes from "../screens/adminScreens/Epargnes";
import UserProfileAdmin from "../screens/memberScreens/UserProfileAdmin";
import ProfilUpdate from "../screens/memberScreens/ProfilUpdate";

const Stack = createNativeStackNavigator();

export default function ProfileStack() {
	return (
		<Stack.Navigator
			initialRouteName="user profile"
			screenOptions={{
				headerStyle: {
					backgroundColor: "#eee",
					// height: 60,
				},
				headerTintColor: "#444",
			}}
		>
			<Stack.Screen
				name="user profile"
				component={UserProfileAdmin}
				options={{
					headerStyle: { height: 30 },
					headerShown: false,
					headerTitle: () => <Header title="Les Epargnes" />,
				}}
			/>
			<Stack.Screen
				name="Profile update"
				component={ProfilUpdate}
				options={({ navigation }) => ({
					headerLeft: () => (
						<Icon
							iconStyle={{ marginLeft: 5, marginRight: 45 }}
							size={30}
							name="arrow-back"
							// color="white"
							onPress={() => navigation.goBack()}
						/>
					),
				})}
			/>
		</Stack.Navigator>
	);
}
