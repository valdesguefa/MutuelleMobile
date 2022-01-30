import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import {
	FlatList,
	View,
	Text,
	SafeAreaView,
	StyleSheet,
	Dimensions,
	Animated,
	Easing,
	Alert,
	TouchableHighlight,
	TouchableOpacity,
} from "react-native";
import { List } from "react-native-paper";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import headerObj from "../../shared/token";
import URL from "../../shared/URL";

export default function HelpType() {
	const [helpType, sethelpType] = useState([]);
	useEffect(() => {
		axios
			.get(URL + `help_types/`, headerObj)
			.then((response) => {
				var val = [];
			// console.log('donner recu',response.data)
				for (let obj of response.data) {
					val.push(obj);
				}
				//console.log('donner recu',val)
				sethelpType(val);
			})
			.catch((error) => {
				console.log("voici l'erreur", error);
			});
	}, []);

	const translateX = useRef(new Animated.Value(Dimensions.get("window").height)).current;
	useEffect(() => {
		Animated.timing(translateX, { toValue: 0, duration: 2000, useNativeDriver: true }).start();
	});
	const ItemView = ({ item }) => {
		return (
			// Single Comes here which will be repeatative for the FlatListItems
			<Animated.View style={{ transform: [{ translateY: translateX }] }}>
				<TouchableOpacity
					style={{ width: Dimensions.get("window").width }}
					onPress={() => Alert.alert(item["title"], `${item["amount"]} XAF`)}
				>
					<List.Item
						title={item["title"]}
						description={`${item["amount"]} XAF`}
						left={(props) => <FontAwesome5 name={"hand-holding-usd"} size={35} color="#FE7C00" solid />}
					/>
				</TouchableOpacity>
			</Animated.View>
		);
	};

	const ItemSeparatorView = () => {
		return (
			//Item Separator
			<View style={{ height: 0.5, width: "100%", backgroundColor: "#C8C8C8" }} />
		);
	};
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View style={styles.container}>
				<FlatList
					data={helpType}
					//data defined in constructor
					ItemSeparatorComponent={ItemSeparatorView}
					//Item Separator View
					renderItem={ItemView}
				/>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		justifyContent: "center",
		flex: 1,
		marginLeft: 10,
		marginRight: 10,
		marginBottom: 10,
		marginTop: 30,
	},
	item: {
		padding: 10,
		fontSize: 18,
		height: 44,
	},
});
