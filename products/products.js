export default class Products {
	productEnum = null;
	constructor(products, productEnum) {
		this.products = products;
		this.productEnum = productEnum;
		this.attributes = {
			id: "",
			ativo: "nao",
			possui_variacoes: "nao",
			marca: "Sisters",
			codigo_erp: "",
			ncm: "",
			nome: "",
			buscavel: "sim",
			produto_digital: "nao",
			categorias: "",
			colecoes: "",
			filtros: "",
			variacoes: "",
			selos: "",
			slug: "",
			video: "",
			descricao: "",
			meses_de_garantia: "",
			frete_customizado: "",
			valor_do_frete: "",
			especificacoes: "",
			medidas: "",
			valor_de_presente: "",
			categoria_google: "5322",
			seo_titulo_pagina: "",
			seo_descricao: "",
			seo_palavras_chave: "",
			link_canonico: "",
			termos_de_busca: "",
			link_produto: "",
			link_foto_principal: "",
			link_produto: "",
			link_produto: "",
		};
	}

	getUrlPrefix() {
		return process.env[`${this.productEnum}_URL`];
	}
}

export { Products };
