import React, { createContext, useReducer, useEffect } from "react";
import { borrowingReducer } from "../reducers/borrowingReducer";
import axiosNoTokenInstance from "../utils/axiosNoTokenInstance";

export const BorrowingContext = createContext();

const BorrowingContextProvider = (props) => {
	const [borrowings, borrowingDispatch] = useReducer(borrowingReducer, []);

	useEffect(() => {
		const getBorrowings = async () => {
			const res = await axiosNoTokenInstance.get("/borrowings/");
			borrowingDispatch({ type: "INITIALIZE_BORROWING", payload: res.data });
		};

		getBorrowings();
	}, []);

	return (
		<BorrowingContext.Provider value={{ borrowings, borrowingDispatch }}>{props.children}</BorrowingContext.Provider>
	);
};

export default BorrowingContextProvider;
