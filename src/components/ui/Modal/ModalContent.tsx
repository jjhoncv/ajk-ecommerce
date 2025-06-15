import { ReactNode } from "react"

export const ModalContent = ({ children }: { children: ReactNode }) => {
  return (
    <div className="p-4">{children}</div>
  )
}
