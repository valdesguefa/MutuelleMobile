import React, { createContext, useReducer, useEffect } from "react";
import { configReducer } from "../reducers/configReducer";
import axiosNoTokenInstance from "../utils/axiosNoTokenInstance";

export const ConfigContext = createContext();

const ConfigContextProvider = (props) => {
	const [configs, configDispatch] = useReducer(configReducer, []);

	useEffect(() => {
		const getConfigs = async () => {
			const res = await axiosNoTokenInstance.get("/configs");
			configDispatch({ type: "INITIALIZE_CONFIG", payload: res.data });
		};

		getConfigs();
	}, []);

	return <ConfigContext.Provider value={{ configs, configDispatch }}>{props.children}</ConfigContext.Provider>;
};

export default ConfigContextProvider;
