import React from 'react'
import Image from 'next/image'
import { GridImageProps } from 'app/lib/types'

export const TextBlock: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="my-4 prose">
    <p>{children}</p>
  </div>
)

export const TextGlow: React.FC<{ text: string }> = ({ text }) => (
  <span className="glow">{text}</span>
)

export const GridImage: React.FC<GridImageProps> = React.memo(
  ({ alt, src, className = '' }) => (
    <div
      className={`relative h-30 md:h-40 overflow-hidden rounded-lg md:rounded-xl grayscale ${className}`}
    >
      <Image
        fill
        alt={alt}
        src={src}
        className="object-cover opacity-75"
        sizes="(max-width: 768px) 213px, 33vw"
        priority
      />
    </div>
  ),
)

GridImage.displayName = 'GridImage'
