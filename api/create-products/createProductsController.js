import CreateProductsService from "./createProductsService.js";

const exportController = {
	async create(req, res) {
		try {
			const { product, supplier, site_url } = req.body;

			if (!product) {
				return res.status(400).json({ error: "Dados inválidos" });
			}

			const createProductService = new CreateProductsService();
			const response = await createProductService.create(
				product,
				supplier,
				site_url
			);

			res.status(200).json(response.data);
		} catch (error) {
			console.error("Erro ao cadastrar produto");
			res.status(500).json({ error: "Erro interno no servidor" });
		}
	},
};

export default exportController;
