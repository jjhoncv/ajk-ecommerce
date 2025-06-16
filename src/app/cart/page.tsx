import { CartPageInteractive } from "@/components/cart/CartPageInteractive";
import Layout from "@/components/layout/Layout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Carrito de Compras | TechStore",
  description: "Revisa y gestiona los productos en tu carrito de compras",
};

export default function CartPage() {
  return (
    <Layout>
      <CartPageInteractive />
    </Layout>
  );
}