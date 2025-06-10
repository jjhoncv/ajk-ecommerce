"use client";
import { LayoutGrid, List } from "lucide-react";
import React from "react";

interface ViewModeSelectorProps {
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}

const ViewModeSelector: React.FC<ViewModeSelectorProps> = ({
  viewMode,
  onViewModeChange,
}) => {
  return (
    <div className="flex items-center border rounded-lg overflow-hidden">
      <button
        onClick={() => onViewModeChange("grid")}
        className={`px-3 py-2 flex items-center ${viewMode === "grid"
          ? "bg-primary text-white"
          : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        aria-label="Ver como cuadrícula"
      >
        <LayoutGrid className="h-4 w-4 mr-1" />
        <span className="text-sm">Cuadrícula</span>
      </button>
      <button
        onClick={() => onViewModeChange("list")}
        className={`px-3 py-2 flex items-center ${viewMode === "list"
          ? "bg-primary text-white"
          : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        aria-label="Ver como lista"
      >
        <List className="h-4 w-4 mr-1" />
        <span className="text-sm">Lista</span>
      </button>
    </div>
  );
};

export default ViewModeSelector;
