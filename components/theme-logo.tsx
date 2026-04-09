'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import Image from 'next/image'

interface ThemeLogoProps {
  size?: number
  className?: string
}

export function ThemeLogo({ size = 36, className = '' }: ThemeLogoProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <div style={{ width: size, height: size }} className={className} />
  }

  return (
    <Image
      src={resolvedTheme === 'dark' ? '/images/dark-mode-logo.webp' : '/images/light-mode-logo.webp'}
      alt="Snip Labs"
      width={size}
      height={size}
      className={className}
    />
  )
}
