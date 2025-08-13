import { PlusIcon } from 'lucide-react'
import React, { type FC } from 'react'
import { Button } from '../Form/Input/Button'

interface PageButtonProps {
  children: React.ReactNode
  href: string
}

export const PageButton: FC<PageButtonProps> = ({ children, href }) => {
  return (
    <Button type="link" href={href}>
      <div className="flex items-center gap-2">
        <PlusIcon size={20} />
        {children || 'Crear nuevo'}
      </div>
    </Button>
  )
}
