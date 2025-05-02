import { Products } from "./products.js";

export class SiteEL extends Products {
	constructor(productEnum) {
		super(productEnum);
		this.name = productEnum;
		this.imageFinder = {
			container: ".gallery-product",
			element: "figure a",
			attr: "data-zoom",
			prefix: this.getUrlPrefix(),
		};
		this.selectors = {
			nome: "title",
			descricao: ".description",
		};
	}
}
