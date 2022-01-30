import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import URL from "../shared/URL"

const baseURL = URL;
//console.log("AXIOS_INSTANCE.JS");

const axiosInstance = axios.create({
	baseURL,
});

axiosInstance.interceptors.request.use(
	async (config) => {
		const token = await AsyncStorage.getItem("@token");
		if (token) {
			config.headers.Authorization = `Token ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export default axiosInstance;
