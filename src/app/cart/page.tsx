import categoryModel from "@/backend/category";
import { CartPageInteractive } from "@/components/cart/CartPageInteractive";
import Header from "@/components/layout/Header";
import Layout from "@/components/layout/Layout";
import { LayoutContent } from "@/components/layout/LayoutContent";
import Navigation from "@/components/ui/Navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Carrito de Compras | TechStore",
  description: "Revisa y gestiona los productos en tu carrito de compras",
};

const categories = await categoryModel.getCategories()

export default function CartPage() {
  return (
    <Layout>
      <Header navigationType="mini" >
        <Navigation type="mini" categories={categories || []} />
      </Header>
      <LayoutContent>
        <CartPageInteractive />
      </LayoutContent>
    </Layout>
  );
}