export const userReducer = (state, action) => {
	switch (action.type) {
		case "INITIALIZE_USER":
			return action.payload;
		case "ADD_USER":
			return [...state, action.payload];
		case "DELETE_USER":
			return state.filter((user) => user.id !== action.id);
		default:
			return state;
	}
};
