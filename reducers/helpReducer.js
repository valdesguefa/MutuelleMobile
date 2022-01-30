export const helpReducer = (state, action) => {
	switch (action.type) {
		case "INITIALIZE_HELP":
			return action.payload;
		case "ADD_HELP":
			return [...state, action.payload];
		case "DELETE_HELP":
			return state.filter((help) => help.id !== action.id);
		default:
			return state;
	}
};
