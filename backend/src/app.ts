import express from "express";
import cors from "cors";
import emailRoutes from "./routes/emailRoutes";

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());

app.use("/emails", emailRoutes);

app.get("/", (_req, res) => {
  res.send("Backend Running");
});

export default app;