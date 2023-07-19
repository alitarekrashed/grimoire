import { Activation } from '@/models/equipment'
import Image from 'next/image'
import { Traits } from '../card/traits-display'

// TODO better type
export function ActivationDescription({ value }: { value: Activation }) {
  return (
    <>
      <br />
      <div className="flex">
        <span className="font-bold">Activate</span>&nbsp;
        <span>
          <ActivationDisplay value={value}></ActivationDisplay>
        </span>
        &nbsp;
        {value.traits && (
          <Traits
            traits={value.traits}
            backgroundColor="bg-transparent"
            bordered={false}
          ></Traits>
        )}
        ;
      </div>
    </>
  )
}

function ActivationDisplay({ value }: { value: any }) {
  const image = (
    <Image
      src="/action-image-dark.png"
      width={15}
      height={15}
      alt="1 action"
    ></Image>
  )

  return (
    <>
      {image}&nbsp;{value.action}
    </>
  )
}
