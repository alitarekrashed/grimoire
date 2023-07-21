import React from 'react'
import { FieldDefinition, LabelsList } from '../labels-list/labels-list'
import { ParsedToken } from '../parsed-description/parsed-description'
import { ActionRenderer } from './action-renderer'
import { Activation, SavingThrow } from '@/models/activation'

export function ActivationDescription({
  value,
  labelClassName,
}: {
  value: Activation | undefined
  labelClassName?: string
}) {
  const fields: FieldDefinition[] = [
    {
      label: value?.override_label ?? 'Activate',
      value: value ? buildActionValue(value, 15) : [],
    },
    {
      label: 'Frequency',
      value: value?.frequency,
    },
    {
      label: 'Trigger',
      value: value?.trigger,
    },
    {
      label: 'Effect',
      value: value?.effect?.description,
    },
  ]

  const secondaryFields: FieldDefinition[] = [
    {
      label: 'Area',
      value: value?.area
        ? `${value!.area.value} ${value!.area.unit}`
        : undefined,
    },
    {
      label: 'Range',
      value: value?.range
        ? `${value!.range.value ? value!.range!.value + ' ' : ''}${
            value!.range.unit
          }`
        : undefined,
    },
    {
      label: 'Targets',
      value: value?.targets,
    },
  ]

  const tertiaryFields: FieldDefinition[] = [
    {
      label: 'Duration',
      value: value?.duration
        ? `${value!.duration.value} ${value!.duration.unit}`
        : undefined,
    },
  ]

  return value ? (
    <>
      <div>
        <LabelsList
          fieldDefinitions={fields}
          labelClassName={labelClassName ?? 'font-bold'}
        ></LabelsList>
      </div>
      <div>
        <LabelsList
          fieldDefinitions={secondaryFields}
          labelClassName={labelClassName ?? 'font-bold'}
        ></LabelsList>
      </div>
      <div>
        <LabelsList
          fieldDefinitions={tertiaryFields}
          labelClassName={labelClassName ?? 'font-bold'}
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
  ) : (
    <></>
  )
}

function buildActionValue(value: Activation, iconSize: number) {
  let result = [
    <ActionRenderer
      key={value.num_actions}
      activation={value}
      size={iconSize}
    ></ActionRenderer>,
  ]
  if (value.traits) {
    result = result.concat(
      value.traits.map((trait, index) => (
        <React.Fragment key={trait}>
          <ParsedToken token={trait} type="TRAIT"></ParsedToken>
          {index < value.traits!.length - 1 && ', '}
        </React.Fragment>
      ))
    )
  }
  return result
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
