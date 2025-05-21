import { NextRequest, NextResponse } from "next/server";
import { CustomerService } from "@/services/customerService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, name, lastname, email, password } = body;

    // Validaciones básicas
    if (!username || !name || !lastname || !email || !password) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 }
      );
    }

    // Usar el servicio de cliente para registrar
    const customerService = new CustomerService();

    try {
      const newCustomer = await customerService.register({
        username,
        name,
        lastname,
        email,
        password,
      });

      // Retornar el cliente creado (sin la contraseña)
      return NextResponse.json(newCustomer, { status: 201 });
    } catch (error) {
      if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 409 });
      }
      throw error;
    }
  } catch (error) {
    console.error("Error al registrar cliente:", error);
    return NextResponse.json(
      { error: "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}
