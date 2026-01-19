import Link from 'next/link'
import React, { type FC } from 'react'

interface ButtonProps {
  type: 'button' | 'cancel' | 'link' | 'submit'
  href?: string
  children: React.ReactNode
  onClick?: () => void
  outline?: boolean
  disabled?: boolean
  className?: string
}

export const Button: FC<ButtonProps> = ({
  children,
  type,
  href,
  outline,
  onClick,
  disabled,
  className: customClassName,
  ...props
}) => {
  const baseClassName = `min-w-16 rounded px-8 py-2.5 flex ${
    disabled ? '!bg-gray-300 !hover:bg-gray-200 !cursor-not-allowed' : ''
  } ${customClassName ?? ''}`
  const classOutline =
    'border hover:border-slate-300 bg-slate-300 hover:bg-gray-400 transition-colors'
  const classBg = 'bg-gray-800 text-white hover:bg-sky-600 transition-colors'

  return (
    <>
      {(type === 'button' || type === 'submit') && (
        <button
          className={`${outline ? classOutline : classBg} ${baseClassName} cursor`}
          type={type}
          onClick={onClick}
          {...props}
        >
          {children}
        </button>
      )}
      {type === 'cancel' && href && (
        <Link href={href} className={`${classOutline} ${baseClassName}`}>
          {children}
        </Link>
      )}
      {type === 'link' && href && (
        <Link href={href} className={`border ${classBg} ${baseClassName}`}>
          {children}
        </Link>
      )}
    </>
  )
}
