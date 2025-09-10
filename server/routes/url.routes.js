import express from "express";
import { createUrl } from "../controllers/url.controller.js";
const urlRouter = express.Router();

urlRouter.post("/create", createUrl);

export default urlRouter;
