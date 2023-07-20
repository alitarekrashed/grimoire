import { Activation, SavingThrow } from '@/models/equipment'
import Image from 'next/image'
import { Traits } from '../card/traits-display'
import CardLabel from '../card/card-label'
import { ParsedToken } from '../parsed-description/parsed-description'

// TODO better type
export function ActivationDescription({ value }: { value: Activation }) {
  return (
    <>
      <br />
      <div>
        <span className="font-bold">Activate</span>&nbsp;
        <ActivationDisplay value={value}></ActivationDisplay>
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
        ;&nbsp;
        {value.effect && (
          <CardLabel
            label="Effect"
            value={value.effect.description}
            labelClassName="font-bold"
          ></CardLabel>
        )}
      </div>
      {value.effect?.saving_throw && (
        <div className="mt-2">
          <SavingThrowDisplay
            value={value.effect.saving_throw}
          ></SavingThrowDisplay>
        </div>
      )}
    </>
  )
}

function SavingThrowDisplay({ value }: { value: SavingThrow }) {
  return (
    <div className="ml-5">
      {value.critical_success && (
        <>
          <CardLabel
            label="Critical success"
            value={value.critical_success}
            labelClassName="font-bold"
          ></CardLabel>
          <br />
        </>
      )}
      {value.success && (
        <>
          <CardLabel
            label="Success"
            value={value.success}
            labelClassName="font-bold"
          ></CardLabel>
          <br />
        </>
      )}
      {value.failure && (
        <>
          <CardLabel
            label="Failure"
            value={value.failure}
            labelClassName="font-bold"
          ></CardLabel>
          <br />
        </>
      )}
      {value.critical_failure && (
        <>
          <CardLabel
            label="Critical failure"
            value={value.critical_failure}
            labelClassName="font-bold"
          ></CardLabel>
          <br />
        </>
      )}
    </div>
  )
}

function ActivationDisplay({ value }: { value: any }) {
  const image = (
    <Image
      src="/action-image-dark.png"
      width={15}
      height={15}
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
