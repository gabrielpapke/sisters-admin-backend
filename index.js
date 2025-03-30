import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fs from "fs-extra";
import cron from "node-cron";
import path from "path";
import { fileURLToPath } from "url";
import { WebsiteScraper } from "./export-image.js";
import { SiteEL } from "./products/el.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imagesDir = path.join(__dirname, "public/images");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware para processar JSON
app.use(bodyParser.json());

app.use(cors());
app.use("/images", express.static(imagesDir));

// Instância do scraper
const scraper = new WebsiteScraper();

// Rota para exportar imagens
app.post("/export-images", async (req, res) => {
	try {
		const { supplier, products } = req.body;

		// Validação básica
		if (!supplier || !products || !Array.isArray(products)) {
			return res.status(400).json({ error: "Dados inválidos" });
		}

		// Configurar o site com base no nome
		let site;
		if (supplier === "EL") {
			site = new SiteEL(products, supplier);
		} else {
			return res.status(400).json({ error: "Site não suportado" });
		}

		// Chamar a função exportImages e obter as URLs
		const imageUrls = await scraper.exportImages(site);

		if (imageUrls.length === 0) {
			return res.status(400).json({
				message: "Nenhuma imagem encontrada",
			});
		}

		// Retornar as URLs para o front-end
		res
			.status(200)
			.json({ message: "Imagens exportadas com sucesso!", imageUrls });
	} catch (error) {
		console.error("Erro ao exportar imagens:", error);
		res.status(500).json({ error: "Erro interno no servidor" });
	}
});

const cleanImages = async () => {
	try {
		console.log("Limpando a pasta de imagens...");
		await fs.emptyDir(imagesDir);
		console.log("Pasta de imagens limpa com sucesso!");
	} catch (error) {
		console.error("Erro ao limpar a pasta de imagens:", error);
	}
};

cron.schedule("0 0 * * *", async () => {
	await cleanImages();
});

// Iniciar o servidor
app.listen(port, () => {
	cleanImages();
	console.log(`Servidor rodando em ${process.env.API_URL}:${port}`);
});
