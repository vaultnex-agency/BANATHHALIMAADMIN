import Link from "next/link";
import { Package, PlusCircle, Edit } from "lucide-react";
import { getProducts } from "@/lib/data/products";
import { DeleteProductButton } from "./DeleteProductButton";

export const revalidate = 0;

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            <Package className="w-6 h-6 text-amber-500" />
            <span>Product Inventory Management</span>
          </h1>
          <p className="text-sm text-zinc-400">
            Create, edit, and manage store abayas and accessories
          </p>
        </div>

        <Link
          href="/products/new"
          className="inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Products Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="bg-zinc-950/60 text-xs uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-4">Product Details</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      {product.images[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg border border-zinc-800"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center text-xs text-zinc-500">
                          No img
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-white">{product.name}</div>
                        <div className="text-xs text-zinc-500 font-mono">/{product.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs">
                    <span className="bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded-md border border-zinc-700">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-white font-mono">
                    {product.price.toLocaleString("en-AE")} AED
                  </td>
                  <td className="px-6 py-4 text-xs font-mono">
                    {product.stockCount} units
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.inStock
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}
                    >
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        href={`/products/${product.id}`}
                        className="p-1.5 text-zinc-400 hover:text-amber-300 hover:bg-zinc-800 rounded-lg transition-colors"
                        title="Edit product"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <DeleteProductButton productId={product.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
