"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Pencil, Check, X } from "lucide-react";

type Category = {
  id: string;
  name: string;
  slug: string;
  _count: { products: number };
};

export default function CategoriesManager({
  initialCategories,
}: {
  initialCategories: Category[];
}) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  async function handleAdd() {
    if (!newName.trim()) return;
    setAdding(true);
    const res = await fetch("/api/categorias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    });
    if (res.ok) {
      const cat = await res.json();
      setCategories((prev) => [...prev, { ...cat, _count: { products: 0 } }]);
      setNewName("");
    }
    setAdding(false);
  }

  async function handleEdit(id: string) {
    if (!editName.trim()) return;
    const res = await fetch(`/api/categorias/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName }),
    });
    if (res.ok) {
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, name: editName } : c))
      );
      setEditingId(null);
    }
  }

  async function handleDelete(id: string, name: string) {
    const cat = categories.find((c) => c.id === id);
    if (cat && cat._count.products > 0) {
      alert(`No puedes eliminar "${name}" porque tiene ${cat._count.products} producto(s).`);
      return;
    }
    if (!confirm(`¿Eliminar la categoría "${name}"?`)) return;
    await fetch(`/api/categorias/${id}`, { method: "DELETE" });
    setCategories((prev) => prev.filter((c) => c.id !== id));
    router.refresh();
  }

  return (
    <div className="max-w-xl">
      {/* Agregar nueva */}
      <div className="bg-white border border-gray-100 p-6 mb-6">
        <label className="text-xs tracking-[0.1em] uppercase text-gray-500 block mb-3">
          Nueva categoría
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Ej: Anillos, Collares, Pulseras..."
            className="flex-1 border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#b8964a] transition-colors"
          />
          <button
            onClick={handleAdd}
            disabled={adding || !newName.trim()}
            className="flex items-center gap-2 bg-[#b8964a] text-white px-5 py-3 text-sm hover:bg-[#8a6e35] transition-colors disabled:opacity-50"
          >
            <Plus size={16} />
            {adding ? "..." : "Agregar"}
          </button>
        </div>
      </div>

      {/* Lista */}
      <div className="bg-white border border-gray-100 overflow-hidden">
        {categories.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-400">
            No hay categorías. Agrega la primera arriba.
          </div>
        ) : (
          <ul>
            {categories.map((cat, i) => (
              <li
                key={cat.id}
                className={`flex items-center gap-4 px-6 py-4 ${
                  i < categories.length - 1 ? "border-b border-gray-50" : ""
                }`}
              >
                {editingId === cat.id ? (
                  <div className="flex-1 flex items-center gap-3">
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleEdit(cat.id);
                        if (e.key === "Escape") setEditingId(null);
                      }}
                      autoFocus
                      className="flex-1 border border-[#b8964a] px-3 py-2 text-sm focus:outline-none"
                    />
                    <button onClick={() => handleEdit(cat.id)} className="text-green-500 hover:text-green-700">
                      <Check size={16} />
                    </button>
                    <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-600">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{cat.name}</p>
                      <p className="text-xs text-gray-400">{cat._count.products} producto(s)</p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingId(cat.id);
                        setEditName(cat.name);
                      }}
                      className="text-gray-400 hover:text-[#b8964a] transition-colors"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id, cat.name)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
