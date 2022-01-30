export const borrowingReducer = (state, action) => {
	switch (action.type) {
		case "INITIALIZE_BORROWING":
			return action.payload;
		case "ADD_BORROWING":
			return [...state, action.payload];
		case "DELETE_BORROWING":
			return state.filter((borrowing) => borrowing.id !== action.id);
		default:
			return state;
	}
};
