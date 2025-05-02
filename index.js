import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import createProductsRoutes from "./api/create-products/createProductsRoutes.js";
import exportImagesRoutes from "./api/export-images/exportImagesRoutes.js";
import setYampiHeaders from "./middlewares/yampiHeader.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(bodyParser.json());
app.use(cors());
app.use(setYampiHeaders);

// Rotas
app.use("/api", exportImagesRoutes);
app.use("/api", createProductsRoutes);

// Iniciar o servidor
app.listen(port, () => {
	console.log(`Servidor rodando em ${process.env.API_URL}:${port}`);
});
