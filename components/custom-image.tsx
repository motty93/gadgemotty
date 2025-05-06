'use client'

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import NextImage from 'next/image'
import { useState } from 'react'

export default function CustomImage(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const { src, alt = '', width, height, ...rest } = props
  const [open, setOpen] = useState(false)

  if (typeof src !== 'string') return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span className="relative w-full h-auto my-6 cursor-zoom-in">
          <NextImage
            src={src}
            alt={alt}
            width={Number(width) || 800}
            height={Number(height) || 450}
            layout="responsive"
            objectFit="contain"
            loading="lazy"
            className="rounded-lg"
            {...rest}
          />
        </span>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-full p-0 bg-transparent border-none">
        <DialogTitle>
          <VisuallyHidden>画像拡大表示</VisuallyHidden>
        </DialogTitle>
        <div className="relative w-full h-auto">
          <NextImage
            src={src}
            alt={alt}
            width={Number(width) || 1200}
            height={Number(height) || 800}
            layout="responsive"
            objectFit="contain"
            className="rounded"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
