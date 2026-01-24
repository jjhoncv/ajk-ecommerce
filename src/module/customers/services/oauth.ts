import { customerModel } from '@/module/customers/core'
import { type Customers as Customer } from '@/types/domain'
import bcrypt from 'bcryptjs'

interface OAuthData {
  email: string
  name: string
  provider: string
  providerId: string
}

/**
 * Find or create a customer by OAuth provider data
 * If the customer exists, return them
 * If not, create a new customer with OAuth data (no password required)
 */
export const findOrCreateByOAuth = async (
  oauthData: OAuthData
): Promise<Customer | null> => {
  try {
    // Check if customer already exists by email
    const existingCustomer = await customerModel.getCustomerByEmail(
      oauthData.email
    )

    if (existingCustomer) {
      return existingCustomer
    }

    // Create new customer without password (OAuth user)
    // Generate a random placeholder password since the field is required
    const randomPassword = `oauth_${Date.now()}_${Math.random().toString(36).substring(7)}`
    const hashedPassword = await bcrypt.hash(randomPassword, 10)

    // Split name into first and last name
    const nameParts = oauthData.name.split(' ')
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || ''

    const newCustomer = await customerModel.createCustomer({
      email: oauthData.email,
      name: firstName,
      lastname: lastName,
      password: hashedPassword
    })

    if (!newCustomer) {
      throw new Error('Could not create OAuth customer')
    }

    return newCustomer
  } catch (error) {
    console.error('Error in findOrCreateByOAuth:', error)
    throw error
  }
}
