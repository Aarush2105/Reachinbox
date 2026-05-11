import express from "express";
import cors from "cors";
import emailRoutes from "./routes/emailRoutes";

const app = express();

app.use(cors({
  origin: "https://6a01a936c5d71b85860a76dd--wondrous-horse-7fbe25.netlify.app/",
  credentials: true,
}));
app.use(express.json());

app.use("/emails", emailRoutes);

app.get("/", (_req, res) => {
  res.send("Backend Running");
});

export default app;