import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div className="space-y-8">
      <div className="border-b border-zinc-800 pb-6">
        <h1 className="text-2xl font-bold text-white tracking-tight">Create New Product</h1>
        <p className="text-sm text-zinc-400">Add a new garment or accessory to the catalog</p>
      </div>

      <ProductForm />
    </div>
  );
}
