export default function CardLabel({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <>
      <span className="font-medium">{label}:</span> {value}
    </>
  )
}
