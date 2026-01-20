import nodemailer from 'nodemailer'

interface EmailOptions {
  to: string
  subject: string
  html: string
}

interface OrderItem {
  productName: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

interface OrderConfirmationData {
  orderNumber: string
  customerName: string
  customerEmail: string
  items: OrderItem[]
  subtotal: number
  discountAmount: number
  shippingCost: number
  processingFee: number
  taxAmount: number
  totalAmount: number
  shippingAddress: {
    alias: string
    streetName: string
    streetNumber: string
    apartment?: string | null
    district: string
    province: string
    department: string
  }
  shippingMethod: string
  estimatedDelivery: Date | string | null
  createdAt: Date | string
}

class EmailService {
  private getTransporter(): nodemailer.Transporter {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST ?? 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT ?? '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    })
  }

  async sendEmail({ to, subject, html }: EmailOptions): Promise<boolean> {
    try {
      console.log('=== EMAIL DEBUG ===')
      console.log('Sending email to:', to)
      console.log('SMTP Config:', {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD ? '****' : 'NOT SET',
        from: process.env.SMTP_FROM
      })

      const transporter = this.getTransporter()

      const result = await transporter.sendMail({
        from: process.env.SMTP_FROM ?? 'AJK E-commerce <noreply@ajk.com>',
        to,
        subject,
        html
      })

      console.log('Email sent successfully:', result.messageId)
      console.log('===================')
      return true
    } catch (error) {
      console.error('=== EMAIL ERROR ===')
      console.error('Error sending email:', error)
      console.error('===================')
      return false
    }
  }

  async sendPasswordSetupEmail(
    email: string,
    name: string,
    token: string
  ): Promise<boolean> {
    const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'
    const setupUrl = `${baseUrl}/admin/setup-password?token=${token}`

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Configura tu contraseña</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <!-- Header -->
                <tr>
                  <td style="padding: 40px 40px 20px 40px; text-align: center; background-color: #1e40af; border-radius: 8px 8px 0 0;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 24px;">AJK E-commerce</h1>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 40px;">
                    <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 20px;">
                      ¡Bienvenido/a, ${name}!
                    </h2>
                    <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; line-height: 1.5;">
                      Se ha creado una cuenta para ti en el panel de administración de AJK E-commerce.
                    </p>
                    <p style="margin: 0 0 30px 0; color: #666666; font-size: 16px; line-height: 1.5;">
                      Para comenzar, necesitas configurar tu contraseña haciendo clic en el siguiente botón:
                    </p>

                    <!-- Button -->
                    <table role="presentation" style="margin: 0 auto;">
                      <tr>
                        <td style="border-radius: 6px; background-color: #1e40af;">
                          <a href="${setupUrl}" target="_blank" style="display: inline-block; padding: 16px 32px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold;">
                            Configurar mi contraseña
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p style="margin: 30px 0 0 0; color: #999999; font-size: 14px; line-height: 1.5;">
                      Este enlace expirará en 48 horas por motivos de seguridad.
                    </p>
                    <p style="margin: 20px 0 0 0; color: #999999; font-size: 14px; line-height: 1.5;">
                      Si no puedes hacer clic en el botón, copia y pega este enlace en tu navegador:
                    </p>
                    <p style="margin: 10px 0 0 0; color: #1e40af; font-size: 12px; word-break: break-all;">
                      ${setupUrl}
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 20px 40px; text-align: center; background-color: #f8f9fa; border-radius: 0 0 8px 8px;">
                    <p style="margin: 0; color: #999999; font-size: 12px;">
                      Este es un correo automático. Por favor no respondas a este mensaje.
                    </p>
                    <p style="margin: 10px 0 0 0; color: #999999; font-size: 12px;">
                      &copy; ${new Date().getFullYear()} AJK E-commerce. Todos los derechos reservados.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `

    return await this.sendEmail({
      to: email,
      subject: 'Configura tu contraseña - AJK E-commerce',
      html
    })
  }

  async sendVerificationCodeEmail(
    email: string,
    code: string
  ): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Código de verificación</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <!-- Header -->
                <tr>
                  <td style="padding: 40px 40px 20px 40px; text-align: center; background-color: #000000; border-radius: 8px 8px 0 0;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 24px;">AJK E-commerce</h1>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 40px;">
                    <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 20px; text-align: center;">
                      Tu código de verificación
                    </h2>
                    <p style="margin: 0 0 30px 0; color: #666666; font-size: 16px; line-height: 1.5; text-align: center;">
                      Ingresa el siguiente código para verificar tu correo electrónico:
                    </p>

                    <!-- Code Box -->
                    <table role="presentation" style="margin: 0 auto;">
                      <tr>
                        <td style="background-color: #f3f4f6; border-radius: 8px; padding: 20px 40px;">
                          <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #111827;">${code}</span>
                        </td>
                      </tr>
                    </table>

                    <p style="margin: 30px 0 0 0; color: #999999; font-size: 14px; line-height: 1.5; text-align: center;">
                      Este código expirará en 10 minutos.
                    </p>
                    <p style="margin: 20px 0 0 0; color: #999999; font-size: 14px; line-height: 1.5; text-align: center;">
                      Si no solicitaste este código, puedes ignorar este correo.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 20px 40px; text-align: center; background-color: #f8f9fa; border-radius: 0 0 8px 8px;">
                    <p style="margin: 0; color: #999999; font-size: 12px;">
                      Este es un correo automático. Por favor no respondas a este mensaje.
                    </p>
                    <p style="margin: 10px 0 0 0; color: #999999; font-size: 12px;">
                      &copy; ${new Date().getFullYear()} AJK E-commerce. Todos los derechos reservados.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `

    return await this.sendEmail({
      to: email,
      subject: `${code} es tu código de verificación - AJK E-commerce`,
      html
    })
  }

