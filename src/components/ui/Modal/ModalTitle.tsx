import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { FC, ReactNode } from "react";

interface ModalTitleProps {
  onClose: () => void;
  title?: string;
  className?: string;
  children?: ReactNode
}

export const ModalTitle: FC<ModalTitleProps> = ({ onClose, title, className, children }) => {
  return (
    <div className={cn("p-4 border-b border-gray-200", className)}>
      <div className="flex justify-between items-center">
        {children ? children : <h2 className="text-xl font-bold">{title}</h2>}
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};