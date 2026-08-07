import { notFound } from "next/navigation";
import { getProductById } from "@/lib/data/products";
import { ProductForm } from "@/components/admin/ProductForm";

type Params = { params: Promise<{ id: string }> };

export const revalidate = 0;

export default async function EditProductPage({ params }: Params) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div className="border-b border-zinc-800 pb-6">
        <h1 className="text-2xl font-bold text-white tracking-tight">Edit Product</h1>
        <p className="text-sm text-zinc-400">Update details for {product.name}</p>
      </div>

      <ProductForm initialData={product} isEditing />
    </div>
  );
}
