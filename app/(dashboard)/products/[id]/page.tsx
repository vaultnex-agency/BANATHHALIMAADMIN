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

  return <ProductForm initialData={product} isEditing />;
}
