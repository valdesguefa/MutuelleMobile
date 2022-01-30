export const sessionReducer = (state, action) => {
	switch (action.type) {
		case "INITIALIZE_SESSION":
			return action.payload;
		case "ADD_SESSION":
			return [...state, action.payload];
		case "DELETE_SESSION":
			return state.filter((session) => session.id !== action.id);
		default:
			return state;
	}
};
