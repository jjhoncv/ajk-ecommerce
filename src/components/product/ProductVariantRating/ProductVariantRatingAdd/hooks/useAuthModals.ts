import { useState } from 'react'

export const useAuthModals = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)

  const openLoginModal = () => {
    setIsLoginModalOpen(true)
    setIsRegisterModalOpen(false)
  }

  const openRegisterModal = () => {
    setIsRegisterModalOpen(true)
    setIsLoginModalOpen(false)
  }

  const closeAllModals = () => {
    setIsLoginModalOpen(false)
    setIsRegisterModalOpen(false)
  }

  const switchToRegister = () => {
    setIsLoginModalOpen(false)
    setIsRegisterModalOpen(true)
  }

  const switchToLogin = () => {
    setIsRegisterModalOpen(false)
    setIsLoginModalOpen(true)
  }

  return {
    isLoginModalOpen,
    isRegisterModalOpen,
    openLoginModal,
    openRegisterModal,
    closeAllModals,
    switchToRegister,
    switchToLogin
  }
}
