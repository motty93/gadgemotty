'use client'

import { forwardRef, useEffect, useRef } from 'react'

interface NextImageHandlerProps {
  htmlContent: string
  className?: string
}

const NextImageHandler = forwardRef<HTMLDivElement, NextImageHandlerProps>(
  ({ htmlContent, className }, ref) => {
    const localRef = useRef<HTMLDivElement>(null)
    const containerRef = ref || localRef

    useEffect(() => {
      const element = 'current' in containerRef ? containerRef.current : containerRef
      if (!element) return

      const parser = new DOMParser()
      const doc = parser.parseFromString(htmlContent, 'text/html')
      let placeholders = doc.querySelectorAll('next-image-placeholder')

      if (placeholders.length === 0) {
        const divElement = element as HTMLDivElement
        placeholders = divElement.querySelectorAll('next-image-placeholder')
      }

      placeholders.forEach((placeholder) => {
        const src = placeholder.getAttribute('data-src') || ''
        const alt = placeholder.getAttribute('data-alt') || ''
        const width = Number.parseInt(placeholder.getAttribute('data-width') || '800', 10)
        const height = Number.parseInt(placeholder.getAttribute('data-height') || '450', 10)

        const wrapper = document.createElement('div')
        wrapper.style.position = 'relative'
        wrapper.style.width = '100%'
        wrapper.className = 'next-image-wrapper'
        wrapper.style.aspectRatio = `${width}/${height}`

        const img = document.createElement('img')
        img.src = src
        img.alt = alt
        img.setAttribute('loading', 'lazy')
        img.setAttribute('decoding', 'async')
        img.style.objectFit = 'cover'
        img.style.width = '100%'
        img.style.height = '100%'

        wrapper.appendChild(img)
        placeholder.parentNode?.replaceChild(wrapper, placeholder)
      })
    }, [htmlContent, containerRef])

    return <div ref={containerRef} className={className} dangerouslySetInnerHTML={{ __html: htmlContent }} />
  },
)

NextImageHandler.displayName = 'NextImageHandler'

export default NextImageHandler
