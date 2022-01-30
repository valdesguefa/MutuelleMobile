export const refundReducer = (state, action) => {
	switch (action.type) {
		case "INITIALIZE_REFUND":
			return action.payload;
		case "ADD_REFUND":
			return [...state, action.payload];
		case "DELETE_REFUND":
			return state.filter((refund) => refund.id !== action.id);
		default:
			return state;
	}
};
