import React, { createContext, useReducer, useEffect } from "react";
import { sessionReducer } from "../reducers/sessionReducer";
import axiosNoTokenInstance from "../utils/axiosNoTokenInstance";

export const SessionContext = createContext();

const SessionContextProvider = (props) => {
	const [sessions, sessionDispatch] = useReducer(sessionReducer, []);

	useEffect(() => {
		const getSessions = async () => {
			const res = await axiosNoTokenInstance.get("/sessions_");
			sessionDispatch({ type: "INITIALIZE_SESSION", payload: res.data });
		};

		getSessions();
	}, []);

	return <SessionContext.Provider value={{ sessions, sessionDispatch }}>{props.children}</SessionContext.Provider>;
};

export default SessionContextProvider;
