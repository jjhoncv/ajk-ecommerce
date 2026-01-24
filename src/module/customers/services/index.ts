import { login } from './login'
import { register } from './register'
import { findOrCreateByOAuth } from './oauth'

const CustomerService = {
  login,
  register,
  findOrCreateByOAuth
}

export default CustomerService
