export const exerciseReducer = (state, action) => {
	switch (action.type) {
		case "INITIALIZE_EXERCISE":
			return action.payload;
		case "ADD_EXERCISE":
			return [...state, action.payload];
		case "DELETE_EXERCISE":
			return state.filter((exercise) => exercise.id !== action.id);
		default:
			return state;
	}
};
