import React from "react";
import { View, Text } from "react-native";
import CarouselComponent from "./Carousel";

export default function Remboursements() {
	const utilMember = [
		{
			address: "Yaounde",
			avatar: null,
			create_at: "2022-01-20T16:43:08.445015Z",
			email: "tim@gmail.com",
			first_name: "Tim",
			id: 15,
			last_login: null,
			name: "Tim Ferrist",
			password: "pbkdf2_sha256$260000$EiXLenDK5pUw9GwLwtpujm$TisjOg9WIicKrZz9YNkjTmaKLSQJJChPrM9sf2U4AuQ=",
			sex: "",
			tel: "670662876",
			type: "member",
			username: 15,
		},
		{
			address: "Yaounde",
			avatar: null,
			create_at: "2022-01-20T16:43:08.445015Z",
			email: "tim@gmail.com",
			first_name: "Tim",
			id: 15,
			last_login: null,
			name: "Tim Ferrist",
			password: "pbkdf2_sha256$260000$EiXLenDK5pUw9GwLwtpujm$TisjOg9WIicKrZz9YNkjTmaKLSQJJChPrM9sf2U4AuQ=",
			sex: "",
			tel: "670662876",
			type: "member",
			username: 15,
		}
	];
	return (
		<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
			<CarouselComponent memberList={utilMember} />
		</View>
	);
}
