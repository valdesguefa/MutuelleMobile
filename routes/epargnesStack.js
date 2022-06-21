import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Header from "../shared/header";
import { Icon } from "react-native-elements";
import EpargnesDetail from "../screens/adminScreens/EpargnesDetail";
import Epargnes from "../screens/adminScreens/Epargnes";

const Stack = createNativeStackNavigator();

export default function EpargnesStack() {
	return (
		<Stack.Navigator
			initialRouteName="epargnes"
			screenOptions={{
				headerStyle: {
					backgroundColor: "#eee",
					// height: 60,
				},
				headerTintColor: "#444",
			}}
		>
			<Stack.Screen
				name="epargnes"
				component={Epargnes}
				options={{
					headerStyle: { height: 30 },
					headerShown: false,
					headerTitle: () => <Header title="Les Epargnes" />,
				}}
			/>
			<Stack.Screen
				name="Details sur L'epargne"
				component={EpargnesDetail}
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
