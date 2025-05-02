import express from "express";
import createProductsController from "./createProductsController.js";

const router = express.Router();

router.post("/create-products", createProductsController.create);

export default router;
