export interface FileServer {
  createdAt: string;
  extension?: string;
  modifiedAt: string;
  name: string;
  path: string;
  size: number;
  type: "file" | "directory";
}

export interface FieldRequired {
  min?: string;
  url?: string;
}

export interface FieldBasic {
  key: string;
  label?: string;
  value?: any;
  required?: FieldRequired | boolean;
}

export interface FileOptions {
  acceptImageTypes: string[] | undefined;
  maxFileSize: number | undefined;
  dimensions?:
    | {
        min: { width: number; height: number };
        max: { width: number; height: number };
      }
    | undefined;
  subdirectory?: string; // Para organizar archivos en carpetas (ej: SKU)
}

export interface SelectOption {
  value: string
  label: string
}

export type FieldType = "primary" | "text" | "textarea" | "file" | "select" | "checkbox-group";

export interface CheckboxItem {
  id: string
  name: string
}

export interface Field extends FieldBasic {
  type: FieldType;
  multiple?: boolean;
  options?: FileOptions;
  selectOptions?: SelectOption[];
  checkboxItems?: CheckboxItem[];
  placeholder?: string;
}

export interface ServerFilesProps {
  onAddFiles: () => void;
  setOpenDialog: (value: boolean) => void;
  addFilesToForm: (files: FileServer[]) => void;
  field: Field;
}
