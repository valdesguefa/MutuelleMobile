import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Accueil from "../../screens/memberScreens/Accueil";
import Epargnes from "../../screens/memberScreens/Epargnes";
import Remboursements from "../../screens/memberScreens/Remboursements";
import Contributions from "../../screens/memberScreens/Contributions";
import { Icon } from "react-native-elements";
const Tab = createBottomTabNavigator();

export default function AccueilTab() {
	return (
		<Tab.Navigator
			screenOptions={({ route }) => ({
				tabBarIcon: ({ focused, color, size }) => {
					let iconName;

					if (route.name === "Accueil") {
						iconName = focused ? "home" : "home";
					} else if (route.name === "Epargnes") {
						iconName = focused ? "vertical-align-bottom" : "vertical-align-bottom";
					} else if (route.name === "Remboursements") {
						iconName = focused ? "rotate-left" : "rotate-left";
					} else if (route.name === "Contributions") {
						iconName = focused ? "vertical-align-top" : "vertical-align-top";
					}

					// You can return any component that you like here!
					return <Icon name={iconName} />;
				},
				tabBarActiveTintColor: "tomato",
				tabBarInactiveTintColor: "gray",
				headerShown: false,
			})}
		>
			<Tab.Screen name="Accueil" component={Accueil} />
			<Tab.Screen name="Epargnes" component={Epargnes} />
			<Tab.Screen name="Remboursements" component={Remboursements} />
			<Tab.Screen name="Contributions" component={Contributions} />
		</Tab.Navigator>
	);
}
