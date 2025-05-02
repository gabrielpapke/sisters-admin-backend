export default class Products {
	productEnum = null;
	constructor(productEnum) {
		this.productEnum = productEnum;
	}

	getUrlPrefix() {
		return process.env[`${this.productEnum}_URL`];
	}
}

export { Products };
