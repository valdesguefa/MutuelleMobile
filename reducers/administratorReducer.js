import { v4 as uuidv4 } from "uuid";

export const administratorReducer = (state, action) => {
	switch (action.type) {
		case "INITIALIZE_ADMINISTRATORS":
			return action.payload;
		case "ADD_ADMIN":
			return [...state, action.payload];
		case "DELETE_ADMIN":
			return state.filter((administrator) => administrator.id !== action.id);
		default:
			return state;
	}
};
