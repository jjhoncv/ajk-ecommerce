import { HouseIcon } from 'lucide-react'
import Link from 'next/link'
import React, { type FC } from 'react'

interface PageUIProps {
  title?: React.ReactNode
  subtitle?: React.ReactNode
  options?: React.ReactNode
  breadcrumb?: Array<{ label: string, url?: string }>
  children: React.ReactNode
}

export const PageUI: FC<PageUIProps> = ({
  title,
  subtitle,
  options,
  breadcrumb,
  children
}) => {
  return (
    <>
      {breadcrumb && (
        <div className="my-5 flex items-center gap-2 text-sm">
          <Link className="text-gray-500" href="/admin">
            <HouseIcon size={15} />
          </Link>
          {breadcrumb.length > 0 && (
            <div className="flex gap-2">
              <div className="text-gray-500">{'/'}</div>
              {breadcrumb.map((item, key) => (
                <div className="flex gap-2" key={key}>
                  {item.url ? (
                    <>
                      <Link className="text-gray-500" href={item.url}>
                        {item.label}
                      </Link>
                      <div>{'/'}</div>
                    </>
                  ) : (
                    <span>{item.label}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <div className="flex justify-between">
        <div>
          {title && <h1 className="text-2xl font-semibold">{title}</h1>}
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>

        {options && <div>{options}</div>}
      </div>
      <div className="mt-5 md:mt-0">{children}</div>
    </>
  )
}
