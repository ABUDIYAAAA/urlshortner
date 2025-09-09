import express from "express";
import createUrl from "../../client/urlshortner/src/hooks/createUrl.js";
const urlRouter = express.Router();

urlRouter.post("/create", createUrl);

export default urlRouter;
