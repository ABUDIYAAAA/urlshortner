import app from "./app.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
dotenv.config();

connectDB();
const PORT = 5175;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
