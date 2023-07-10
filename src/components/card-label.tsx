export default function CardLabel({
  label,
  value,
  valueClassName,
}: {
  label: string
  value: string
  valueClassName?: string
}) {
  return (
    <span>
      <span className="font-medium">{label}:&nbsp;</span>
      <span className={valueClassName}>{value}</span>
    </span>
  )
}
