/**
 * One-off script: clears all products and orders from Supabase.
 * Run from banath-admin: node scripts/clear-catalog.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, "..", ".env.local");

function loadEnv(path) {
  const vars = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    vars[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return vars;
}

const env = loadEnv(envPath);
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

const { error: ordersError } = await supabase.from("orders").delete().neq("order_number", "");
if (ordersError) {
  console.error("Failed to delete orders:", ordersError.message);
  process.exit(1);
}

const { error: productsError } = await supabase.from("products").delete().neq("slug", "");
if (productsError) {
  console.error("Failed to delete products:", productsError.message);
  process.exit(1);
}

const { count: productsAfter } = await supabase
  .from("products")
  .select("*", { count: "exact", head: true });
const { count: ordersAfter } = await supabase
  .from("orders")
  .select("*", { count: "exact", head: true });

console.log("Supabase catalog cleared.");
console.log(`Products remaining: ${productsAfter ?? 0}`);
console.log(`Orders remaining: ${ordersAfter ?? 0}`);
