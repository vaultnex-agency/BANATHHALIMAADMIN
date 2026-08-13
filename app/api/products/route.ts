import { NextRequest, NextResponse } from "next/server";
import { getProducts, createProduct } from "@/lib/data/products";
import type { Product } from "@/types/product";

export async function GET() {
  const products = await getProducts();
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Omit<Product, "id" | "createdAt" | "updatedAt">;
    const now = new Date().toISOString();
    const product: Product = {
      ...body,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };

    const created = await createProduct(product);
    return NextResponse.json(created, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create product";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

