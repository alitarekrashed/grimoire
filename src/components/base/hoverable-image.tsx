import { HoverDisplay } from './hover-display'
import Image from 'next/image'

export default function HoverableImage({
  src,
  width,
  height,
  alt,
  className,
}: {
  src: string
  width: number
  height: number
  alt: string
  className: string
}) {
  const image = (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
    ></Image>
  )
  return (
    <HoverDisplay
      title={image}
      content={<span>{alt}</span>}
      size="fit"
    ></HoverDisplay>
  )
}
