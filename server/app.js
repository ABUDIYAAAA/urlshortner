import express from "express";
import morgan from "morgan";
import cors from "cors";
import urlRouter from "./routes/url.routes.js";
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5174",
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.get("/test-cors", (req, res) => {
  res.json({ msg: "CORS is working!" });
});

app.use("/api/v1", urlRouter);
app.use(morgan("dev"));
export default app;
