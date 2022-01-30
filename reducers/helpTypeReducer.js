export const helpTypeReducer = (state, action) => {
	switch (action.type) {
		case "INITIALIZE_HELPTYPE":
			return action.payload;
		case "ADD_HELPTYPE":
			return [...state, action.payload];
		case "DELETE_HELPTYPE":
			return state.filter((helpType) => helpType.id !== action.id);
		default:
			return state;
	}
};
