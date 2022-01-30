import axios from "axios";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import headerObj from "../../shared/token"; //config pour l'acces au parametre de config
import URL from "../../shared/URL";
import * as Font from "expo-font";
//import {CustomSearchIcon} from 'components/icons'
//customIcon={CustomSearchIcon}
import SearchBar from "@pnap/react-native-search-bar";
import CarouselComponent from "./Carousel";

function remove_accents(strAccents) {
	var strAccents = strAccents.split("");
	var strAccentsOut = new Array();
	var strAccentsLen = strAccents.length;
	var accents = "ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž";
	var accentsOut = "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
	for (var y = 0; y < strAccentsLen; y++) {
		if (accents.indexOf(strAccents[y]) != -1) {
			strAccentsOut[y] = accentsOut.substr(accents.indexOf(strAccents[y]), 1);
		} else strAccentsOut[y] = strAccents[y];
	}
	strAccentsOut = strAccentsOut.join("");

	return strAccentsOut;
}

export default function MemberList() {
	const [members, setMembers] = useState([]);
	const [User, setUser] = useState([]);
	const [utilMember, setutilMember] = useState([]);
	const [display, setdisplay] = useState(false);
	const [searchResult, setsearchResult] = useState([]);

	useEffect(() => {
		var val = [];
		axios
			.get(URL + "users/", headerObj)
			.then((response) => {
				for (let temp of response.data) {
					val.push(temp);
				}
				// console.log('------voici les utilisateurs-----', val)
				setUser(val);
			})
			.catch((error) => console.log("voici l'erreur user", error));
	}, []);

	useEffect(() => {
		var tab = [];
		for (let member of members) {
			for (let obj of User) {
				if (member["username"] === obj["id"]) {
					tab.push({ ...obj, username: member["username"] });
				}
			}
		}
		console.log("me voici ...........", tab);
		setutilMember(tab);
	}, [User, members]);

	useEffect(() => {
		axios
			.get(URL + `members/`, headerObj)
			.then((response) => {
				var val = [];
				for (let temp of response.data) {
					val.push(temp);
				}
				//console.log('------voici les membres-----', val)
				setMembers(val);
			})
			.catch((error) => {
				console.log("voici l'erreur", error);
			});
	}, []);

	const doSearch = (text) => {
		var tabl = [];
		let champs = ["username", "name", "first_name", "email", "tel", "address", "create_at"];
		//tabll = tabll.filter(tabll => { return ((remove_accents(tabll[champ]).trim().toUpperCase()).includes((remove_accents(`${valeurResearch}`).trim()).toUpperCase()) || (tabll[champ] === (`${valeurResearch}`).trim())) })

		tabl = utilMember.filter(function (tabll) {
			for (let champ of champs) {
				//console.log("llllllllll", champ)
				if (tabll[champ] !== null) {
					if (remove_accents(tabll[champ]) !== null) {
						if (
							remove_accents(tabll[champ])
								.trim()
								.toUpperCase()
								.includes(remove_accents(`${text}`).trim().toUpperCase())
						) {
							return true;
						}
					} else if (tabll[champ].trim() === `${text}`.trim()) {
						return true;
					} else {
						return false;
					}
				}
			}
		});
		if (tabl.length !== 0) {
			// console.log('voici le resultat des recherches', tabl)
			setsearchResult(tabl);
		} else {
			Alert.alert("Aucun resultat disponible ");
		}
	};

	return (
		<View style={styles.container}>
			<View style={{ flexDirection: "row" }}>
				{display ? null : <Text style={styles.text}>Membres</Text>}
				<View style={{ flex: 1, justifyContent: "flex-end", paddingTop: 7 }}>
					<SearchBar
						onSubmitSearch={(text) => {
							doSearch(text);
						}}
						onActiveSearch={(text) => {
							console.log("--------");
						}} //{setdisplay(text)}}
						onToggleSearchBar={(text) => {
							setdisplay(text);
							setsearchResult([]);
						}}
						// customIcon={CustomSearchIcon}
						inputTextStyle={styles.searchBarInput}
						buttonStyle={styles.searchButton}
						buttonTextStyle={styles.searchButtonText}
						underlineActiveColor={"#FE7C00"}
						underlineInactiveColor={"#FE7C00"}
					/>
				</View>
			</View>
			{console.log("UtilMember000000000000000000000-----", utilMember)}
			{searchResult.length === 0 ? (
				<CarouselComponent
					memberList={[
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
					]}
				/>
			) : display ? (
				<CarouselComponent memberList={searchResult} />
			) : (
				<CarouselComponent memberList={utilMember} />
			)}
			{
				//searchResult.length === 0  ? <CarouselComponent memberList={utilMember} /> : <CarouselComponent memberList={searchResult} />
			}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginTop: "10%",
		backgroundColor: "#fff",
		justifyContent: "flex-start",
		paddingBottom: 10,
	},
	text: {
		fontSize: 25,
		color: "#156182",
		marginTop: 15,
	},
});
