import apiClient from "../../config/axiosConfig.js";
import ExportImagesService from "../export-images/exportImagesService.js";

export default class CreateProductsService {
	constructor() {}
	async create(product, supplier, site_url) {
		let imageUrls = [];
		if (site_url && supplier) {
			const exportImageService = new ExportImagesService(
				supplier,
				site_url,
				product.name
			);
			imageUrls = await exportImageService.getGeneratedUrls();
		}
		return await apiClient
			.post("/catalog/products?include=skus", {
				simple: product.simple,
				brand_id: product.brand_id,
				erp_id: product.erp_id,
				active: product.active,
				searchable: product.searchable,
				is_digital: product.is_digital,
				buy_similars: product.buy_similars,
				priority: product.priority,
				rating: product.rating,
				ncm: product.ncm,
				name: product.name,
				slug: product.slug,
				video: product.video,
				description: product.description,
				specifications: product.specifications,
				measures: product.measures,
				gift_value: product.gift_value,
				seo_title: product.seo_title,
				seo_description: product.seo_description,
				seo_keywords: product.seo_keywords,
				canonical_url: product.canonical_url,
				search_terms: product.search_terms,
				categories_ids: product.categories_ids,
				flags_ids: product.flags_ids,
				collections_ids: product.collections_ids,
				filters_values_ids: product.filters_values_ids,
				use_different_images: product.use_different_images,
				variations_ids: product.variations_ids,
				skus: !site_url
					? product.skus
					: product.skus.map((sku) => ({
							...sku,
							images: imageUrls.map((url) => ({
								url,
							})),
					  })),
			})
			.catch((error) => {
				console.log(error);
				throw new Error("Erro ao cadastrar na api yampi");
			});
	}
}
