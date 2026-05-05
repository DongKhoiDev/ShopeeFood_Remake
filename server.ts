import express from "express";
import cors from "cors";
import path from "path";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-12345";

// SQLite database wrapper
const db = new Database(path.join(__dirname, 'database.sqlite'));
const execute = async (query: string, params: any[] = []) => {
  const stmt = db.prepare(query);
  const info = stmt.run(...params);
  return { lastID: info.lastInsertRowid, changes: info.changes };
};
const queryOne = async (query: string, params: any[] = []): Promise<any> => {
  const stmt = db.prepare(query);
  return stmt.get(...params);
};
const queryAll = async (query: string, params: any[] = []): Promise<any[]> => {
  const stmt = db.prepare(query);
  return stmt.all(...params);
};

async function initDb() {
  await execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT,
      name TEXT,
      role TEXT DEFAULT 'user',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await execute(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT,
      description TEXT,
      price INTEGER,
      category TEXT,
      image TEXT,
      restaurantId TEXT,
      rating REAL,
      isBestseller BOOLEAN,
      variants TEXT,
      optionGroups TEXT,
      isHidden BOOLEAN DEFAULT 0
    )
  `);

  await execute(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      userId INTEGER,
      items TEXT,
      totalPrice INTEGER,
      paymentMethod TEXT,
      status TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await execute(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      productId TEXT,
      userId INTEGER,
      rating INTEGER,
      comment TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

// Ensure DB is initialized
initDb().catch(console.error);

// Middleware for auth
const authMiddleware = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Server is online!" });
  });

  // Auth Routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) return res.status(400).json({ error: "Missing fields" });
      
      const existing = await queryOne("SELECT id FROM users WHERE email = ?", [email]);
      if (existing) return res.status(400).json({ error: "Email already exists" });

      const hash = await bcrypt.hash(password, 10);
      const result: any = await execute("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hash]);
      
      const token = jwt.sign({ id: result.lastID, email, name, role: 'user' }, JWT_SECRET, { expiresIn: '7d' });
      res.json({ token, user: { id: result.lastID, name, email, role: 'user' } });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await queryOne("SELECT * FROM users WHERE email = ?", [email]);
      if (!user) return res.status(400).json({ error: "Invalid credentials" });

      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(400).json({ error: "Invalid credentials" });

      const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
      res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
  
  app.get("/api/auth/me", authMiddleware, (req: any, res) => {
    res.json({ user: req.user });
  });

  // Products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await queryAll("SELECT * FROM products WHERE isHidden = 0");
      const p = products.map((pr: any) => ({
        ...pr,
        variants: pr.variants ? JSON.parse(pr.variants) : [],
        optionGroups: pr.optionGroups ? JSON.parse(pr.optionGroups) : [],
        isBestseller: !!pr.isBestseller
      }));
      res.json(p);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Admin Products
  app.post("/api/products", authMiddleware, async (req: any, res: any) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: "Forbidden" });
    try {
      const { id, name, description, price, category, image, restaurantId, rating, isBestseller, variants, optionGroups } = req.body;
      const newId = id || Math.random().toString(36).substring(7);
      await execute(
        "INSERT OR REPLACE INTO products (id, name, description, price, category, image, restaurantId, rating, isBestseller, variants, optionGroups) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [newId, name, description, price, category, image, restaurantId, rating || 0, isBestseller ? 1 : 0, JSON.stringify(variants || []), JSON.stringify(optionGroups || [])]
      );
      res.json({ success: true, id: newId });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/products/:id", authMiddleware, async (req: any, res: any) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: "Forbidden" });
    try {
      await execute("UPDATE products SET isHidden = 1 WHERE id = ?", [req.params.id]);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Orders
  app.post("/api/orders", authMiddleware, async (req: any, res) => {
    try {
      const { id, items, totalPrice, paymentMethod } = req.body;
      const orderId = id || `ORD-${Math.floor(Math.random()*1000000)}`;
      await execute(
        "INSERT INTO orders (id, userId, items, totalPrice, paymentMethod, status) VALUES (?, ?, ?, ?, ?, ?)",
        [orderId, req.user.id, JSON.stringify(items), totalPrice, paymentMethod, 'PENDING']
      );
      res.json({ success: true, orderId });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/orders/me", authMiddleware, async (req: any, res) => {
    try {
      const orders = await queryAll("SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC", [req.user.id]);
      res.json(orders.map(o => ({ ...o, items: JSON.parse(o.items) })));
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/orders", authMiddleware, async (req: any, res: any) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: "Forbidden" });
    try {
      const orders = await queryAll("SELECT * FROM orders ORDER BY createdAt DESC");
      res.json(orders.map(o => ({ ...o, items: JSON.parse(o.items) })));
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/orders/:id/status", authMiddleware, async (req: any, res: any) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: "Forbidden" });
    try {
      const { status } = req.body;
      await execute("UPDATE orders SET status = ? WHERE id = ?", [status, req.params.id]);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Analytics
  app.get("/api/analytics/dashboard", authMiddleware, async (req: any, res: any) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: "Forbidden" });
    try {
      const totalRevenue = await queryOne("SELECT SUM(totalPrice) as total FROM orders WHERE status = 'COMPLETED'");
      const totalOrders = await queryOne("SELECT COUNT(*) as total FROM orders");
      const totalUsers = await queryOne("SELECT COUNT(*) as total FROM users WHERE role = 'user'");
      const totalProducts = await queryOne("SELECT COUNT(*) as total FROM products WHERE isHidden = 0");
      
      const recentOrders = await queryAll("SELECT * FROM orders ORDER BY createdAt DESC LIMIT 5");

      res.json({
        totalRevenue: totalRevenue?.total || 0,
        totalOrders: totalOrders?.total || 0,
        totalUsers: totalUsers?.total || 0,
        totalProducts: totalProducts?.total || 0,
        recentOrders: recentOrders.map(o => ({ ...o, items: JSON.parse(o.items) }))
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for development or Static files for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
