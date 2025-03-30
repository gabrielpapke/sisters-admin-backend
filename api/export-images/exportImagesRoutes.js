import express from "express";
import exportController from "./exportImagesController.js";

const router = express.Router();

router.post("/export-images", exportController.exportImages);

export default router;
