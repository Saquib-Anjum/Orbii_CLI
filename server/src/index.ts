import express, { type Request, type Response } from "express";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import cors from "cors";
import "dotenv/config";
import { auth } from "./lib/auth.js";

const app = express();

// 1. CORS first
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// 2. Better Auth handler, before express.json()
app.all("/api/auth/*splat", toNodeHandler(auth));

// 3. JSON parsing after the auth handler
app.use(express.json());

app.get("/health", (req: Request, res: Response) => {
  res.send("Ok");
});

app.get("/api/me", async (req: Request, res: Response) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  return res.json(session);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server is running on ${PORT} | http://localhost:${PORT}`);
});
