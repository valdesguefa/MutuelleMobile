import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Accueil from "../../screens/adminScreens/Accueil";
import Epargnes from "../../screens/adminScreens/Epargnes";
import Remboursements from "../../screens/adminScreens/Remboursements";
import Emprunts from "../../screens/adminScreens/Emprunts";
import { Icon } from "react-native-elements";
import epargnesStack from "../epargnesStack";
import empruntStack from "../empruntStack";
import remboursementsStack from "../remboursementsStack";
import ObligatoryContribStack from "../obligatoryContribStack";
const Tab = createBottomTabNavigator();

export default function MemAccueilTab() {
	return (
		<Tab.Navigator
			screenOptions={({ route }) => ({
				tabBarIcon: ({ focused, color, size }) => {
					let iconName;

					if (route.name === "Accueil") {
						iconName = focused ? "home" : "home";
					} else if (route.name === "Contribution") {
						iconName = focused ? "attach-money" : "attach-money";
					} else if (route.name === "Epargnes") {
						iconName = focused ? "vertical-align-bottom" : "vertical-align-bottom";
					} else if (route.name === "Remboursements") {
						iconName = focused ? "rotate-left" : "rotate-left";
					} else if (route.name === "Emprunts") {
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
			<Tab.Screen name="Contribution" component={ObligatoryContribStack} />
			<Tab.Screen name="Epargnes" component={epargnesStack} />
			<Tab.Screen name="Remboursements" component={remboursementsStack} />
			<Tab.Screen name="Emprunts" component={empruntStack} />
		</Tab.Navigator>
	);
}
