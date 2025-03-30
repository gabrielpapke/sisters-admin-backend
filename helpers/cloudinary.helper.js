import cloudinary from "../config/cloudinary.js";

export default class CloudinaryHelper {
	static async uploadImagesToCloudinary(imageUrls, folder, imageName) {
		try {
			const uploadResults = await Promise.all(
				imageUrls.map(async (url, index) => {
					try {
						// Adicionar um sufixo ao nome da imagem para evitar conflitos
						const uniqueImageName = `${imageName}_${index}`;
						const result = await cloudinary.uploader.upload(url, {
							public_id: uniqueImageName,
							folder,
						});

						const optimizeUrl = cloudinary.url(result.public_id, {
							width: 1200,
							height: 1200,
							crop: "auto",
							quality: "auto",
							fetch_format: "auto",
						});

						return optimizeUrl;
					} catch (error) {
						console.error(`Erro ao fazer upload da imagem ${url}:`, error);
						return null; // Retorna null em caso de erro
					}
				})
			);

			// Filtrar resultados nulos (caso algum upload tenha falhado)
			const validUrls = uploadResults.filter((url) => url !== null);

			return validUrls; // Retorna todas as URLs válidas
		} catch (error) {
			console.error("Erro ao fazer upload das imagens:", error);
			throw error; // Lança o erro para ser tratado pelo chamador
		}
	}
}
