import { Activation } from '@/models/equipment'
import Image from 'next/image'

export function ActionRenderer({
  value,
  size,
}: {
  value: Activation
  size: number
}) {
  const image = (
    <Image
      src="/action-image-dark.png"
      width={size}
      height={size}
      alt="1 action"
      className="inline"
    ></Image>
  )

  return (
    <>
      {image}&nbsp;{value.action}
    </>
  )
}
