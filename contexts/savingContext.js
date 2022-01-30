import React, { createContext, useReducer, useEffect } from "react";
import { savingReducer } from "../reducers/savingReducer";
import axiosNoTokenInstance from "../utils/axiosNoTokenInstance";

export const SavingContext = createContext();

const SavingContextProvider = (props) => {
	const [savings, savingDispatch] = useReducer(savingReducer, []);

	useEffect(() => {
		const getSavings = async () => {
			const res = await axiosNoTokenInstance.get("/savings");
			savingDispatch({ type: "INITIALIZE_SAVING", payload: res.data });
		};

		getSavings();
	}, []);

	return <SavingContext.Provider value={{ savings, savingDispatch }}>{props.children}</SavingContext.Provider>;
};

export default SavingContextProvider;
