import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import exportImagesRoutes from "./api/export-images/exportImagesRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(bodyParser.json());
app.use(cors());

// Rotas
app.use("/api", exportImagesRoutes);

// Iniciar o servidor
app.listen(port, () => {
	console.log(`Servidor rodando em ${process.env.API_URL}:${port}`);
});
