import "react-native-gesture-handler";
import * as React from "react";

import { DrawerItem, createDrawerNavigator, DrawerContentScrollView } from "@react-navigation/drawer";
import Administrateurs from "../../screens/memberScreens/AdminList";
import HelpType from "../../screens/memberScreens/HelpType";
// import Configurations from "../../screens/memberScreens/Configurations";
import Session from "../../screens/memberScreens/DetailsSession";
import Exercices from "../../screens/memberScreens/DetailsExercice";
// import Dettes from "../../screens/memberScreens/Dettes";
import Aides from "../../screens/memberScreens/HelpMember";
import Deconnexion from "../../screens/adminScreens/Deconnexion";
import Membres from "../../screens/memberScreens/MemberList";
import AccueilTab from "./MemAccueilTab";
import { Avatar, Icon } from "react-native-elements";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import axiosInstance from "../../utils/axiosInstance";
import { AuthContext } from "../../contexts/AuthContext";
import { useContext } from "react";
import HelpStack from "../HelpStack";
import { Alert } from "react-native";

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
		case "Contributions":
			return "Contributions";
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
				label="BACK TO TABS"
				icon={() => <Icon type="entypo" name="dots-three-horizontal" />}
				onPress={() => props.navigation.navigate("AccueilTab")}
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
			{/* <DrawerItem
				label="Configuration"
				icon={() => <Icon name="settings" />}
				onPress={() => props.navigation.navigate("Configurations")}
			/> */}
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
			{/* <DrawerItem
				label="Dettes"
				icon={() => <Icon name="money-off" />}
				onPress={() => props.navigation.navigate("Dettes")}
			/> */}
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

export default function MemAccueilDrawer() {
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
					headerRight: () => (
						<Avatar
							containerStyle={{ marginRight: 20 }}
							size={50}
							rounded
							source={{ uri: auth.user.avatar }}
							onPress={() => navigation.goBack()}
						/>
					),
				})}
			/>
			<Drawer.Screen name="Membres" component={Membres} />
			<Drawer.Screen name="Administrateurs" component={Administrateurs} />
			<Drawer.Screen name="TypeDaides" component={HelpType} />
			{/* <Drawer.Screen name="Configurations" component={Configurations} /> */}
			<Drawer.Screen name="Session" component={Session} />
			<Drawer.Screen name="Exercices" component={Exercices} />
			{/* <Drawer.Screen name="Dettes" component={Dettes} /> */}
			<Drawer.Screen
				name="Aides"
				options={{
					headerShown: false,
				}}
				component={HelpStack}
			/>
			<Drawer.Screen name="Deconnexion" component={Deconnexion} />
		</Drawer.Navigator>
	);
}
