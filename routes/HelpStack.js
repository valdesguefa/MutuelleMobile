import Welcome from "../screens/Welcome";
import Login from "../screens/Login";
import Header from "../shared/header";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HelpMember from "../screens/memberScreens/HelpMember";
import HelpType from "../screens/memberScreens/HelpType";
import HelpDetails from "../screens/memberScreens/HelpDetails";

const Stack = createNativeStackNavigator();

export default function HelpStack() {
	return (
			<Stack.Navigator
				initialRouteName="Welcome"
				screenOptions={{
					headerStyle: { backgroundColor: "#eee", height: 100 },
					headerTintColor: "#444",
                    
				}}
			>
				<Stack.Screen
					name="help"
					component={HelpMember}
					options={{
						headerShown: false,
						headerTitle: () => <Header title="Mutuelle" />,
					}}
				/>
				<Stack.Screen
					name="helpDetail"
					component={HelpDetails}
					options={{ headerShown: false }}
				/>
			</Stack.Navigator>
	);
}
