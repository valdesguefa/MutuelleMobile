
import Header from "../shared/header";
import * as React from "react";
//import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HelpMember from "../screens/memberScreens/HelpMember";
import HelpDetails from "../screens/memberScreens/HelpDetails";
import Aides from "../screens/adminScreens/Aides";
import { AddHelp } from "./AddHelp";

const Stack = createNativeStackNavigator();

export default function AddHelpStack({navigation}) {
	return (
			<Stack.Navigator
				initialRouteName="aides"
				screenOptions={{
					headerStyle: { backgroundColor: "#eee", height: 100 },
					headerTintColor: "#444",
                    
				}}
			>
				<Stack.Screen
					name="aides"
					component={Aides}
					options={{
						headerShown: true,
						headerTitle: () => <Header navigation={navigation} title="Aides" />,
						headerStyle: {
							backgroundColor: "#f4511e",
						},
						
					}}
				/>
				<Stack.Screen
					name="addHelp"
					component={AddHelp}
					options={{ headerShown: true,
                        headerStyle: {
							backgroundColor: "#f4511e",
							color:'white'
						},
						headerTintColor: "#444",
                     }}
				/>
			</Stack.Navigator>
	);
}
