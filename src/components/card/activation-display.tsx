import Image from 'next/image'

// TODO better type
export default function Activation({ value }: { value: any }) {
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
