import { NextRequest, NextResponse } from "next/server";
import { getProducts, createProduct } from "@/lib/data/products";
import type { Product } from "@/types/product";

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json(products);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch products";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Omit<Product, "id" | "createdAt" | "updatedAt"> & Partial<Pick<Product, "id">>;
    const created = await createProduct(body);
    return NextResponse.json(created, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create product";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
