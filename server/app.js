import express from "express";
import morgan from "morgan";
import cors from "cors";
import urlRouter from "./routes/url.routes.js";
import { redirectUrl } from "./controllers/url.controller.js";
import helmet from "helmet";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(helmet());
app.use(morgan("dev"));
app.set("trust proxy", true);

app.use("/api/v1", urlRouter);

app.get("/test-cors", (req, res) => {
  res.json({ msg: "CORS is working!" });
});

app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

app.get("/:shortCode", redirectUrl);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((error, req, res, next) => {
  console.error("Error:", error);
  res.status(500).json({ error: "Internal server error" });
});

export default app;
