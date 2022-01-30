import React, { useState } from "react";
import { View, Text, StyleSheet, Image, Button, TouchableOpacity, Platform, Alert } from "react-native";

import * as ImagePicker from "expo-image-picker";

function UploadImage() {
	// The path of the picked image
	const [pickedImagePath, setPickedImagePath] = useState("");

	// This function is triggered when the "Select an image" button pressed
	const showImagePicker = async () => {
		// Ask the user for the permission to access the media library
		const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

		if (permissionResult.granted === false) {
			alert("You've refused to allow this appp to access your photos!");
			return;
		}

		const result = await ImagePicker.launchImageLibraryAsync();

		// Explore the result
		console.log(result);

		if (!result.cancelled) {
			setPickedImagePath(result.uri);
			console.log(result.uri);
		}
	};

	// This function is triggered when the "Open camera" button pressed
	const openCamera = async () => {
		// Ask the user for the permission to access the camera
		const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

		if (permissionResult.granted === false) {
			alert("You've refused to allow this appp to access your camera!");
			return;
		}

		const result = await ImagePicker.launchCameraAsync();

		// Explore the result
		console.log(result);

		if (!result.cancelled) {
			setPickedImagePath(result.uri);
			console.log(result.uri);
		}
	};
	const onSelectImage = async () => {
		Alert.alert("Profile Picture", "Choose an option", [
			{ text: "Camera", onPress: openCamera },
			{ text: "Gallery", onPress: showImagePicker },
			{ text: "Cancel", onPress: () => {} },
		]);
	};

	return (
		<View style={styles.screen}>
			<View style={styles.buttonContainer}>
				<TouchableOpacity onPress={onSelectImage} style={styles.roundButton1}>
					<Image source={require("../../assets/camera.png")} />
				</TouchableOpacity>
			</View>

			<View style={styles.imageContainer}>
				{pickedImagePath !== "" && <Image source={{ uri: pickedImagePath }} style={styles.image} />}
			</View>
		</View>
	);
}

export default UploadImage;

// Kindacode.com
// Just some styles
const styles = StyleSheet.create({
	screen: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	buttonContainer: {
		width: 400,
		flexDirection: "row",
		justifyContent: "space-around",
	},
	imageContainer: {
		padding: 30,
	},
	image: {
		width: 200,
		height: 200,
		resizeMode: "cover",
	},
	roundButton1: {
		width: 50,
		height: 50,
		justifyContent: "center",
		alignItems: "center",
		padding: 10,
		borderRadius: 100,
		backgroundColor: "green",
	},
	textStyle: {
		color: "white",
		fontWeight: "bold",
		paddingHorizontal: 16,
	},
});
