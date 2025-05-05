import type React from 'react'

interface SectionTitleProps {
  children: React.ReactNode
  className?: string
}

export function SectionTitle({ children, className = '' }: SectionTitleProps) {
  return (
    <h2 className={`text-xl sm:text-2xl font-bold mb-4 pb-2 border-b dark:border-gray-700 ${className}`}>
      {children}
    </h2>
  )
}
