export interface FieldConfig {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "switch" | "color";
  required: boolean;
  placeholder?: string;
  helperText?: string;
  defaultValue?: string | number | boolean;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}

export const TagFields: FieldConfig[] = [
  {
    name: "name",
    label: "Nombre",
    type: "text",
    required: true,
    placeholder: "Ej: Oferta, Nuevo, Destacado",
    validation: {
      minLength: 2,
      maxLength: 100,
    },
  },
  {
    name: "slug",
    label: "Slug",
    type: "text",
    required: true,
    placeholder: "ej: oferta-especial",
    helperText: "URL amigable (sin espacios, minúsculas, guiones)",
    validation: {
      pattern: "^[a-z0-9-]+$",
    },
  },
  {
    name: "description",
    label: "Descripción",
    type: "textarea",
    required: false,
    placeholder: "Descripción opcional del tag",
  },
  {
    name: "color",
    label: "Color",
    type: "color",
    required: false,
    defaultValue: "#3B82F6",
    helperText: "Color para mostrar el badge del tag",
  },
  {
    name: "isActive",
    label: "Activo",
    type: "switch",
    required: false,
    defaultValue: true,
  },
  {
    name: "position",
    label: "Posición",
    type: "number",
    required: false,
    defaultValue: 0,
    helperText: "Orden de aparición (menor = primero)",
  },
];
