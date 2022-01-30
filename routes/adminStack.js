import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Membres from "../screens/adminScreens/Membres";
import MembreDetails from "../screens/adminScreens/MembreDetails";
import Header from "../shared/header";
import { Icon } from "react-native-elements";
import Administrateurs from "../screens/adminScreens/Administrateurs";
import AdminDetail from "../screens/adminScreens/AdminDetail";

const Stack = createNativeStackNavigator();

export default function AdminStack() {
	return (
		<Stack.Navigator
			initialRouteName="TousAdmin"
			screenOptions={{
				headerStyle: {
					backgroundColor: "#eee",
					// height: 60,
				},
				headerTintColor: "#444",
			}}
		>
			<Stack.Screen
				name="TousAdmin"
				component={Administrateurs}
				options={{
					headerStyle: { height: 30 },
					headerShown: false,
					headerTitle: () => <Header title="Tous les Administrateurs" />,
				}}
			/>
			<Stack.Screen
				name="Details de l'admin"
				component={AdminDetail}
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
