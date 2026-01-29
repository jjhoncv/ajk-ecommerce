"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TagFields } from "@/module/tags/components/admin";

interface Tag {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  isActive: boolean;
  position: number;
}

export default function EditTagPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [item, setItem] = useState<Tag | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch(`/api/admin/tags/${params.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setItem(data);
        setLoading(false);
      })
      .catch(() => {
        router.push("/admin/tags");
      });
  }, [params.id, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const data: Record<string, unknown> = {};

    TagFields.forEach((field) => {
      const value = formData.get(field.name);
      if (field.type === "switch") {
        data[field.name] = value === "on";
      } else if (field.type === "number") {
        data[field.name] = value ? parseInt(value as string) : 0;
      } else {
        data[field.name] = value || null;
      }
    });

    try {
      const response = await fetch(`/api/admin/tags/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al actualizar");
      }

      router.push("/admin/tags");
    } catch (error) {
      setErrors({ general: error instanceof Error ? error.message : "Error al actualizar" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto py-6">Cargando...</div>;
  }

  if (!item) {
    return <div className="container mx-auto py-6">No encontrado</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Editar Tag</h1>
      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <form onSubmit={handleSubmit}>
          {TagFields.map((field) => {
            const fieldValue = (item as Record<string, unknown>)[field.name];
            return (
              <div key={field.name} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    placeholder={field.placeholder}
                    required={field.required}
                    defaultValue={(fieldValue as string) || ""}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={3}
                  />
                ) : field.type === "switch" ? (
                  <input
                    type="checkbox"
                    name={field.name}
                    defaultChecked={fieldValue as boolean}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                ) : field.type === "color" ? (
                  <input
                    type="color"
                    name={field.name}
                    defaultValue={(fieldValue as string) || "#3B82F6"}
                    className="h-10 w-20 border border-gray-300 rounded-md cursor-pointer"
                  />
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    required={field.required}
                    defaultValue={(fieldValue as string | number) || ""}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                )}
                {field.helperText && (
                  <p className="mt-1 text-sm text-gray-500">{field.helperText}</p>
                )}
              </div>
            );
          })}
          {errors.general && (
            <p className="mb-4 text-sm text-red-500">{errors.general}</p>
          )}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
            >
              {saving ? "Guardando..." : "Guardar"}
            </button>
            <Link
              href="/admin/tags"
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
