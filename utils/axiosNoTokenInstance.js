import axios from "axios";
import URL from "../shared/URL"

const baseURL = URL;
//console.log("AXIOS_LOGIN_INSTANCE.JS");

const axiosNoTokenInstance = axios.create({
	baseURL,
	headers: {
		"Content-Type": "application/json",
	},
});

export default axiosNoTokenInstance;
