import CloudinaryHelper from "../../helpers/cloudinary.helper.js";
import WebsiteScraperHelper from "../../helpers/web-scraper.js";
import { SiteEL } from "../../products/el.js";

export default class ExportImagesService {
	scraper = new WebsiteScraperHelper();

	constructor(supplier, url, name) {
		this.site = this.getSite(supplier);
		this.url = url;
		this.name = name;
	}

	getSite(supplier) {
		if (supplier === "EL") {
			return new SiteEL(supplier);
		}

		return null;
	}

	async getOriginUrls() {
		const $ = await this.scraper.scrape(this.url);

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

		const imageURLs = await this.getOriginUrls();

		if (imageURLs && imageURLs.length > 0) {
			const generatedPaths = await CloudinaryHelper.uploadImagesToCloudinary(
				imageURLs,
				this.site.name,
				this.name
			);

			allGeneratedPaths.push(...generatedPaths);
		}

		return allGeneratedPaths;
	}
}
