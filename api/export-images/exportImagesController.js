import ExportImagesService from "./exportImagesService.js";

const exportController = {
	async exportImages(req, res) {
		try {
			const { supplier, url, name } = req.body;

			if (!supplier || !url || !name) {
				return res.status(400).json({ error: "Dados inválidos" });
			}

			if (!["EL"].includes(supplier)) {
				return res.status(400).json({ error: "Site não suportado" });
			}

			const exportImageService = new ExportImagesService(supplier, url, name);
			const imageUrls = await exportImageService.getGeneratedUrls();

			if (imageUrls.length === 0) {
				return res.status(400).json({
					message: "Nenhuma imagem encontrada",
				});
			}

			res
				.status(200)
				.json({ message: "Imagens exportadas com sucesso!", imageUrls });
		} catch (error) {
			console.error("Erro ao exportar imagens:", error);
			res.status(500).json({ error: "Erro interno no servidor" });
		}
	},
};

export default exportController;
