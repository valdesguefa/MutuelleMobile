import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Header from "../shared/header";
import { Icon } from "react-native-elements";
import ObligatoryContrib from "../screens/adminScreens/ObligatoryContrib";
import ObligatoryContribDetails from "../screens/adminScreens/ObligatoryContribDetails";

const Stack = createNativeStackNavigator();

export default function ObligatoryContribStack() {
	return (
		<Stack.Navigator
			initialRouteName="obligatoryContrib"
			screenOptions={{
				headerStyle: {
					backgroundColor: "#eee",
					// height: 60,
				},
				headerTintColor: "#444",
			}}
		>
			<Stack.Screen
				name="obligatoryContrib"
				component={ObligatoryContrib}
				options={{
					headerStyle: { height: 30 },
					headerShown: false,
					headerTitle: () => <Header title="Les Contributions obligatoires" />,
				}}
			/>
			<Stack.Screen
				name="Details sur les contributions"
				component={ObligatoryContribDetails}
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
