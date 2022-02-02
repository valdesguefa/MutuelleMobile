import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { Icon } from "react-native-elements";

export default function Header(props) {
	return (
		<View style={{ flexDirection: 'row' }}>
			<View style={{ marginLeft: 45 }}>
				<Icon name="menu" color="white" size={39} style={{ alignContent: 'flex-start' }} onPress={() => props.navigation.openDrawer()} />
			</View>
			<View style={styles.header}>
				<Text style={styles.headerText}>{props.title}</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	header: {
		width: "100%",
		height: "100%",
		flexDirection: "row",
		alignItems: "center",
	},
	headerText: {
		fontWeight: "bold",
		fontSize: 20,
		color: "white",
		letterSpacing: 1,
		alignSelf: 'center',
		marginLeft: Dimensions.get('window').width * 0.28
	},
	//   icon: {
	//     position: 'absolute',
	//     left: 16,
	//   }
});
