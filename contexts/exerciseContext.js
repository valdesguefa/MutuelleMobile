import React, { createContext, useReducer, useEffect } from "react";
import { exerciseReducer } from "../reducers/exerciseReducer";
import axiosNoTokenInstance from "../utils/axiosNoTokenInstance";

export const ExerciseContext = createContext();

const ExerciseContextProvider = (props) => {
	const [exercises, exerciseDispatch] = useReducer(exerciseReducer, []);

	useEffect(() => {
		const getExercises = async () => {
			const res = await axiosNoTokenInstance.get("/exercises");
			exerciseDispatch({ type: "INITIALIZE_EXERCISE", payload: res.data });
		};

		getExercises();
	}, []);

	return <ExerciseContext.Provider value={{ exercises, exerciseDispatch }}>{props.children}</ExerciseContext.Provider>;
};

export default ExerciseContextProvider;
