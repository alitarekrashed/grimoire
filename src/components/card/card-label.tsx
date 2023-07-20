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
