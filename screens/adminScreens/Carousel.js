import * as React from "react";
import { Text, View, SafeAreaView, Linking, StyleSheet } from "react-native";

import Carousel from "react-native-snap-carousel";
import { Avatar } from "react-native-elements";
import * as Font from "expo-font";
import * as Animatable from "react-native-animatable";

var url = "http://192.168.27.208:8000/media/users/user_blHYDdQ.png";

export default class CarouselComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			activeIndex: 0,
			fontsLoaded: false,
			carouselItems: [],
		};
	}

	static getDerivedStateFromProps(props, state) {
		if (props.memberList !== state.carouselItems) {
			return {
				carouselItems: props.memberList,
			};
		}
		return null;
	}

	async loadFonts() {
		await Font.loadAsync({
			// Load a font `Montserrat` from a static resource
			poppinsBold: require("../../assets/fonts/poppins-bold.ttf"),
		});
		this.setState({ fontsLoaded: true });
	}

	componentDidMount() {
		this.loadFonts();
	}

	onPressEmail = (email) => {
		Linking.openURL(`mailto://${email}?subject=subject&body=body`).catch((err) => console.log("Error:", err));
	};

	_renderItem({ item, index }) {
		return (
			<View
				style={{
					backgroundColor: "#FE7C00",
					borderRadius: 10,
					height: 550,
					padding: 30,
					borderBottomLeftRadius: 10,
					borderBottomRightRadius: 10,
					borderTopLeftRadius: 10,
					borderTopRightRadius: 10,
					shadowOffset: 10,
					shadowColor: "black",
					shadowOpacity: 0.5,
					marginLeft: 25,
					marginBottom: 50,
					justifyContent: "center",
				}}
			>
				<View style={{ alignSelf: "center", marginTop: 25, paddingBottom: 28 }}>
					<Animatable.View animation="bounceIn" duraton="2500">
						<Avatar size={230} rounded source={item.avatar ? { uri: item.avatar } : {}} key={`${url}-${index}`} />
					</Animatable.View>
					<View>
						<Text
							style={{ fontSize: 25, alignSelf: "center", color: "black", fontFamily: "poppinsBold" }}
							numberOfLines={1}
						>
							{item.name} {item.first_name}
						</Text>
					</View>
				</View>

				<View>
					<Text style={styles.text}><Text style={{color:'black',fontSize:15.5}}>Pseudo: </Text>{item.username}</Text>
					<Text style={styles.text}><Text style={{color:'black',fontSize:15.5}} numberOfLines={2}>Sexe (M:homme, F:femme): </Text>{item.sex} </Text>
					<Text
						style={styles.text}
						onPress={() => {
							Linking.openURL(`mailto://${item.email}?subject=subject&body=body`).catch((err) =>
								console.log("Error:", err)
							);
						}}
					>
						<Text style={{color:'black',fontSize:15.5}}>Email: </Text><Text style={{ color: "gray" }}>{item.email}</Text>
					</Text>
					<Text
						style={styles.text}
						onPress={() => {
							Linking.openURL(`tel://${item.tel}`).catch((err) => console.log("Error:", err));
						}}
					>
						<Text style={{color:'black',fontSize:15.5}}>Telephone : </Text><Text style={{ color: "gray" }}> {item.tel} </Text>
					</Text>
					<Text style={styles.text}><Text style={{color:'black',fontSize:15.5}}>Adresse : </Text>{item.address}</Text>
					<Text style={styles.text}><Text style={{color:'black',fontSize:15.5}}>Cree le : </Text>{item.create_at}</Text>
				</View>
			</View>
		);
	}

	render() {
		if (this.state.fontsLoaded && this.state.carouselItems !== null) {
			return (
				<SafeAreaView style={{ flex: 1, paddingTop: 20 }}>
					<View>
						<Carousel
							layout={"stack"}
							layoutCardOffset={18}
							ref={(ref) => (this.carousel = ref)}
							data={this.state.carouselItems}
							sliderWidth={300}
							itemWidth={300}
							renderItem={this._renderItem}
							onSnapToItem={(index) => this.setState({ activeIndex: index })}
						/>
					</View>
				</SafeAreaView>
			);
		} else {
			return null;
		}
	}
}

const styles = StyleSheet.create({
	text: {
		color: "white",
		fontFamily: "poppinsBold",
		paddingBottom: 1,
		fontSize: 14,
	},
});
