"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TagFields } from "@/module/tags/components/admin";

export default function NewTagPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
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
      const response = await fetch("/api/admin/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al crear");
      }

      router.push("/admin/tags");
    } catch (error) {
      setErrors({ general: error instanceof Error ? error.message : "Error al crear el tag" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Nuevo Tag</h1>
      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <form onSubmit={handleSubmit}>
          {TagFields.map((field) => (
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                />
              ) : field.type === "switch" ? (
                <input
                  type="checkbox"
                  name={field.name}
                  defaultChecked={field.defaultValue as boolean}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
              ) : field.type === "color" ? (
                <input
                  type="color"
                  name={field.name}
                  defaultValue={field.defaultValue as string}
                  className="h-10 w-20 border border-gray-300 rounded-md cursor-pointer"
                />
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  required={field.required}
                  defaultValue={field.defaultValue as string | number}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              )}
              {field.helperText && (
                <p className="mt-1 text-sm text-gray-500">{field.helperText}</p>
              )}
            </div>
          ))}
          {errors.general && (
            <p className="mb-4 text-sm text-red-500 error-message" data-error>
              {errors.general}
            </p>
          )}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? "Guardando..." : "Guardar"}
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
