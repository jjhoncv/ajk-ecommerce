import { Heart } from "lucide-react";
import { ReactNode } from "react";
import CartButton from "../ui/CartButton";
import Logo from "../ui/Logo";
import SearchBar from "../ui/SearchBar";
import ServerAuthButton from "../ui/ServerAuthButton";

interface HeaderProps {
  children?: ReactNode
  navigationType?: "mini" | "normal"
}

const Header = async ({ children, navigationType = "normal" }: HeaderProps) => {
  return (
    <header className="border-b border-gray-200 sticky top-0 bg-white z-50 border-none">
      <div className="max-w-screen-4xl mx-auto px-12 py-4">
        <div className="flex items-center justify-between gap-6">
          <Logo />
          {navigationType === "mini" && children}

          {/* Search */}
          <SearchBar />

          {/* Actions */}
          <div className="flex items-center gap-6">
            <button className="flex flex-col items-center">
              <Heart className="h-6 w-6" />
              <span className="text-xs mt-1">Wishlist</span>
            </button>
            <CartButton />
            <ServerAuthButton />
          </div>
        </div>
      </div>
      {navigationType === "normal" && children}

      {/* <Navigation categories={categories} /> */}
    </header>
  );
};

export default Header;
