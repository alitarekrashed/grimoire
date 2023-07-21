import { Activation, SavingThrow } from '@/models/equipment'
import { CardLabelList, FieldDefinition } from '../card/card-label-list'
import { ActivationLabel } from './activation-label'

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
        <ActivationLabel value={value}></ActivationLabel>
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
