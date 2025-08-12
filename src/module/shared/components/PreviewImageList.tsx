import { ImageOffIcon } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

interface PreviewImageList {
  imageURL?: string
}

export const PreviewImageList = ({ imageURL }: PreviewImageList) => {
  const [show, setShow] = useState(false)

  return (
    <>
      <div
        className="relative"
        onMouseEnter={() => {
          if (imageURL) {
            setShow(true)
          }
        }}
        onMouseLeave={() => {
          if (imageURL) {
            setShow(false)
          }
        }}
      >
        {show && imageURL && (
          <div className="absolute right-[calc(100%-45px)] top-[calc(100%-45px)] z-50 h-[60px] w-[60px] overflow-hidden rounded-full">
            <Image
              src={imageURL}
              fill
              priority
              alt="image banner"
              className="object-cover"
            />
          </div>
        )}
        {imageURL ? (
          <div
            className={`relative h-[30px] w-[30px] overflow-hidden rounded-full ${
              show ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <Image
              src={imageURL}
              fill
              sizes="200px"
              priority
              alt="image banner"
              className="object-cover"
            />
          </div>
        ) : (
          <ImageOffIcon size={20} strokeWidth={1.5} />
        )}
      </div>
    </>
  )
}
