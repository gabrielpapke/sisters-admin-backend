import axios from "axios";
import { load } from "cheerio";
import iconv from "iconv-lite";

export default class WebsiteScraperHelper {
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
}
