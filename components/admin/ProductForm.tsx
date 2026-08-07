"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, Loader2, Save } from "lucide-react";
import type { Product } from "@/types/product";

interface ProductFormProps {
  initialData?: Product;
  isEditing?: boolean;
}

export function ProductForm({ initialData, isEditing = false }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    price: initialData?.price || 0,
    originalPrice: initialData?.originalPrice || 0,
    category: initialData?.category || "Abayas",
    description: initialData?.description || "",
    fabric: initialData?.fabric || "",
    sizes: initialData?.sizes?.join(", ") || "S, M, L, XL",
    inStock: initialData?.inStock ?? true,
    stockCount: initialData?.stockCount || 10,
    isFeatured: initialData?.isFeatured ?? false,
    isBestSeller: initialData?.isBestSeller ?? false,
    images: initialData?.images || [],
  });

  const [imageInput, setImageInput] = useState("");

  const handleAddImage = () => {
    if (!imageInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, imageInput.trim()],
    }));
    setImageInput("");
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: isEditing ? prev.slug : generateSlug(name),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload: Partial<Product> = {
        ...formData,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice),
        stockCount: Number(formData.stockCount),
        sizes: formData.sizes.split(",").map((s) => s.trim()).filter(Boolean),
        currency: "AED",
        rating: initialData?.rating || 5,
        reviewCount: initialData?.reviewCount || 0,
        colours: initialData?.colours || [],
        occasion: initialData?.occasion || [],
        isNew: initialData?.isNew ?? true,
      };

      const url = isEditing
        ? `/api/products/${initialData?.id}`
        : "/api/products";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save product");
      }

      router.push("/products");
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Basic Information */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white border-b border-zinc-800 pb-3">
          Basic Product Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
              Product Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500 text-sm"
              placeholder="e.g. Royal Silk Abaya"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
              URL Slug *
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500 text-sm"
              placeholder="royal-silk-abaya"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500 text-sm"
            >
              <option value="Abayas">Abayas</option>
              <option value="Hijabs">Hijabs</option>
              <option value="Dresses">Dresses</option>
              <option value="Kaftans">Kaftans</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
              Fabric Material
            </label>
            <input
              type="text"
              value={formData.fabric}
              onChange={(e) => setFormData((prev) => ({ ...prev, fabric: e.target.value }))}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500 text-sm"
              placeholder="e.g. Nida, Silk, Chiffon"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
            Description
          </label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500 text-sm"
            placeholder="Detailed description of the garment, embroidery, cut, and occasion..."
          />
        </div>
      </div>

      {/* Pricing & Inventory */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white border-b border-zinc-800 pb-3">
          Pricing & Inventory
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
              Price (AED) *
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.price}
              onChange={(e) => setFormData((prev) => ({ ...prev, price: Number(e.target.value) }))}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500 text-sm"
              placeholder="299.00"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
              Original Price
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.originalPrice || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, originalPrice: Number(e.target.value) }))}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500 text-sm"
              placeholder="399.00"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
              Stock Count *
            </label>
            <input
              type="number"
              required
              value={formData.stockCount}
              onChange={(e) => setFormData((prev) => ({ ...prev, stockCount: Number(e.target.value) }))}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500 text-sm"
              placeholder="10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div>
            <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
              Available Sizes (Comma Separated)
            </label>
            <input
              type="text"
              value={formData.sizes}
              onChange={(e) => setFormData((prev) => ({ ...prev, sizes: e.target.value }))}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500 text-sm"
              placeholder="52, 54, 56, 58"
            />
          </div>
        </div>
      </div>

      {/* Media & Images */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h3 className="text-lg font-semibold text-white">Product Images</h3>
          <span className="text-xs text-zinc-500">Prepared for Supabase Storage bucket</span>
        </div>

        <div className="flex gap-2">
          <input
            type="url"
            value={imageInput}
            onChange={(e) => setImageInput(e.target.value)}
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500 text-sm"
            placeholder="Paste image URL..."
          />
          <button
            type="button"
            onClick={handleAddImage}
            className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Add Image
          </button>
        </div>

        {formData.images.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            {formData.images.map((img, idx) => (
              <div key={idx} className="relative group rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 aspect-square">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt={`Product ${idx + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-2 right-2 p-1 bg-red-600/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed border-zinc-800 rounded-lg p-8 text-center text-zinc-500 text-sm">
            No images added yet. Enter image URLs or upload product photos.
          </div>
        )}
      </div>

      {/* Flags & Toggles */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-wrap gap-6">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.inStock}
            onChange={(e) => setFormData((prev) => ({ ...prev, inStock: e.target.checked }))}
            className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-amber-500 focus:ring-amber-500"
          />
          <span className="text-sm font-medium text-zinc-300">In Stock</span>
        </label>

        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isFeatured}
            onChange={(e) => setFormData((prev) => ({ ...prev, isFeatured: e.target.checked }))}
            className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-amber-500 focus:ring-amber-500"
          />
          <span className="text-sm font-medium text-zinc-300">Featured Homepage Product</span>
        </label>

        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isBestSeller}
            onChange={(e) => setFormData((prev) => ({ ...prev, isBestSeller: e.target.checked }))}
            className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-amber-500 focus:ring-amber-500"
          />
          <span className="text-sm font-medium text-zinc-300">Best Seller</span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors text-sm font-medium"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold px-6 py-2.5 rounded-lg flex items-center gap-2 transition-colors text-sm disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{isEditing ? "Update Product" : "Save Product"}</span>
        </button>
      </div>
    </form>
  );
}
