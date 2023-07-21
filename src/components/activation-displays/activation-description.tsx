import { Activation, SavingThrow } from '@/models/equipment'
import { LabelsList, FieldDefinition } from '../labels-list/labels-list'
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
        <ActivationLabel value={value} iconSize={15}></ActivationLabel>
        <LabelsList
          fieldDefinitions={fields}
          labelClassName="font-bold"
        ></LabelsList>
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
      <LabelsList
        fieldDefinitions={fields}
        labelClassName="font-bold"
        separator="new-line"
      ></LabelsList>
    </div>
  )
}
