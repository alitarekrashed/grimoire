export default function CardLabel({
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
        {label}:&nbsp;
      </span>
      <span className={valueClassName}>{value}</span>
    </span>
  )
}

export function CardLabelList({
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
          label={field.label}
          value={field.value}
          labelClassName={labelClassName}
          valueClassName={valueClassName}
        ></CardLabel>
      )
      if (i < fieldDefinitions.length - 1 && fieldDefinitions[i + 1].value) {
        if (separator === 'new-line') {
          labels.push(<br />)
        } else {
          labels.push('; ')
        }
      }
    }
  }

  return <>{labels}</>
}

export interface FieldDefinition {
  label: string
  value: string | undefined
}
