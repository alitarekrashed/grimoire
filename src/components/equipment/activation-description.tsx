import { Activation } from '@/models/equipment'
import Image from 'next/image'
import { Traits } from '../card/traits-display'
import CardLabel from '../card/card-label'
import { ParsedToken } from '../parsed-description/parsed-description'

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
        {value.traits &&
          value.traits.map((trait) => (
            <ParsedToken key={trait} token={trait} type="TRAIT"></ParsedToken>
          ))}
        ;&nbsp;
        {value.frequency && (
          <CardLabel
            label="Frequency"
            value={value.frequency}
            labelClassName="font-bold"
          ></CardLabel>
        )}
        ;&nbsp;
        {value.trigger && (
          <CardLabel
            label="Trigger"
            value={value.trigger}
            labelClassName="font-bold"
          ></CardLabel>
        )}
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
