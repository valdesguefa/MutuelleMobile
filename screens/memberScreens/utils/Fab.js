import React, { useState } from 'react';
import { View, StyleSheet, Alert, Button } from 'react-native';
import { FAB, TextInput } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import RN from 'react-native';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { Pressable } from 'react-native'
import { Avatar } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';

const SCREEN_HEIGHT = RN.Dimensions.get('window').height;
const SCREEN_width = RN.Dimensions.get('window').width;

const FabExample = (props) => {
	const [text, setText] = useState('');
	const [showText, setShowText] = useState(false);
	const [disablebtn, setDisablebtn] = useState(true);
	const addItem = () => {
		setShowText(!showText);
	};
	const showAlert = () => {
		console.log('bonjour')
		Alert.alert('Item added successfully');
	};

	return (
		<View style={{ flexDirection: 'column', width: 60, height: 170, bottom: 70, right: 40, flex: 2, position: 'absolute' }}>
			{showText ? (
				<Animatable.View animation='fadeInUp' duration={350} style={styles.textInput} >
					
					<Pressable onPress={()=>{
						//console.log('sakjnldfkansldkfjn')
						props.displayBorrowing();
						addItem()
					}}>
							<Avatar
								size={55}
								rounded
								icon={{ name: 'hand-holding-usd', type: 'font-awesome-5' }}
								containerStyle={{ backgroundColor: '#ff884b',marginBottom:5 }}
							/>
						</Pressable>

						<Pressable onPress={()=>{
							props.displayHelp();
							addItem()
						}}>
							<Avatar
								size={55}
								rounded
								icon={{ name: 'hand-holding-medical', type: 'font-awesome-5' }}
								containerStyle={{ backgroundColor: '#ff884b' }}
							/>
						</Pressable>
					
				</Animatable.View>
			) : (
				<>
				<Animatable.View animation='fadeOutDown' duration={250} style={styles.textInput} >
					
				<Pressable onPress={addItem}>
							<Avatar
								size={55}
								rounded
								icon={{ name: 'hand-holding-usd', type: 'font-awesome-5' }}
								containerStyle={{ backgroundColor: '#ff884b',marginBottom:5 }}
							/>
						</Pressable>

						<Pressable onPress={addItem}>
							<Avatar
								size={55}
								rounded
								icon={{ name: 'hand-holding-medical', type: 'font-awesome-5' }}
								containerStyle={{ backgroundColor: '#ff884b' }}
							/>
						</Pressable>
				
			</Animatable.View>
				</>
			)}
			<FAB style={styles.fab} icon="plus" small={false} animated={true}
				onPress={addItem} />
		</View>
	);
};

export default FabExample;

const styles = StyleSheet.create({
	fab: {
		bottom: 0,//-SCREEN_HEIGHT * 0.3,
		right: 3,
		position: 'absolute'
		//marginLeft: SCREEN_width * 0.63,
	},
	subfab: {
		right: 0,
		bottom: 10,
	},
	textInput: {
		position: 'relative',
		bottom: 8,//-SCREEN_HEIGHT * 0.3,
		right: 0,
		flex: 1
	},
	btn: {
		marginTop: 20,
	},
});
