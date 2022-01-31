import { View, Text, Button } from "react-native";
import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Icon } from "react-native-elements";
import { TextInput } from "react-native-paper";
import { globalStyles } from "../../styles/global";

export default function Epargnes() {
	const [date, setDate] = useState(new Date());
	const [mode, setMode] = useState("date");
	const [showDP, setShowDP] = useState(false);
	// const [show, setShow] = useState(false);
	console.log("DATE:", date.toDateString());

	const onChange = (event, selectedDate) => {
		const currentDate = selectedDate || date;
		setShow(Platform.OS === "ios");
		setDate(currentDate);
	};

	// const setShowAndMode = () => {
	// 	setShow(true);
	// 	setMode("date");
	// };

	// const showMode = (currentMode) => {
	// 	setShow(true);
	// 	setMode("currentMode");
	// };

	const showDatepicker = () => {
		showMode("date");
	};

	const showTimepicker = () => {
		showMode("time");
	};

	return (
		<View style={globalStyles.container}>
			<Text>Epargnes Screen</Text>
			<TextInput label="Date" value={date.toDateString()} mode="outlined" disabled />
			<Icon name="calendar" type="foundation" color="#ff751a" onPress={() => setShowDP(true)} />

			<View>
				<Button onPress={showTimepicker} title="Show time picker!" />
			</View>
			{show && (
				<DateTimePicker
					testID="dateTimePicker"
					value={date}
					mode="date"
					is24Hour={true}
					display="default"
					onChange={onChange}
				/>
			)}
			{/* {show && (
				<DateTimePicker
					testID="dateTimePicker"
					value={date}
					mode={mode}
					is24Hour={true}
					display="default"
					onChange={onChange}
				/>
			)} */}
		</View>
	);
}
