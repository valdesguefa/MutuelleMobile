import React, { createContext, useReducer, useEffect } from "react";
import { administratorReducer } from "../reducers/administratorReducer";
import axiosJSI from "../utils/axiosJSI";

export const AdministratorContext = createContext();

const AdministratorContextProvider = (props) => {
	const [admins, adminDispatch] = useReducer(administratorReducer, []);

	// useEffect(() => {
	// 	const getAdmin = async () => {
	// 		const res = await axiosJSI.get("/administrators");
	// 		dispatch({ type: "INITIALIZE_ADMINISTRATORS", payload: res.data });
	// 	};

	// 	getAdmin();
	// }, []);

	return (
		<AdministratorContext.Provider value={{ admins, adminDispatch }}>{props.children}</AdministratorContext.Provider>
	);
};

export default AdministratorContextProvider;
