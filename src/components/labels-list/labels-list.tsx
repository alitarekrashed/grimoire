import React from 'react'

export interface FieldDefinition {
  label: string
  value: any | undefined
  valueClassName?: string // TODO consider making this better... maybe this should become a value formatter? to allow formatting of currencies too?
}

export function LabelsList({
  fieldDefinitions,
  labelClassName,
  valueClassName,
  separator,
}: {
  fieldDefinitions: FieldDefinition[]
  labelClassName?: string
  valueClassName?: string
  separator?: 'semicolon' | 'new-line'
}) {
  let labels: any = []

  for (let i = 0; i < fieldDefinitions.length; i++) {
    const field = fieldDefinitions[i]
    if (field.value) {
      labels.push(
        <CardLabel
          key={field.label}
          label={field.label}
          value={field.value}
          labelClassName={labelClassName}
          valueClassName={`${valueClassName} ${
            field.valueClassName && field.valueClassName
          }`}
        ></CardLabel>
      )
      if (
        i < fieldDefinitions.length - 1 &&
        fieldDefinitions.slice(i + 1).some((field) => field.value)
      ) {
        if (separator === 'new-line') {
          labels.push(
            <React.Fragment key={`${field.label} + ${separator}`}>
              <br />
            </React.Fragment>
          )
        } else {
          labels.push('; ')
        }
      }
    }
  }

  return <>{labels}</>
}

function CardLabel({
  label,
  value,
  labelClassName,
  valueClassName,
}: {
  label: string
  value: string | number
  labelClassName?: string
  valueClassName?: string
}) {
  return (
    <span>
      <span className={`${labelClassName ?? 'font-medium'}`}>
        {label}&nbsp;
      </span>
      <span className={valueClassName}>{value}</span>
    </span>
  )
}
