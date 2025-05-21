import { getServerSession } from "next-auth";
import ClientAuthButton from "./ClientAuthButton";

export default async function ServerAuthButton() {
  // Obtener la sesión del usuario desde el servidor
  const session = await getServerSession();

  // Determinar si el usuario está autenticado
  const isAuthenticated = !!session;

  // Pasar la información al componente de cliente
  return (
    <ClientAuthButton
      isAuthenticated={isAuthenticated}
      userName={session?.user?.name || ""}
      userEmail={session?.user?.email || ""}
      userId={session?.user?.id || ""}
    />
  );
}
