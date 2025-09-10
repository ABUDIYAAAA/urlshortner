import express from "express";
import { createUrl, getUrlStats } from "../controllers/url.controller.js";
const urlRouter = express.Router();

urlRouter.post("/create", createUrl);
urlRouter.get("/stats/:shortCode", getUrlStats);

export default urlRouter;
