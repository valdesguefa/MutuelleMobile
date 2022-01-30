export const savingReducer = (state, action) => {
	switch (action.type) {
		case "INITIALIZE_SAVING":
			return action.payload;
		case "ADD_SAVING":
			return [...state, action.payload];
		case "DELETE_SAVING":
			return state.filter((saving) => saving.id !== action.id);
		default:
			return state;
	}
};
