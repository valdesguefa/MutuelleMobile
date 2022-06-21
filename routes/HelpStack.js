import Header from "../shared/header";
import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HelpDetails from "../screens/memberScreens/HelpDetails";
import HelpMember from "../screens/memberScreens/HelpMember";

const Stack = createNativeStackNavigator();

export default function HelpStack({ navigation }) {
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
				component={HelpMember}
				options={{
					headerShown: true,
					headerTitle: () => <Header navigation={navigation} title="Aides" />,
					headerStyle: {
						backgroundColor: "#f4511e",
					},
				}}
			/>
			<Stack.Screen name="helpDetail" component={HelpDetails} options={{ headerShown: false }} />
		</Stack.Navigator>
	);
}
