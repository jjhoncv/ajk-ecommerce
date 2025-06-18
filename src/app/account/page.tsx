import categoryModel from "@/backend/category";
import customerModel from "@/backend/customer";
import AccountHome from "@/components/account/AccountHome";
import AccountLayout from "@/components/account/AccountLayout";
import Header from "@/components/layout/Header";
import Layout from "@/components/layout/Layout";
import { LayoutContent } from "@/components/layout/LayoutContent";
import Navigation from "@/components/ui/Navigation";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AccountPage() {
  // Obtener la sesión del usuario
  const session = await getServerSession(authOptions);

  // Si no hay sesión, redirigir al inicio
  // Esto es una doble verificación, ya que el middleware debería manejar esto
  if (!session) {
    redirect("/");
  }

  // Obtener datos para el header y footer
  const categories = await categoryModel.getCategories()
  const customer = await customerModel.getCustomer(Number(session.user.id))

  if (!customer) {
    return
  }


  return (
    <Layout>
      <Header navigationType="mini" >
        <Navigation type="mini" categories={categories || []} />
      </Header>
      <LayoutContent className="p-0">
        <AccountLayout userName={session.user?.name || ""}>
          <AccountHome />
        </AccountLayout>
      </LayoutContent>
    </Layout>
  );
}