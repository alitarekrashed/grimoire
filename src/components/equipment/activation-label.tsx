import { Activation } from '@/models/equipment'
import Image from 'next/image'

export function ActivationLabel({ value }: { value: Activation | undefined }) {
  return value ? (
    <div className="flex">
      Activate:&nbsp;<ActivationDisplay value={value}></ActivationDisplay>
    </div>
  ) : (
    <></>
  )
}

function ActivationDisplay({ value }: { value: any }) {
  const image = (
    <Image
      src="/action-image-dark.png"
      width={20}
      height={20}
      alt="1 action"
    ></Image>
  )

  return (
    <>
      {image}&nbsp;{value.action}
    </>
  )
}
