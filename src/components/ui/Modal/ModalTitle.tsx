import { X } from "lucide-react";
import { FC } from "react";

interface ModalTitleProps {
  onClose: () => void;
  title: string;
}

export const ModalTitle: FC<ModalTitleProps> = ({ onClose, title }) => {
  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{title}</h2>
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