  async sendOrderConfirmationEmail(data: OrderConfirmationData): Promise<boolean> {
    const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'
    const orderUrl = `${baseUrl}/order/${data.orderNumber}/confirmation`
    const accountUrl = `${baseUrl}/account/orders`

    // Formatear fecha de entrega estimada
    const estimatedDate = data.estimatedDelivery
      ? new Date(data.estimatedDelivery).toLocaleDateString('es-PE', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : 'Por determinar'

    // Formatear fecha de pedido
    const orderDate = new Date(data.createdAt).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })

    // Generar filas de productos
    const itemsHtml = data.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
            <p style="margin: 0; font-weight: 500; color: #1f2937;">${item.productName}</p>
            <p style="margin: 4px 0 0 0; font-size: 14px; color: #6b7280;">Cantidad: ${item.quantity}</p>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
            <p style="margin: 0; font-weight: 500; color: #1f2937;">S/ ${item.totalPrice.toFixed(2)}</p>
            <p style="margin: 4px 0 0 0; font-size: 14px; color: #6b7280;">S/ ${item.unitPrice.toFixed(2)} c/u</p>
          </td>
        </tr>
      `
      )
      .join('')

    // Dirección formateada
    const addressLine = `${data.shippingAddress.streetName} ${data.shippingAddress.streetNumber}${data.shippingAddress.apartment ? `, ${data.shippingAddress.apartment}` : ''}`
    const locationLine = `${data.shippingAddress.district}, ${data.shippingAddress.province}, ${data.shippingAddress.department}`

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmación de Pedido</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <!-- Header -->
                <tr>
                  <td style="padding: 40px 40px 20px 40px; text-align: center; background-color: #059669; border-radius: 8px 8px 0 0;">
                    <div style="margin-bottom: 16px;">
                      <span style="display: inline-block; width: 60px; height: 60px; background-color: rgba(255,255,255,0.2); border-radius: 50%; line-height: 60px; font-size: 30px;">✓</span>
                    </div>
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px;">¡Pedido Confirmado!</h1>
                    <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">
                      Gracias por tu compra, ${data.customerName}
                    </p>
                  </td>
                </tr>

                <!-- Order Number -->
                <tr>
                  <td style="padding: 30px 40px 20px 40px; text-align: center; background-color: #f0fdf4;">
                    <p style="margin: 0; color: #6b7280; font-size: 14px;">Número de pedido</p>
                    <p style="margin: 8px 0 0 0; color: #059669; font-size: 24px; font-weight: bold;">${data.orderNumber}</p>
                    <p style="margin: 8px 0 0 0; color: #6b7280; font-size: 14px;">${orderDate}</p>
                  </td>
                </tr>

                <!-- Delivery Info -->
                <tr>
                  <td style="padding: 20px 40px;">
                    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #fef3c7; border-radius: 8px;">
                      <tr>
                        <td style="padding: 20px;">
                          <table role="presentation" style="width: 100%; border-collapse: collapse;">
                            <tr>
                              <td style="width: 40px; vertical-align: top;">
                                <span style="font-size: 24px;">📦</span>
                              </td>
                              <td>
                                <p style="margin: 0; font-weight: 600; color: #92400e; font-size: 16px;">Entrega estimada</p>
                                <p style="margin: 4px 0 0 0; color: #78350f; font-size: 14px;">${estimatedDate}</p>
                                <p style="margin: 4px 0 0 0; color: #92400e; font-size: 13px;">Método: ${data.shippingMethod || 'Estándar'}</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Shipping Address -->
                <tr>
                  <td style="padding: 0 40px 20px 40px;">
                    <h3 style="margin: 0 0 12px 0; color: #1f2937; font-size: 16px;">Dirección de envío</h3>
                    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f9fafb; border-radius: 8px;">
                      <tr>
                        <td style="padding: 16px;">
                          <p style="margin: 0; font-weight: 500; color: #1f2937;">${data.shippingAddress.alias}</p>
                          <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 14px;">${addressLine}</p>
                          <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 14px;">${locationLine}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Order Items -->
                <tr>
                  <td style="padding: 0 40px 20px 40px;">
                    <h3 style="margin: 0 0 12px 0; color: #1f2937; font-size: 16px;">Resumen del pedido</h3>
                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                      ${itemsHtml}
                    </table>
                  </td>
                </tr>

                <!-- Totals -->
                <tr>
                  <td style="padding: 0 40px 30px 40px;">
                    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f9fafb; border-radius: 8px;">
                      <tr>
                        <td style="padding: 16px;">
                          <table role="presentation" style="width: 100%; border-collapse: collapse;">
                            <tr>
                              <td style="padding: 4px 0; color: #6b7280;">Subtotal</td>
                              <td style="padding: 4px 0; text-align: right; color: #1f2937;">S/ ${data.subtotal.toFixed(2)}</td>
                            </tr>
                            ${data.discountAmount > 0 ? `
                            <tr>
                              <td style="padding: 4px 0; color: #059669;">Descuento</td>
                              <td style="padding: 4px 0; text-align: right; color: #059669;">-S/ ${data.discountAmount.toFixed(2)}</td>
                            </tr>
                            ` : ''}
                            <tr>
                              <td style="padding: 4px 0; color: #6b7280;">Envío</td>
                              <td style="padding: 4px 0; text-align: right; color: #1f2937;">${data.shippingCost === 0 ? 'Gratis' : `S/ ${data.shippingCost.toFixed(2)}`}</td>
                            </tr>
                            <tr>
                              <td style="padding: 4px 0; color: #6b7280;">IGV (18%)</td>
                              <td style="padding: 4px 0; text-align: right; color: #1f2937;">S/ ${data.taxAmount.toFixed(2)}</td>
                            </tr>
                            ${data.processingFee > 0 ? `
                            <tr>
                              <td style="padding: 4px 0; color: #6b7280;">Comisión de pago</td>
                              <td style="padding: 4px 0; text-align: right; color: #1f2937;">S/ ${data.processingFee.toFixed(2)}</td>
                            </tr>
                            ` : ''}
                            <tr>
                              <td colspan="2" style="padding: 12px 0 0 0; border-top: 1px solid #e5e7eb;"></td>
                            </tr>
                            <tr>
                              <td style="padding: 4px 0; font-weight: 600; font-size: 18px; color: #1f2937;">Total</td>
                              <td style="padding: 4px 0; text-align: right; font-weight: 600; font-size: 18px; color: #059669;">S/ ${(data.totalAmount + data.processingFee).toFixed(2)}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- CTA Buttons -->
                <tr>
                  <td style="padding: 0 40px 30px 40px;">
                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td align="center" style="padding-bottom: 12px;">
                          <a href="${orderUrl}" target="_blank" style="display: inline-block; padding: 14px 28px; background-color: #059669; color: #ffffff; text-decoration: none; font-weight: 600; border-radius: 8px; font-size: 16px;">
                            Ver detalles del pedido
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td align="center">
                          <a href="${accountUrl}" target="_blank" style="display: inline-block; padding: 12px 24px; background-color: #f3f4f6; color: #374151; text-decoration: none; font-weight: 500; border-radius: 8px; font-size: 14px;">
                            Ver mis pedidos
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 24px 40px; text-align: center; background-color: #f8f9fa; border-radius: 0 0 8px 8px;">
                    <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">
                      ¿Tienes preguntas sobre tu pedido?
                    </p>
                    <p style="margin: 0 0 16px 0;">
                      <a href="mailto:soporte@ajk.com" style="color: #059669; text-decoration: none; font-weight: 500;">soporte@ajk.com</a>
                      <span style="color: #d1d5db; margin: 0 8px;">•</span>
                      <a href="tel:+51999999999" style="color: #059669; text-decoration: none; font-weight: 500;">+51 999 999 999</a>
                    </p>
                    <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                      Este es un correo automático. Por favor no respondas a este mensaje.
                    </p>
                    <p style="margin: 10px 0 0 0; color: #9ca3af; font-size: 12px;">
                      &copy; ${new Date().getFullYear()} AJK E-commerce. Todos los derechos reservados.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `

    return await this.sendEmail({
      to: data.customerEmail,
      subject: `¡Pedido Confirmado! - #${data.orderNumber} - AJK E-commerce`,
      html
    })
  }
}

const emailService = new EmailService()
export default emailService
