"use client";
import { SearchFiltersProps } from "@/interfaces/components/search.interface";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

interface ClearFiltersButtonProps {
    currentFilters: SearchFiltersProps['currentFilters'];
}

const ClearFiltersButton: React.FC<ClearFiltersButtonProps> = ({
    currentFilters,
}) => {
    const pathname = usePathname();
    const router = useRouter();

    const clearAllFilters = () => {
        const params = new URLSearchParams();
        // Mantener solo la query de búsqueda si existe
        if (currentFilters.query) {
            params.set("q", currentFilters.query);
        }
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <button
            onClick={clearAllFilters}
            className="text-sm text-primary hover:text-primary/80"
        >
            Limpiar filtros
        </button>
    );
};

export default ClearFiltersButton;
