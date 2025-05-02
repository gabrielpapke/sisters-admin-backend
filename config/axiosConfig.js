import axios from "axios";

const apiClient = axios.create({
	baseURL: "https://api.dooki.com.br/v2/sisters-fitness",
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
});

export default apiClient;
