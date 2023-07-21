import { Activation } from '@/models/equipment'
import Image from 'next/image'
import { CardLabelList } from '../card/card-label'

export function ActivationLabel({ value }: { value: Activation | undefined }) {
  return value ? (
    <CardLabelList
      fieldDefinitions={[
        {
          label: 'Activate',
          value: <ActivationDisplay value={value}></ActivationDisplay>,
        },
      ]}
    ></CardLabelList>
  ) : (
    <></>
  )
}

function ActivationDisplay({ value }: { value: any }) {
  const image = (
    <Image
      src="/action-image-dark.png"
      width={18}
      height={18}
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
