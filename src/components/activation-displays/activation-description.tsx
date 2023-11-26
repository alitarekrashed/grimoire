import React from 'react'
import { FieldDefinition, LabelsList } from '../labels-list/labels-list'
import {
  ParsedDescription,
  ParsedToken,
} from '../parsed-description/parsed-description'
import { ActionRenderer } from './action-renderer'
import { Activation, SavingThrow } from '@/models/db/activation'

export function ActivationDescription({
  value,
  labelClassName,
  hideActivation,
}: {
  value: Activation | undefined
  labelClassName?: string
  hideActivation?: boolean
}) {
  const fields: FieldDefinition[] = [
    {
      label: value?.override_label ?? 'Activate',
      value: !hideActivation && value ? buildActionValue(value, 15) : undefined,
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
      label: 'Requirements',
      value: value?.requirements,
    },
    {
      label: 'Effect',
      value: value?.effect?.description,
    },
  ]

  let area = undefined
  if (value?.area) {
    if (value!.area.type) {
      area = `${value!.area.value ?? ''}-${value!.area.unit} ${
        value!.area.type
      }`
    } else {
      area = `${value!.area.value ?? ''} ${value!.area.unit}`
    }

    if (value.area.variable) {
      area = `up to ${area}`
    }
  }
  const secondaryFields: FieldDefinition[] = [
    {
      label: 'Area',
      value: area,
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

  let duration = undefined
  if (value?.duration) {
    if (value.duration!.sustained) {
      duration = 'sustained'
      if (value.duration!.value) {
        duration = `${duration} up to ${value.duration.value} ${value.duration.unit}`
      }
    } else {
      duration = `${value.duration.value ?? ''} ${value.duration.unit}`
    }
  }
  const tertiaryFields: FieldDefinition[] = [
    {
      label: 'Defense',
      value: value?.defense,
    },
    {
      label: 'Duration',
      value: duration,
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
    </>
  ) : (
    <></>
  )
}

export function buildActionValue(value: Activation, iconSize: number): any[] {
  let result = []
  if (value.num_actions) {
    result.push(
      <ActionRenderer
        key={value.num_actions}
        activation={value}
        size={iconSize}
      ></ActionRenderer>
    )
  }
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

export function SavingThrowDisplay({ value }: { value: SavingThrow }) {
  const fields: FieldDefinition[] = [
    {
      label: 'Critical Success',
      value: value.critical_success && (
        <ParsedDescription
          description={value.critical_success}
        ></ParsedDescription>
      ),
    },
    {
      label: 'Success',
      value: value.success && (
        <ParsedDescription description={value.success}></ParsedDescription>
      ),
    },
    {
      label: 'Failure',
      value: value.failure && (
        <ParsedDescription description={value.failure}></ParsedDescription>
      ),
    },
    {
      label: 'Critical Failure',
      value: value.critical_failure && (
        <ParsedDescription
          description={value.critical_failure}
        ></ParsedDescription>
      ),
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
