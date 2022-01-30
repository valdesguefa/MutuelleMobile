import React, { createContext, useReducer, useEffect } from "react";
import { helpTypeReducer } from "../reducers/helpTypeReducer";
import axiosNoTokenInstance from "../utils/axiosNoTokenInstance";

export const HelpTypeContext = createContext();

const HelpTypeContextProvider = (props) => {
	const [helpTypes, helpTypeDispatch] = useReducer(helpTypeReducer, []);

	useEffect(() => {
		const getHelpTypes = async () => {
			const res = await axiosNoTokenInstance.get("/help_types");
			helpTypeDispatch({ type: "INITIALIZE_HELPTYPE", payload: res.data });
		};

		getHelpTypes();
	}, []);

	return <HelpTypeContext.Provider value={{ helpTypes, helpTypeDispatch }}>{props.children}</HelpTypeContext.Provider>;
};

export default HelpTypeContextProvider;
