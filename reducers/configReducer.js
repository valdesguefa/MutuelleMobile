export const configReducer = (state, action) => {
	switch (action.type) {
		case "INITIALIZE_CONFIG":
			return action.payload;
		case "ADD_CONFIG":
			return [...state, action.payload];
		case "DELETE_CONFIG":
			return state.filter((config) => config.id !== action.id);
		default:
			return state;
	}
};
