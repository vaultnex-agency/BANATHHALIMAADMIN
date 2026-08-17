import Link from "next/link";
import { Plus, Edit } from "lucide-react";
import { getProducts } from "@/lib/data/products";
import { DeleteProductButton } from "./DeleteProductButton";
import { StatusBadge } from "@/components/admin/StatusBadge";

export const revalidate = 0;

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-neutral-900">
            Products
          </h1>
          <p className="text-sm text-neutral-500 mt-1 font-normal">
            {products.length} total products
          </p>
        </div>

        <Link
          href="/products/new"
          className="inline-flex items-center justify-center space-x-2 bg-amber-500 hover:bg-amber-600 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition-all shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Product</span>
        </Link>
      </div>

      {/* Products Table Container */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-hidden">
        {products.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200/60">
              <Plus className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-neutral-900">No products yet</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1 mb-6">
              Your catalog is currently empty. Add your first product to display it on the customer storefront.
            </p>
            <Link
              href="/products/new"
              className="inline-flex items-center space-x-2 bg-neutral-950 hover:bg-neutral-800 text-white font-medium px-5 py-2.5 rounded-xl text-xs transition-all shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your First Product</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-700 border-collapse">
              <thead>
                <tr className="bg-neutral-50/80 text-[11px] uppercase tracking-wider text-neutral-400 font-semibold border-b border-neutral-100">
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-neutral-50/60 transition-colors">
                    {/* Product Column */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        {product.images && product.images[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-xl border border-neutral-200/80 bg-neutral-100 shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-neutral-100 rounded-xl border border-neutral-200/80 flex items-center justify-center text-[10px] text-neutral-400 uppercase font-medium shrink-0">
                            No Image
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-neutral-900 text-sm">
                            {product.name}
                          </div>
                          {product.fabric && (
                            <div className="text-xs text-neutral-500 font-normal mt-0.5">
                              {product.fabric}
                            </div>
                          )}
                          {/* Optional Badges */}
                          <div className="flex items-center gap-1.5 mt-1">
                            {product.isNew && (
                              <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200/60 px-1.5 py-0.2 rounded font-medium">
                                New
                              </span>
                            )}
                            {product.isBestSeller && (
                              <span className="text-[10px] bg-purple-50 text-purple-700 border border-purple-200/60 px-1.5 py-0.2 rounded font-medium">
                                Best Seller
                              </span>
                            )}
                            {product.isFeatured && (
                              <span className="text-[10px] bg-sky-50 text-sky-700 border border-sky-200/60 px-1.5 py-0.2 rounded font-medium">
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category Column */}
                    <td className="px-6 py-4 text-xs font-medium">
                      <span className="bg-neutral-100 text-neutral-700 px-2.5 py-1 rounded-lg border border-neutral-200/50">
                        {product.category}
                      </span>
                    </td>

                    {/* Price Column */}
                    <td className="px-6 py-4 font-mono text-sm font-semibold text-neutral-900">
                      <div className="flex items-baseline space-x-2">
                        <span>AED {product.price.toLocaleString("en-AE")}</span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-xs text-neutral-400 line-through font-normal">
                            AED {product.originalPrice.toLocaleString("en-AE")}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Stock Column */}
                    <td className="px-6 py-4 text-xs font-mono text-neutral-600">
                      {product.stockCount} units
                    </td>

                    {/* Status Column */}
                    <td className="px-6 py-4">
                      <StatusBadge
                        status={product.inStock ? "in_stock" : "out_of_stock"}
                      />
                    </td>

                    {/* Actions Column */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <Link
                          href={`/products/${product.id}`}
                          className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
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
        )}
      </div>
    </div>
  );
}
