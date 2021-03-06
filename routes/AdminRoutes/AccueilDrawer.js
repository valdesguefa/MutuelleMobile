import "react-native-gesture-handler";
import * as React from "react";

import { DrawerItem, createDrawerNavigator, DrawerContentScrollView } from "@react-navigation/drawer";
import Administrateurs from "../../screens/adminScreens/Administrateurs";
import TypeDaides from "../../screens/adminScreens/TypeDaides";
import Configurations from "../../screens/adminScreens/Configurations";
import Session from "../../screens/adminScreens/Session";
import Exercices from "../../screens/adminScreens/Exercices";
import Dettes from "../../screens/adminScreens/Dettes";
import Aides from "../../screens/adminScreens/Aides";
import Deconnexion from "../../screens/adminScreens/Deconnexion";
import Membres from "../../screens/adminScreens/Membres";
import AccueilTab from "./AccueilTab";
import { Icon, Avatar } from "react-native-elements";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import axiosInstance from "../../utils/axiosInstance";
import { AuthContext } from "../../contexts/AuthContext";
import { useContext } from "react";
import { Alert } from "react-native";
import MemberStack from "../memberStack";
import AdminStack from "../adminStack";
import profileStack from "../profileStack";
import HelpStack from "../HelpStack";
import SessionStack from "../SessionStack";
import AdminHelpStack from "../AdminHelpStack";

function getHeaderTitle(route) {
	// If the focused route is not found, we need to assume it's the initial screen
	// This can happen during if there hasn't been any navigation inside the screen
	// In our case, it's "Feed" as that's the first screen inside the navigator
	const routeName = getFocusedRouteNameFromRoute(route) ?? "Accueil";

	switch (routeName) {
		case "Accueil":
			return "Accueil";
		case "Epargnes":
			return "Epargnes";
		case "Remboursements":
			return "Remboursements";
		case "Emprunts":
			return "Emprunts";
	}
}

function CustomDrawerContent(props) {
	const { auth, dispatch } = useContext(AuthContext);

	const logout = () => {
		Alert.alert("ARE YOU SURE YOU WANT TO LOGOUT!!", "You will need to login afterwards", [
			{
				text: "Yes logout",
				onPress: async () => {
					try {
						const res = await axiosInstance.post("/auth/logout");

						dispatch({
							type: "LOGOUT_SUCCESS",
						});
					} catch (err) {
						console.log(err);
					}
				},
			},

			{
				text: "CANCEL",
			},
		]);
	};

	return (
		<DrawerContentScrollView {...props}>
			<DrawerItem
				inactiveBackgroundColor="#ccc"
				label="BACK TO TABS"
				icon={() => <Icon type="entypo" name="dots-three-horizontal" />}
				onPress={() => props.navigation.navigate("AccueilTab")}
			/>
			<DrawerItem
				label=""
				icon={() => (
					<Avatar
						containerStyle={{ marginleft: 100 }}
						size={50}
						rounded
						source={{ uri: auth.user.avatar }}
						// onPress={() => }
					/>
				)}
				onPress={() => props.navigation.navigate("Profile")}
			/>

			<DrawerItem
				label="Membres"
				icon={() => <Icon name="people" />}
				onPress={() => props.navigation.navigate("Membres")}
			/>
			<DrawerItem
				label="Administrateurs"
				icon={() => <Icon name="supervisor-account" />}
				onPress={() => props.navigation.navigate("Administrateurs")}
			/>
			<DrawerItem
				label="Type D'aides"
				icon={() => <Icon name="live-help" />}
				onPress={() => props.navigation.navigate("TypeDaides")}
			/>
			<DrawerItem
				label="Configuration"
				icon={() => <Icon name="settings" />}
				onPress={() => props.navigation.navigate("Configurations")}
			/>
			<DrawerItem
				label="Session"
				icon={() => <Icon name="monetization-on" />}
				onPress={() => props.navigation.navigate("Session")}
			/>
			<DrawerItem
				label="Exercices"
				icon={() => <Icon name="run-circle" />}
				onPress={() => props.navigation.navigate("Exercices")}
			/>
			<DrawerItem
				label="Dettes"
				icon={() => <Icon name="money-off" />}
				onPress={() => props.navigation.navigate("Dettes")}
			/>
			<DrawerItem
				label="Aides"
				icon={() => <Icon name="help-outline" />}
				onPress={() => props.navigation.navigate("Aides")}
			/>
			<DrawerItem label="Deconnexion" icon={() => <Icon name="logout" />} onPress={logout} />
		</DrawerContentScrollView>
	);
}

const Drawer = createDrawerNavigator();

export default function AccueilDrawer() {
	const { auth } = useContext(AuthContext);
	return (
		<Drawer.Navigator
			initialRouteName="Details"
			screenOptions={({ navigation }) => ({
				headerLeft: () => (
					<Icon
						iconStyle={{ marginLeft: 20 }}
						size={40}
						name="menu"
						color="white"
						onPress={() => navigation.openDrawer()}
					/>
				),

				headerStyle: {
					backgroundColor: "#f4511e",
				},
				headerTintColor: "#fff",
				headerTitleAlign: "center",
			})}
			drawerContent={(props) => <CustomDrawerContent {...props} />}
		>
			<Drawer.Screen
				name="AccueilTab"
				component={AccueilTab}
				options={({ route, navigation }) => ({
					headerTitle: getHeaderTitle(route),
					headerLeft: () => (
						<Icon
							iconStyle={{ marginLeft: 20 }}
							size={40}
							name="menu"
							color="white"
							onPress={() => navigation.openDrawer()}
						/>
					),
					// headerRight: () => (

					// ),
				})}
			/>
			<Drawer.Screen name="Profile" component={profileStack} />
			<Drawer.Screen name="Membres" component={MemberStack} />
			<Drawer.Screen name="Administrateurs" component={AdminStack} />
			<Drawer.Screen name="TypeDaides" component={TypeDaides} />
			<Drawer.Screen name="Configurations" component={Configurations} />
			<Drawer.Screen name="Session" options={{
					headerShown: false,
				}} component={SessionStack} />
			<Drawer.Screen name="Exercices" component={Exercices} />
			<Drawer.Screen name="Dettes" component={Dettes} />
			<Drawer.Screen name="Aides" options={{
					headerShown: false,
				}} component={AdminHelpStack} />
			<Drawer.Screen name="Deconnexion" component={Deconnexion} />
		</Drawer.Navigator>
	);
}
