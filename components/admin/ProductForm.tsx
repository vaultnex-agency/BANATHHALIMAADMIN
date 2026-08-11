"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Trash2,
  Loader2,
  ArrowLeft,
  UploadCloud,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import type { Product, ProductType } from "@/types/product";
import {
  uploadProductImage,
  deleteProductImage,
  validateImageFile,
  getProductImageUrl,
} from "@/lib/storage/productImages";

interface ProductFormProps {
  initialData?: Product;
  isEditing?: boolean;
}

const AVAILABLE_CATEGORIES = [
  "Churidar Suits",
  "Abayas",
  "Bit Pieces",
  "Ready to Wear",
  "Dupattas",
  "Fabric Bits",
  "Accessories",
];

const AVAILABLE_FABRICS = [
  "Georgette",
  "Chiffon",
  "Organza",
  "Silk Blend",
  "Cotton",
  "Velvet",
  "Raw Silk",
  "Net",
  "Lawn",
  "Linen",
  "Satin",
];

const AVAILABLE_OCCASIONS = [
  "Casual",
  "Festive",
  "Wedding",
  "Bridal",
  "Formal",
  "Party",
  "Daily Wear",
  "Eid",
];

const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];


export function ProductForm({ initialData, isEditing = false }: ProductFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    price: initialData?.price || 0,
    originalPrice: initialData?.originalPrice || 0,
    category: initialData?.category || "Churidar Suits",
    description: initialData?.description || "",
    fabric: initialData?.fabric || "Georgette",
    productType: (initialData?.productType || "bit-piece") as ProductType,
    sizeDetails: initialData?.sizeDetails || {
      shirt: "2.5 m",
      bottom: "2.5 m",
      dupatta: "2.25 m",
    },
    inStock: initialData?.inStock ?? true,
    stockCount: initialData?.stockCount || 10,
    isFeatured: initialData?.isFeatured ?? false,
    isBestSeller: initialData?.isBestSeller ?? false,
    isNew: initialData?.isNew ?? true,
    images: initialData?.images || ["/product-teal.png"],
    colours: initialData?.colours || [
      { name: "Teal", hex: "#1a7a7a" },
      { name: "Rose", hex: "#d4829e" },
    ],
    sizes: initialData?.sizes || [],
    occasion: initialData?.occasion || ["Festive", "Wedding"],
  });

  const [urlInput, setUrlInput] = useState("");

  // ─── Image Upload & Validation Handlers ─────────────────────────────────────

  const processFiles = async (files: FileList | File[]) => {
    setImageError(null);
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    const newImageUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const validation = validateImageFile(file);

      if (!validation.valid) {
        setImageError(validation.error || "Invalid file selected.");
        setUploadingImage(false);
        return;
      }

      try {
        const result = await uploadProductImage(file, initialData?.id);
        newImageUrls.push(result.path);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to process image.";
        setImageError(msg);
        setUploadingImage(false);
        return;
      }
    }

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImageUrls],
    }));
    setUploadingImage(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleAddUrlImage = () => {
    setImageError(null);
    if (!urlInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, urlInput.trim()],
    }));
    setUrlInput("");
  };

  const handleRemoveImage = async (index: number) => {
    const target = formData.images[index];
    await deleteProductImage(target);

    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const moveImageLeft = (index: number) => {
    if (index <= 0) return;
    setFormData((prev) => {
      const updated = [...prev.images];
      const temp = updated[index - 1];
      updated[index - 1] = updated[index];
      updated[index] = temp;
      return { ...prev, images: updated };
    });
  };

  const moveImageRight = (index: number) => {
    if (index >= formData.images.length - 1) return;
    setFormData((prev) => {
      const updated = [...prev.images];
      const temp = updated[index + 1];
      updated[index + 1] = updated[index];
      updated[index] = temp;
      return { ...prev, images: updated };
    });
  };

  // ─── Colour Handlers ────────────────────────────────────────────────────────

  const handleAddColour = () => {
    setFormData((prev) => ({
      ...prev,
      colours: [...prev.colours, { name: "Gold", hex: "#c9a96e" }],
    }));
  };

  const handleRemoveColour = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      colours: prev.colours.filter((_, i) => i !== index),
    }));
  };

  const handleUpdateColour = (index: number, key: "name" | "hex", value: string) => {
    setFormData((prev) => {
      const updated = [...prev.colours];
      updated[index] = { ...updated[index], [key]: value };
      return { ...prev, colours: updated };
    });
  };

  const toggleSize = (size: string) => {
    setFormData((prev) => {
      const exists = prev.sizes.includes(size);
      const updated = exists
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes: updated };
    });
  };

  const toggleOccasion = (occ: string) => {
    setFormData((prev) => {
      const exists = prev.occasion.includes(occ);
      const updated = exists
        ? prev.occasion.filter((item) => item !== occ)
        : [...prev.occasion, occ];
      return { ...prev, occasion: updated };
    });
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
        currency: "AED",
        rating: initialData?.rating || 4.8,
        reviewCount: initialData?.reviewCount || 10,
        sizes: formData.sizes,
        createdAt: initialData?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
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
    <form onSubmit={handleSubmit} className="space-y-8 pb-16 max-w-5xl">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-6">
        <div>
          <Link
            href="/products"
            className="inline-flex items-center text-xs font-medium text-neutral-500 hover:text-neutral-900 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to products
          </Link>
          <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-neutral-900">
            {isEditing ? "Edit Product" : "Add Product"}
          </h1>
          <p className="text-sm text-neutral-500 mt-1 font-normal">
            {isEditing ? "Update existing product details." : "Create a new product listing."}
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || uploadingImage}
          className="bg-neutral-950 hover:bg-neutral-800 text-white font-medium px-8 py-3 rounded-xl shadow-sm text-sm transition-all flex items-center justify-center space-x-2 shrink-0 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin text-white" />
          ) : (
            <span>Publish</span>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      {/* SECTION 1: Basic Information */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 md:p-8 space-y-6 shadow-xs">
        <h2 className="font-serif text-xl font-bold text-neutral-900 border-b border-neutral-100 pb-3">
          Basic Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-medium text-neutral-700 uppercase tracking-wider mb-2">
              Product Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full bg-neutral-50/50 border border-neutral-200 rounded-xl px-4 py-3 text-neutral-900 focus:outline-none focus:border-amber-500 focus:bg-white text-sm transition-all"
              placeholder="e.g. Zara Embroidered Churidar Set"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 uppercase tracking-wider mb-2">
              URL Slug
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
              className="w-full bg-neutral-50/50 border border-neutral-200 rounded-xl px-4 py-3 text-neutral-900 focus:outline-none focus:border-amber-500 focus:bg-white text-sm font-mono transition-all"
              placeholder="zara-embroidered-churidar"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-medium text-neutral-700 uppercase tracking-wider mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
              className="w-full bg-neutral-50/50 border border-neutral-200 rounded-xl px-4 py-3 text-neutral-900 focus:outline-none focus:border-amber-500 focus:bg-white text-sm transition-all"
            >
              {AVAILABLE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-700 uppercase tracking-wider mb-2">
            Description *
          </label>
          <textarea
            rows={4}
            required
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            className="w-full bg-neutral-50/50 border border-neutral-200 rounded-xl px-4 py-3 text-neutral-900 focus:outline-none focus:border-amber-500 focus:bg-white text-sm transition-all"
            placeholder="Exquisite teal kameez with hand-embroidered neckline and paired churidar..."
          />
        </div>
      </div>

      {/* SECTION 2: Pricing */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 md:p-8 space-y-6 shadow-xs">
        <h2 className="font-serif text-xl font-bold text-neutral-900 border-b border-neutral-100 pb-3">
          Pricing
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-medium text-neutral-700 uppercase tracking-wider mb-2">
              Sale Price (AED) *
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.price || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, price: Number(e.target.value) }))}
              className="w-full bg-neutral-50/50 border border-neutral-200 rounded-xl px-4 py-3 text-neutral-900 focus:outline-none focus:border-amber-500 focus:bg-white text-sm font-mono transition-all"
              placeholder="189"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 uppercase tracking-wider mb-2">
              Original Price (AED)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.originalPrice || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, originalPrice: Number(e.target.value) }))}
              className="w-full bg-neutral-50/50 border border-neutral-200 rounded-xl px-4 py-3 text-neutral-900 focus:outline-none focus:border-amber-500 focus:bg-white text-sm font-mono transition-all"
              placeholder="249"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 uppercase tracking-wider mb-2">
              Stock Count
            </label>
            <input
              type="number"
              required
              value={formData.stockCount}
              onChange={(e) => setFormData((prev) => ({ ...prev, stockCount: Number(e.target.value) }))}
              className="w-full bg-neutral-50/50 border border-neutral-200 rounded-xl px-4 py-3 text-neutral-900 focus:outline-none focus:border-amber-500 focus:bg-white text-sm font-mono transition-all"
              placeholder="18"
            />
          </div>
        </div>

        <div className="pt-2">
          <label className="inline-flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.inStock}
              onChange={(e) => setFormData((prev) => ({ ...prev, inStock: e.target.checked }))}
              className="w-4 h-4 rounded border-neutral-300 text-amber-600 focus:ring-amber-500"
            />
            <span className="text-sm font-medium text-neutral-800">In Stock</span>
          </label>
        </div>
      </div>

      {/* SECTION 3: Product Images (Supabase-Ready Drag & Drop Upload System) */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 md:p-8 space-y-6 shadow-xs">
        <div className="border-b border-neutral-100 pb-3 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-bold text-neutral-900">
              Product Images
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Upload product photos. The first image will be used as the primary product image.
            </p>
          </div>
          <span className="text-[11px] font-mono text-neutral-400 bg-neutral-100 px-2.5 py-1 rounded-md">
            Supabase Storage Ready
          </span>
        </div>

        {/* Validation Error Banner */}
        {imageError && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{imageError}</span>
          </div>
        )}

        {/* Image Grid with PRIMARY badge & reordering controls */}
        {formData.images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {formData.images.map((img, idx) => {
              const isPrimary = idx === 0;
              const displayUrl = getProductImageUrl(img);

              return (
                <div
                  key={idx}
                  className={`relative group rounded-2xl overflow-hidden border transition-all ${
                    isPrimary
                      ? "border-amber-500 shadow-xs ring-2 ring-amber-500/20"
                      : "border-neutral-200/80 bg-neutral-50"
                  } aspect-square flex flex-col justify-between`}
                >
                  {/* Thumbnail Image */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={displayUrl}
                    alt={`Product view ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Primary Badge */}
                  {isPrimary && (
                    <span className="absolute top-2.5 left-2.5 bg-amber-500 text-white font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
                      Primary
                    </span>
                  )}

                  {/* Top-Right Delete Action */}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-2.5 right-2.5 p-1.5 bg-neutral-900/80 hover:bg-rose-600 text-white rounded-full opacity-90 transition-all shadow-xs"
                    title="Remove image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Bottom Reordering Bar */}
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-neutral-900/70 backdrop-blur-xs rounded-xl p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveImageLeft(idx)}
                      className="p-1 text-white hover:text-amber-400 disabled:opacity-30 disabled:hover:text-white"
                      title="Move left"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-[10px] text-white/80 font-mono">
                      {idx + 1} / {formData.images.length}
                    </span>
                    <button
                      type="button"
                      disabled={idx === formData.images.length - 1}
                      onClick={() => moveImageRight(idx)}
                      className="p-1 text-white hover:text-amber-400 disabled:opacity-30 disabled:hover:text-white"
                      title="Move right"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Drag & Drop Upload Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? "border-amber-500 bg-amber-50/50"
              : "border-neutral-200 hover:border-amber-500/60 hover:bg-neutral-50/60"
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            accept="image/jpeg,image/jpg,image/png,image/webp"
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/60">
              {uploadingImage ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <UploadCloud className="w-6 h-6" />
              )}
            </div>
            <div>
              <span className="text-sm font-semibold text-neutral-900 block">
                + Upload Images
              </span>
              <span className="text-xs text-neutral-500 block mt-1">
                Drag & drop images or click to upload (JPG, PNG, WEBP — Max 5MB)
              </span>
            </div>
          </div>
        </div>

        {/* Optional Direct URL Input Accordion */}
        <div className="pt-2">
          <details className="text-xs text-neutral-500">
            <summary className="cursor-pointer font-medium hover:text-neutral-900 transition-colors">
              + Or add image via direct URL or /public path
            </summary>
            <div className="flex gap-3 mt-3">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="flex-1 bg-neutral-50/50 border border-neutral-200 rounded-xl px-4 py-2.5 text-neutral-900 focus:outline-none focus:border-amber-500 focus:bg-white text-sm transition-all"
                placeholder="Paste URL or path (e.g. /product-teal.png)"
              />
              <button
                type="button"
                onClick={handleAddUrlImage}
                className="bg-neutral-100 hover:bg-neutral-200 text-neutral-900 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shrink-0"
              >
                Add URL
              </button>
            </div>
          </details>
        </div>
      </div>

      {/* SECTION 4: Product Type */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 md:p-8 space-y-6 shadow-xs">
        <h2 className="font-serif text-xl font-bold text-neutral-900 border-b border-neutral-100 pb-3">
          Product Type
        </h2>

        <div className="flex items-center space-x-8">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="productType"
              value="bit-piece"
              checked={formData.productType === "bit-piece"}
              onChange={() => setFormData((prev) => ({ ...prev, productType: "bit-piece" }))}
              className="w-4 h-4 text-amber-600 border-neutral-300 focus:ring-amber-500"
            />
            <span className="text-sm font-medium text-neutral-900">Bit Piece</span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="productType"
              value="ready-made"
              checked={formData.productType === "ready-made"}
              onChange={() => setFormData((prev) => ({ ...prev, productType: "ready-made" }))}
              className="w-4 h-4 text-amber-600 border-neutral-300 focus:ring-amber-500"
            />
            <span className="text-sm font-medium text-neutral-900">Ready-Made</span>
          </label>
        </div>
      </div>

      {/* SECTION 5: Size Description (Bit Piece) */}
      {formData.productType === "bit-piece" && (
        <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 md:p-8 space-y-6 shadow-xs">
          <div>
            <h2 className="font-serif text-xl font-bold text-neutral-900">
              Size Description (Bit Piece)
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Enter the fabric measurements for Shirt, Bottom & Dupatta. These are shown read-only on the product page.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
            <div>
              <label className="block text-xs font-medium text-neutral-700 uppercase tracking-wider mb-2">
                Shirt
              </label>
              <input
                type="text"
                value={formData.sizeDetails.shirt}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    sizeDetails: { ...prev.sizeDetails, shirt: e.target.value },
                  }))
                }
                className="w-full bg-neutral-50/50 border border-neutral-200 rounded-xl px-4 py-3 text-neutral-900 focus:outline-none focus:border-amber-500 focus:bg-white text-sm transition-all"
                placeholder="2.5 m"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 uppercase tracking-wider mb-2">
                Bottom
              </label>
              <input
                type="text"
                value={formData.sizeDetails.bottom}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    sizeDetails: { ...prev.sizeDetails, bottom: e.target.value },
                  }))
                }
                className="w-full bg-neutral-50/50 border border-neutral-200 rounded-xl px-4 py-3 text-neutral-900 focus:outline-none focus:border-amber-500 focus:bg-white text-sm transition-all"
                placeholder="2.5 m"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 uppercase tracking-wider mb-2">
                Dupatta
              </label>
              <input
                type="text"
                value={formData.sizeDetails.dupatta}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    sizeDetails: { ...prev.sizeDetails, dupatta: e.target.value },
                  }))
                }
                className="w-full bg-neutral-50/50 border border-neutral-200 rounded-xl px-4 py-3 text-neutral-900 focus:outline-none focus:border-amber-500 focus:bg-white text-sm transition-all"
                placeholder="2.25 m"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECTION: Sizes (Ready-Made) */}
      {formData.productType === "ready-made" && (
        <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 md:p-8 space-y-6 shadow-xs">
          <div className="border-b border-neutral-100 pb-3">
            <h2 className="font-serif text-xl font-bold text-neutral-900">
              Sizes
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Select available sizes for this ready-made product.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {AVAILABLE_SIZES.map((sz) => {
              const isSelected = formData.sizes.includes(sz);
              return (
                <button
                  type="button"
                  key={sz}
                  onClick={() => toggleSize(sz)}
                  className={`min-w-[54px] px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                    isSelected
                      ? "bg-neutral-950 text-white border-neutral-950 shadow-2xs"
                      : "bg-neutral-50/50 text-neutral-700 border-neutral-200 hover:bg-neutral-100 hover:border-neutral-300"
                  }`}
                >
                  {sz}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 6: Colours */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 md:p-8 space-y-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <h2 className="font-serif text-xl font-bold text-neutral-900">
            Colours
          </h2>
          <button
            type="button"
            onClick={handleAddColour}
            className="text-xs font-medium text-amber-700 hover:text-amber-800 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add colour</span>
          </button>
        </div>

        <div className="space-y-4">
          {formData.colours.map((col, idx) => (
            <div key={idx} className="flex items-center space-x-4">
              <input
                type="color"
                value={col.hex}
                onChange={(e) => handleUpdateColour(idx, "hex", e.target.value)}
                className="w-10 h-10 rounded-xl border border-neutral-200 cursor-pointer p-0.5 bg-neutral-50"
              />
              <input
                type="text"
                value={col.name}
                onChange={(e) => handleUpdateColour(idx, "name", e.target.value)}
                className="flex-1 bg-neutral-50/50 border border-neutral-200 rounded-xl px-4 py-2.5 text-neutral-900 focus:outline-none focus:border-amber-500 focus:bg-white text-sm transition-all"
                placeholder="Colour name (e.g. Teal)"
              />
              <button
                type="button"
                onClick={() => handleRemoveColour(idx)}
                className="p-2 text-neutral-400 hover:text-rose-600 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 7: Product Details */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 md:p-8 space-y-6 shadow-xs">
        <h2 className="font-serif text-xl font-bold text-neutral-900 border-b border-neutral-100 pb-3">
          Product Details
        </h2>

        <div>
          <label className="block text-xs font-medium text-neutral-700 uppercase tracking-wider mb-2">
            Fabric
          </label>
          <select
            value={formData.fabric}
            onChange={(e) => setFormData((prev) => ({ ...prev, fabric: e.target.value }))}
            className="w-full bg-neutral-50/50 border border-neutral-200 rounded-xl px-4 py-3 text-neutral-900 focus:outline-none focus:border-amber-500 focus:bg-white text-sm transition-all"
          >
            {AVAILABLE_FABRICS.map((fab) => (
              <option key={fab} value={fab}>
                {fab}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-700 uppercase tracking-wider mb-3">
            Occasions
          </label>
          <div className="flex flex-wrap gap-2.5">
            {AVAILABLE_OCCASIONS.map((occ) => {
              const isSelected = formData.occasion.includes(occ);
              return (
                <button
                  type="button"
                  key={occ}
                  onClick={() => toggleOccasion(occ)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all ${
                    isSelected
                      ? "bg-amber-500 text-white border-amber-600 shadow-2xs"
                      : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100"
                  }`}
                >
                  {occ}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION 8: Visibility Flags */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 md:p-8 space-y-6 shadow-xs">
        <h2 className="font-serif text-xl font-bold text-neutral-900 border-b border-neutral-100 pb-3">
          Visibility Flags
        </h2>

        <div className="flex flex-wrap gap-8">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isNew}
              onChange={(e) => setFormData((prev) => ({ ...prev, isNew: e.target.checked }))}
              className="w-4 h-4 rounded border-neutral-300 text-amber-600 focus:ring-amber-500"
            />
            <span className="text-sm font-medium text-neutral-800">New</span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isBestSeller}
              onChange={(e) => setFormData((prev) => ({ ...prev, isBestSeller: e.target.checked }))}
              className="w-4 h-4 rounded border-neutral-300 text-amber-600 focus:ring-amber-500"
            />
            <span className="text-sm font-medium text-neutral-800">Best Seller</span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isFeatured}
              onChange={(e) => setFormData((prev) => ({ ...prev, isFeatured: e.target.checked }))}
              className="w-4 h-4 rounded border-neutral-300 text-amber-600 focus:ring-amber-500"
            />
            <span className="text-sm font-medium text-neutral-800">Featured</span>
          </label>
        </div>
      </div>
    </form>
  );
}
