"use client"

import React, { useState } from "react"
import Image, { ImageProps } from "next/image"

export interface ListingCardImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc: string
}

export function ListingCardImage({
  src,
  fallbackSrc,
  alt,
  unoptimized,
  ...props
}: ListingCardImageProps) {
  const [hasError, setHasError] = useState(false)
  const [prevSrc, setPrevSrc] = useState(src)

  // Adjust state during render when prop changes, avoiding cascading effect renders
  if (prevSrc !== src) {
    setPrevSrc(src)
    setHasError(false)
  }

  const currentSrc = hasError ? fallbackSrc : src
  const isHttp = typeof currentSrc === "string" && currentSrc.startsWith("http")

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt}
      unoptimized={unoptimized ?? isHttp}
      onError={() => {
        setHasError(true)
      }}
    />
  )
}
