"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Customers } from "@/types/domain";
import { CreditCard, Mail, Phone, Save, User } from "lucide-react";
import { useEditProfile } from "./use-edit-profile.hook";

interface EditProfileProps {
  customer: Customers;
}

export default function EditProfile({ customer }: EditProfileProps) {
  const {
    formData,
    errors,
    isLoading,
    message,
    handleSubmit,
    handleInputChange,
    hasChanges,
    resetForm
  } = useEditProfile({ customer });

  return (
    <div>
      <div className="flex items-center gap-2 mb-8">
        <User className="h-5 w-5" />
        <h2 className="text-xl font-bold">Datos personales</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
        {/* Nombre y Apellido */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              className={`${errors.name ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"} focus:ring-2`}
              placeholder="Ingresa tu nombre"
            />
            {errors.name && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastname">Apellido</Label>
            <Input
              id="lastname"
              name="lastname"
              type="text"
              value={formData.lastname}
              onChange={handleInputChange}
              className={`${errors.lastname ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"} focus:ring-2`}
              placeholder="Ingresa tu apellido"
            />
            {errors.lastname && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                {errors.lastname}
              </p>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`${errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"} focus:ring-2`}
            placeholder="correo@ejemplo.com"
          />
          {errors.email && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <span className="w-1 h-1 bg-red-600 rounded-full"></span>
              {errors.email}
            </p>
          )}
        </div>

        {/* Teléfono y DNI */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Celular
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              className={`${errors.phone ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"} focus:ring-2`}
              placeholder="987654321"
              maxLength={9}
            />
            {errors.phone && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                {errors.phone}
              </p>
            )}
            <p className="text-xs text-gray-500">9 dígitos, debe empezar con 9</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dni" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              DNI
            </Label>
            <Input
              id="dni"
              name="dni"
              type="text"
              value={formData.dni}
              onChange={handleInputChange}
              className={`${errors.dni ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"} focus:ring-2`}
              placeholder="12345678"
              maxLength={8}
            />
            {errors.dni && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                {errors.dni}
              </p>
            )}
            <p className="text-xs text-gray-500">8 dígitos exactos</p>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-4 rounded-lg ${message.includes("Error") || message.includes("error")
            ? "bg-red-50 text-red-700 border border-red-200"
            : message.includes("No hay cambios")
              ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
              : "bg-green-50 text-green-700 border border-green-200"
            }`}>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${message.includes("Error") || message.includes("error")
                ? "bg-red-600"
                : message.includes("No hay cambios")
                  ? "bg-yellow-600"
                  : "bg-green-600"
                }`}></div>
              {message}
            </div>
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={isLoading || !hasChanges()}
            className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Guardando...
              </div>
            ) : (
              "Guardar Cambios"
            )}
          </Button>

          {hasChanges() && (
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              disabled={isLoading}
              className="px-6 py-3 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}