/**
 * Autenticar un cliente con email y contraseña
 */
// export async function loginCustomer(
//   email: string,
//   plainPassword: string
// ): Promise<Customer | null> {
//   try {
//     // Obtener el cliente por email
//     const customer = await customerModel.getCustomerByEmail(email)

//     // Si no existe el cliente, retornar null
//     if (!customer) return null

//     // Verificar la contraseña con bcrypt
//     const isPasswordValid = await bcrypt.compare(
//       plainPassword,
//       customer.password
//     )
//     if (!isPasswordValid) return null

//     // Obtener el cliente completo con sus roles
//     const validCustomer = await customerModel.getCustomer(customer.id)
//     if (!validCustomer) return null

//     // No devolver la contraseña
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const { password, ...customerWithoutPassword } = validCustomer

//     return customerWithoutPassword as Customer
//   } catch (error) {
//     console.error('Error en login:', error)
//     return null
//   }
// }

/**
 * Registrar un nuevo cliente
 */
// export async function registerCustomer(customerData: {
//   username: string
//   email: string
//   password: string
//   name: string
//   lastname: string
//   address_id?: number
// }): Promise<Customer | null> {
//   try {
//     // Verificar si ya existe un cliente con ese email
//     const existingCustomer = await customerModel.getCustomerByEmail(
//       customerData.email
//     )
//     if (existingCustomer) {
//       throw new Error('El correo electrónico ya está registrado')
//     }

//     // Encriptar la contraseña
//     const hashedPassword = await bcrypt.hash(customerData.password, 10)

//     // Crear el cliente con el rol por defecto si no se especifica
//     const newCustomer = await customerModel.createCustomer({
//       ...customerData,
//       password: hashedPassword
//     })

//     if (newCustomer === undefined) {
//       throw new Error('No se pudo crear a Cliente')
//     }

//     // No devolver la contraseña
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const { password, ...customerWithoutPassword } = newCustomer

//     return customerWithoutPassword as Customer
//   } catch (error) {
//     console.error('Error en register:', error)
//     throw error
//   }
// }

// /**
//  * Obtener un cliente por su ID
//  */
// export async function getCustomerById(id: number): Promise<Customer | null> {
//   try {
//     const customer = await customerModel.getCustomer(id)

//     if (!customer) return null

//     // No devolver la contraseña
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const { password, ...customerWithoutPassword } = customer

//     return customerWithoutPassword as Customer
//   } catch (error) {
//     console.error('Error en getCustomerById:', error)
//     return null
//   }
// }

// /**
//  * Obtener un cliente por su email
//  */
// export async function getCustomerByEmail(
//   email: string
// ): Promise<Customer | null> {
//   try {
//     const customer = await customerModel.getCustomerByEmail(email)

//     if (!customer) return null

//     // No devolver la contraseña
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const { password, ...customerWithoutPassword } = customer

//     return customerWithoutPassword as Customer
//   } catch (error) {
//     console.error('Error en getCustomerByEmail:', error)
//     return null
//   }
// }
