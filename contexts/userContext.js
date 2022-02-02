import React, { createContext, useReducer, useEffect } from "react";
import { userReducer } from "../reducers/userReducer";
import axiosNoTokenInstance from "../utils/axiosNoTokenInstance";

export const UserContext = createContext();

const UserContextProvider = (props) => {
	const [users, userDispatch] = useReducer(userReducer, []);

	useEffect(() => {
		const getUsers = async () => {
			const res = await axiosNoTokenInstance.get("/users/");
			userDispatch({ type: "INITIALIZE_USER", payload: res.data });
		};

		getUsers();
	}, []);

	return <UserContext.Provider value={{ users, userDispatch }}>{props.children}</UserContext.Provider>;
};

export default UserContextProvider;
