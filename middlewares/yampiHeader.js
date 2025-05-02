import apiClient from "../config/axiosConfig.js";

function setYampiHeaders(req, res, next) {
	try {
		const userToken = req.headers["user-token"];
		const userSecretKey = req.headers["user-secret-key"];

		if (!userToken || !userSecretKey) {
			return res.status(401).json({
				error: "Headers 'User-Token' e 'User-Secret-Key' são obrigatórios.",
			});
		}

		apiClient.defaults.headers["User-Token"] = userToken;
		apiClient.defaults.headers["User-Secret-Key"] = userSecretKey;

		next();
	} catch (error) {
		console.error("Erro ao descriptografar os headers:", error.message);
		return res.status(500).json({ error: "Erro ao processar os headers." });
	}
}

export default setYampiHeaders;
