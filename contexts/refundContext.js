import React, { createContext, useReducer, useEffect } from "react";
import { refundReducer } from "../reducers/refundReducer";
import axiosNoTokenInstance from "../utils/axiosNoTokenInstance";

export const RefundContext = createContext();

const RefundContextProvider = (props) => {
	const [refunds, refundDispatch] = useReducer(refundReducer, []);

	useEffect(() => {
		const getRefunds = async () => {
			const res = await axiosNoTokenInstance.get("/refunds/");
			refundDispatch({ type: "INITIALIZE_REFUND", payload: res.data });
		};

		getRefunds();
	}, []);

	return <RefundContext.Provider value={{ refunds, refundDispatch }}>{props.children}</RefundContext.Provider>;
};

export default RefundContextProvider;
