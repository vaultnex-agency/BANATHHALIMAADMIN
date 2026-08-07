import { promises as fs } from "fs";
import path from "path";
import type { Product } from "@/types/product";
import type { Order } from "@/types/order";
import { mockProducts, mockOrders } from "@/data/mock";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

type DB = {
  products: Product[];
  orders: Order[];
};

// ─── Read DB ─────────────────────────────────────────────────────────────────
async function readDB(): Promise<DB> {
  try {
    const raw = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(raw) as DB;
  } catch {
    // First run — seed with mock data
    const seed: DB = { products: mockProducts, orders: mockOrders };
    await writeDB(seed);
    return seed;
  }
}

// ─── Write DB ─────────────────────────────────────────────────────────────────
async function writeDB(db: DB): Promise<void> {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

// ─── Products ────────────────────────────────────────────────────────────────
export async function getProducts(): Promise<Product[]> {
  const db = await readDB();
  return db.products;
}

export async function getProductById(id: string): Promise<Product | null> {
  const db = await readDB();
  return db.products.find((p) => p.id === id) ?? null;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const db = await readDB();
  return db.products.find((p) => p.slug === slug) ?? null;
}

export async function createProduct(product: Product): Promise<Product> {
  const db = await readDB();
  db.products.push(product);
  await writeDB(db);
  return product;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  const db = await readDB();
  const idx = db.products.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  db.products[idx] = { ...db.products[idx], ...updates, updatedAt: new Date().toISOString() };
  await writeDB(db);
  return db.products[idx];
}

export async function deleteProduct(id: string): Promise<boolean> {
  const db = await readDB();
  const before = db.products.length;
  db.products = db.products.filter((p) => p.id !== id);
  await writeDB(db);
  return db.products.length < before;
}

// ─── Orders ──────────────────────────────────────────────────────────────────
export async function getOrders(): Promise<Order[]> {
  const db = await readDB();
  return db.orders.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getOrderById(id: string): Promise<Order | null> {
  const db = await readDB();
  return db.orders.find((o) => o.id === id) ?? null;
}

export async function createOrder(order: Order): Promise<Order> {
  const db = await readDB();
  db.orders.push(order);
  await writeDB(db);
  return order;
}

export async function updateOrderStatus(
  id: string,
  status: Order["status"]
): Promise<Order | null> {
  const db = await readDB();
  const idx = db.orders.findIndex((o) => o.id === id);
  if (idx === -1) return null;
  db.orders[idx] = { ...db.orders[idx], status, updatedAt: new Date().toISOString() };
  await writeDB(db);
  return db.orders[idx];
}
