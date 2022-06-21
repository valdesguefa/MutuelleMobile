import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HelpMember from "../screens/memberScreens/HelpMember";
import HelpType from "../screens/memberScreens/HelpType";
import HelpDetails from "../screens/memberScreens/HelpDetails";
import Aides from "../screens/adminScreens/Aides";
import Header from "../shared/header";
import AddHelpStack from "./AddHelpStack";

const Stack = createNativeStackNavigator();

export default function AdminHelpStack({ navigation }) {
	return (
		<Stack.Navigator
			initialRouteName="help"
			screenOptions={{
				headerStyle: { backgroundColor: "#eee", height: 100 },
				headerTintColor: "#444",
			}}
		>
			<Stack.Screen
				name="help"
				component={AddHelpStack}
				options={{
					headerShown: false,
					headerTitle: () => <Header navigation={navigation} title="Mutuelle" />,
					headerStyle: {
						backgroundColor: "#ff884b",
					},
				}}
			/>
			<Stack.Screen name="helpDetail" component={HelpDetails} options={{ headerShown: false }} />
		</Stack.Navigator>
	);
}
