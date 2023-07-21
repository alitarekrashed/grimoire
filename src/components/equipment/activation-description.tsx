import { Activation, SavingThrow } from '@/models/equipment'
import Image from 'next/image'
import { TraitsList } from '../card/traits-display'
import { CardLabelList, FieldDefinition } from '../card/card-label'
import { ParsedToken } from '../parsed-description/parsed-description'

// TODO better type
export function ActivationDescription({ value }: { value: Activation }) {
  const fields: FieldDefinition[] = [
    {
      label: 'Frequency',
      value: value.frequency,
    },
    {
      label: 'Trigger',
      value: value.trigger,
    },
    {
      label: 'Effect',
      value: value.effect?.description,
    },
  ]

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
        <CardLabelList
          fieldDefinitions={fields}
          labelClassName="font-bold"
        ></CardLabelList>
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
  const fields: FieldDefinition[] = [
    {
      label: 'Critical Success',
      value: value.critical_success,
    },
    {
      label: 'Success',
      value: value.success,
    },
    {
      label: 'Failure',
      value: value.failure,
    },
    {
      label: 'Critical Failure',
      value: value.critical_failure,
    },
  ]

  return (
    <div className="ml-5">
      <CardLabelList
        fieldDefinitions={fields}
        labelClassName="font-bold"
        separator="new-line"
      ></CardLabelList>
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
