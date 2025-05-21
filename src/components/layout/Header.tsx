import React from "react";
import { MapPin, Heart } from "lucide-react";
import CartButton from "../ui/CartButton";
// import dynamic from "next/dynamic";

// // Importar AuthButton como un componente de cliente sin SSR
// const ClientAuthButton = dynamic(() => import("../ui/AuthButton"), {
//   ssr: false,
// });
import Logo from "../ui/Logo";
import SearchBar from "../ui/SearchBar";
import Navigation from "../ui/Navigation";
import type { MegaMenuCategories } from "@/types/navigation";
import AuthButton from "../ui/AuthButton";

interface HeaderProps {
  megaMenuCategories: MegaMenuCategories;
}

const Header = async ({ megaMenuCategories }: HeaderProps) => {
  // Aquí podrías hacer fetch de datos adicionales si fuera necesario
  // const additionalData = await fetchAdditionalData();

  return (
    <header className="border-b border-gray-200 sticky top-0 bg-white z-50 border-none">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Logo />

          {/* Location */}
          <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
            <MapPin className="h-5 w-5 text-gray-600" />
            <div>
              <div className="text-xs text-gray-600">Entregar en</div>
              <div className="font-semibold">Los Olivos</div>
            </div>
          </div>

          {/* Search */}
          <SearchBar />

          {/* Actions */}
          <div className="flex items-center gap-6">
            <button className="flex flex-col items-center">
              <Heart className="h-6 w-6" />
              <span className="text-xs mt-1">Wishlist</span>
            </button>
            <CartButton />
            <AuthButton />
          </div>
        </div>
      </div>

      <Navigation categories={megaMenuCategories} />
    </header>
  );
};

export default Header;
