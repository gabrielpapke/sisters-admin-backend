import CloudinaryHelper from "../../helpers/cloudinary.helper.js";
import WebsiteScraperHelper from "../../helpers/web-scraper.js";
import { SiteEL } from "../../products/el.js";

export default class ExportImagesService {
	scraper = new WebsiteScraperHelper();

	constructor(supplier, products) {
		this.site = this.getSite(supplier, products);
	}

	getSite(supplier, products) {
		if (supplier === "EL") {
			return new SiteEL(products, supplier);
		}

		return null;
	}

	async getOriginUrls(product) {
		const $ = await this.scraper.scrape(product.url);

		return $(this.site.imageFinder.container)
			.find(this.site.imageFinder.element)
			.map((_, element) => {
				const url = $(element).attr(this.site.imageFinder.attr);

				if (this.site.imageFinder.prefix && url) {
					return this.site.imageFinder.prefix.concat(url);
				}

				return url;
			})
			.filter((url) => url)
			.get();
	}

	async getGeneratedUrls() {
		const allGeneratedPaths = [];
		for (const product of this.site.products) {
			const imageURLs = await this.getOriginUrls(product);

			if (imageURLs && imageURLs.length > 0) {
				const generatedPaths = await CloudinaryHelper.uploadImagesToCloudinary(
					imageURLs,
					this.site.name,
					product.name
				);

				allGeneratedPaths.push(...generatedPaths);
			}
		}

		return allGeneratedPaths;
	}
}
