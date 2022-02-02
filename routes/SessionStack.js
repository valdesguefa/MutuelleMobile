import Welcome from "../screens/Welcome";
import Login from "../screens/Login";
import Header from "../shared/header";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Session from "../screens/adminScreens/Session";
import DetailsSessions from "../screens/adminScreens/DetailsSessions";

const Stack = createNativeStackNavigator();

export default function SessionStack({navigation}) {
	return (
			<Stack.Navigator
				initialRouteName="Session1"
				screenOptions={{
					headerStyle: { backgroundColor: "#eee", height: 100 },
					headerTintColor: "#444",
                    
				}}
			>
				<Stack.Screen
					name="Session1"
					component={Session}
					options={{
						headerShown: true,
						headerTitle: () => <Header navigation={navigation} title="Session" />,
						headerStyle: {
							backgroundColor: "#f4511e",
						},
						
					}}
				/>
				<Stack.Screen
					name="Details Session"
					component={DetailsSessions}
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
