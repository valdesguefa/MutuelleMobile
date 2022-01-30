import React, { createContext, useReducer, useEffect } from "react";
import { helpReducer } from "../reducers/helpReducer";
import axiosNoTokenInstance from "../utils/axiosNoTokenInstance";

export const HelpContext = createContext();

const HelpContextProvider = (props) => {
	const [helps, helpDispatch] = useReducer(helpReducer, []);

	useEffect(() => {
		const getHelps = async () => {
			const res = await axiosNoTokenInstance.get("/helps");
			helpDispatch({ type: "INITIALIZE_HELP", payload: res.data });
		};

		getHelps();
	}, []);

	return <HelpContext.Provider value={{ helps, helpDispatch }}>{props.children}</HelpContext.Provider>;
};

export default HelpContextProvider;
