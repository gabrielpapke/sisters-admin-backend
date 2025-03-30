import { Products } from "./products.js";

export class SiteEL extends Products {
	constructor(products, productEnum) {
		super(products, productEnum);
		this.name = productEnum;
		this.imageFinder = {
			container: ".gallery-product",
			element: "figure a",
			attr: "data-zoom",
			prefix: this.getUrlPrefix(productEnum),
		};
		this.selectors = {
			nome: "title",
			descricao: ".description",
		};
	}
}
