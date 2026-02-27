import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import multer from "multer";
import Stripe from "stripe";
import Database from "better-sqlite3";

const db = new Database("voltwise.db");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_mock");
const JWT_SECRET = process.env.JWT_SECRET || "voltwise_secret_123";

// Initialize DB
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    subscription_tier TEXT DEFAULT 'free'
  );
  CREATE TABLE IF NOT EXISTS buildings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name TEXT,
    address TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
  CREATE TABLE IF NOT EXISTS meter_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    building_id INTEGER,
    timestamp DATETIME,
    consumption REAL,
    FOREIGN KEY(building_id) REFERENCES buildings(id)
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());

  const upload = multer({ dest: "uploads/" });

  // Auth Middleware
  const authenticateToken = (req: any, res: any, next: any) => {
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.status(403).json({ error: "Forbidden" });
      req.user = user;
      next();
    });
  };

  // API Routes
  app.post("/api/auth/register", async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const info = db.prepare("INSERT INTO users (email, password) VALUES (?, ?)").run(email, hashedPassword);
      res.json({ id: info.lastInsertRowid });
    } catch (e) {
      res.status(400).json({ error: "User already exists" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const user: any = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user.id, email: user.email, tier: user.subscription_tier }, JWT_SECRET);
      res.cookie("token", token, { httpOnly: true, secure: true, sameSite: 'none' });
      res.json({ token, user: { id: user.id, email: user.email, tier: user.subscription_tier } });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  app.get("/api/users/me", authenticateToken, (req: any, res) => {
    const user: any = db.prepare("SELECT id, email, subscription_tier FROM users WHERE id = ?").get(req.user.id);
    res.json(user);
  });

  app.get("/api/buildings", authenticateToken, (req: any, res) => {
    const buildings = db.prepare("SELECT * FROM buildings WHERE user_id = ?").all(req.user.id);
    res.json(buildings);
  });

  app.post("/api/buildings", authenticateToken, (req: any, res) => {
    const { name, address } = req.body;
    const info = db.prepare("INSERT INTO buildings (user_id, name, address) VALUES (?, ?, ?)").run(req.user.id, name, address);
    res.json({ id: info.lastInsertRowid, name, address });
  });

  app.post("/api/meter-data/:building_id", authenticateToken, upload.single("file"), (req, res) => {
    // In a real app, parse CSV and insert into DB
    res.json({ message: "Data uploaded successfully" });
  });

  app.get("/api/forecast/:building_id", authenticateToken, (req, res) => {
    // Mock AI Forecast logic
    const forecast = Array.from({ length: 24 }, () => Math.random() * 100 + 50);
    const peak_detected = Math.max(...forecast) > 140;
    res.json({
      forecast,
      peak_detected,
      estimated_cost: forecast.reduce((a, b) => a + b, 0) * 8.5,
      recommended_load_reduction: peak_detected ? 20 : 0
    });
  });

  app.post("/api/subscriptions/create-checkout-session", authenticateToken, async (req: any, res) => {
    const { priceId } = req.body;
    // Mock Stripe session
    res.json({ url: "https://checkout.stripe.com/mock-session" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
