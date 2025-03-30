import axios from "axios";
import { load } from "cheerio";
import fs from "fs-extra";
import iconv from "iconv-lite";
import fetch from "node-fetch";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";
import cloudinary from "./config/cloudinary.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class WebsiteScraper {
	constructor() {
		this.scrapers = {};
	}

	async scrape(url) {
		try {
			const response = await axios.get(url, {
				responseType: "arraybuffer",
				responseEncoding: "latin1",
			});
			const html = iconv.decode(response.data, "latin1");

			return load(html, {
				decodeEntities: false,
				xmlMode: false,
				lowerCaseTags: false,
				lowerCaseAttributeNames: false,
				recognizeSelfClosing: true,
				normalizeWhitespace: false,
				decodeEntities: true,
				charset: "ISO-8859-1",
			});
		} catch (error) {
			console.error("Erro no scraping:", error);
			return null;
		}
	}

	async uploadImagesToCloudinary(imageUrls, folder, imageName) {
		try {
			// Usar Promise.all para aguardar todas as Promises retornadas pelo upload
			const uploadResults = await Promise.all(
				imageUrls.map(async (url, index) => {
					try {
						// Adicionar um sufixo ao nome da imagem para evitar conflitos
						const uniqueImageName = `${imageName}_${index}`;
						const result = await cloudinary.uploader.upload(url, {
							public_id: uniqueImageName,
							folder,
						});

						console.log(result);

						const optimizeUrl = cloudinary.url(result.public_id, {
							width: 1200,
							height: 1200,
							crop: "auto",
							quality: "auto",
							fetch_format: "auto",
						});

						console.log(optimizeUrl);

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

	async downloadImages(imageUrls, imageName, outputDir) {
		try {
			await fs.ensureDir(outputDir);
			console.log("Gerando imagens...");
			const generatedPaths = []; // Array para armazenar os caminhos das imagens geradas

			for (let i = 0; i < imageUrls.length; i++) {
				const response = await fetch(imageUrls[i]);
				const buffer = await response.arrayBuffer();
				const fileName = `image_${i + 1}.jpg`;

				// Salvar a imagem original
				const originalPath = path.join(
					outputDir,
					`${imageName}_${fileName}_original.jpg`
				);
				await fs.writeFile(originalPath, Buffer.from(buffer));
				console.log("Imagem original salva com sucesso:", originalPath);
				generatedPaths.push(originalPath);

				// Carregar a imagem com sharp
				const image = sharp(Buffer.from(buffer));

				// Obter as informações da imagem
				const metadata = await image.metadata();
				const { width, height } = metadata;

				// Calcular as dimensões para o corte centralizado
				let left = 0;
				let top = 0;
				let size = Math.min(width, height); // Usar o menor tamanho para o corte
				if (width > size) {
					left = Math.floor((width - size) / 2);
				}
				if (height > size) {
					top = Math.floor((height - size) / 2);
				}

				// Realizar o corte centralizado em 1200x1200 pixels
				const cutPath = path.join(
					outputDir,
					`${imageName}_${fileName}_cut.jpg`
				);
				await image
					.extract({ left, top, width: size, height: size })
					.resize(1200, 1200)
					.toFile(cutPath);

				console.log("Imagem cortada salva com sucesso:", cutPath);
				generatedPaths.push(cutPath);
			}

			return generatedPaths; // Retornar os caminhos das imagens geradas
		} catch (error) {
			console.error("Erro ao fazer o download das imagens:", error);
			return [];
		}
	}

	async exportImages(site) {
		const allGeneratedPaths = [];

		for (const product of site.products) {
			const $ = await this.scrape(product.url);

			const imageURLs = $(site.imageFinder.container)
				.find(site.imageFinder.element)
				.map((_, element) => {
					const url = $(element).attr(site.imageFinder.attr);

					if (site.imageFinder.prefix && url) {
						return site.imageFinder.prefix.concat(url);
					}

					return url;
				})
				.filter((url) => url)
				.get();

			console.log(imageURLs);
			// Baixa as imagens relacionadas ao produto
			if (imageURLs && imageURLs.length > 0) {
				// const outputDir = path.join(
				// 	__dirname,
				// 	"public/images",
				// 	site.name,
				// 	product.name
				// );
				const generatedPaths = await this.uploadImagesToCloudinary(
					imageURLs,
					site.name,
					product.name
				);

				// const generatedPaths = await this.downloadImages(
				// 	imageURLs,
				// 	product.name,
				// 	outputDir
				// );

				allGeneratedPaths.push(...generatedPaths);
			}
		}

		return allGeneratedPaths;
	}
}
export { WebsiteScraper };
