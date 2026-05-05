"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { formatPrice, formatPriceUSD } from "@/lib/utils";
import { siteConfig } from "@/lib/site.config";

type Category = { id: string; name: string };

type ProductFormProps = {
  categories: Category[];
  initialData?: {
    id?: string;
    name: string;
    description: string;
    price: string;
    images: string[];
    featured: boolean;
    stock: string;
    active: boolean;
    categoryId: string;
  };
};

const defaultData = {
  name: "",
  description: "",
  price: "",
  images: [] as string[],
  featured: false,
  stock: "0",
  active: true,
  categoryId: "",
};

export default function ProductForm({ categories, initialData }: ProductFormProps) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState(initialData || defaultData);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function update(field: string, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      setError("Configuración de Cloudinary incompleta. Verifica NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME y NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET");
      return;
    }

    setUploading(true);
    setError("");
    try {
      const uploaded: string[] = [];
      for (const file of files) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("upload_preset", uploadPreset);
        fd.append("folder", "majestic-luxe-jewels");

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          { method: "POST", body: fd }
        );

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error?.message || "Error al subir imagen");
        }

        const data = await res.json();
        uploaded.push(data.secure_url);
      }
      update("images", [...form.images, ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir imágenes");
    } finally {
      setUploading(false);
    }
  }

  function removeImage(index: number) {
    update("images", form.images.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const isEdit = !!initialData?.id;
    const url = isEdit ? `/api/productos/${initialData!.id}` : "/api/productos";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          stock: parseInt(form.stock),
          categoryId: form.categoryId || null,
        }),
      });

      if (res.ok) {
        router.push("/admin/productos");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Error al guardar");
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Nombre */}
          <div className="bg-white border border-gray-100 p-6">
            <label className="text-xs tracking-[0.1em] uppercase text-gray-500 block mb-2">
              Nombre del producto *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              required
              className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#b8964a] transition-colors"
              placeholder="Ej: Anillo de diamantes Princess Cut"
            />
          </div>

          {/* Descripción */}
          <div className="bg-white border border-gray-100 p-6">
            <label className="text-xs tracking-[0.1em] uppercase text-gray-500 block mb-2">
              Descripción
            </label>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={5}
              className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#b8964a] transition-colors resize-none"
              placeholder="Describe la joya: materiales, acabado, detalles especiales..."
            />
          </div>

          {/* Imágenes */}
          <div className="bg-white border border-gray-100 p-6">
            <label className="text-xs tracking-[0.1em] uppercase text-gray-500 block mb-4">
              Imágenes
            </label>

            {/* Grid de imágenes */}
            {form.images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
                {form.images.map((img, i) => (
                  <div key={i} className="relative aspect-square bg-gray-50 group">
                    <Image
                      src={img}
                      alt={`Imagen ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="150px"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-1 left-1 bg-[#b8964a] text-white text-[9px] px-1 py-0.5 uppercase tracking-wide">
                        Principal
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            <input
              ref={fileRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 border-2 border-dashed border-gray-200 text-gray-500 hover:border-[#b8964a] hover:text-[#b8964a] transition-colors px-6 py-4 text-sm w-full justify-center disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Subiendo...
                </>
              ) : (
                <>
                  <Upload size={16} /> Subir imágenes
                </>
              )}
            </button>
          </div>
        </div>

        {/* Sidebar derecha */}
        <div className="space-y-5">
          {/* Precio y stock */}
          <div className="bg-white border border-gray-100 p-6 space-y-5">
            <div>
              <label className="text-xs tracking-[0.1em] uppercase text-gray-500 block mb-2">
                Precio * <span className="text-[#b8964a]">(COP)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.price}
                  onChange={(e) => update("price", e.target.value)}
                  required
                  className="w-full border border-gray-200 pl-7 pr-4 py-3 text-sm focus:outline-none focus:border-[#b8964a] transition-colors"
                  placeholder="225000"
                />
              </div>
              {/* Preview formateado */}
              {form.price && Number(form.price) > 0 && (
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#b8964a]">
                    {formatPrice(Number(form.price))}
                  </span>
                  <span className="text-gray-400">
                    ≈ {formatPriceUSD(Number(form.price), siteConfig.copToUsdRate)} USD
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs tracking-[0.1em] uppercase text-gray-500 block mb-2">
                Stock
              </label>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => update("stock", e.target.value)}
                className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#b8964a] transition-colors"
              />
            </div>
          </div>

          {/* Categoría */}
          <div className="bg-white border border-gray-100 p-6">
            <label className="text-xs tracking-[0.1em] uppercase text-gray-500 block mb-2">
              Categoría
            </label>
            <select
              value={form.categoryId}
              onChange={(e) => update("categoryId", e.target.value)}
              className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#b8964a] transition-colors bg-white"
            >
              <option value="">Sin categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Opciones */}
          <div className="bg-white border border-gray-100 p-6 space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => update("featured", e.target.checked)}
                className="w-4 h-4 accent-[#b8964a]"
              />
              <div>
                <p className="text-sm text-gray-700 font-medium">Destacado</p>
                <p className="text-xs text-gray-400">Aparece en la página principal</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => update("active", e.target.checked)}
                className="w-4 h-4 accent-[#b8964a]"
              />
              <div>
                <p className="text-sm text-gray-700 font-medium">Activo</p>
                <p className="text-xs text-gray-400">Visible en el catálogo</p>
              </div>
            </label>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={saving || uploading}
            className="w-full bg-[#b8964a] text-white py-4 text-sm tracking-widest uppercase hover:bg-[#8a6e35] transition-colors disabled:opacity-60"
          >
            {saving ? "Guardando..." : initialData?.id ? "Actualizar producto" : "Crear producto"}
          </button>
        </div>
      </div>
    </form>
  );
}
