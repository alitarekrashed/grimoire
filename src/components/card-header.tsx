export default function CardHeader({
  name,
  type,
  level,
}: {
  name: string
  type: string
  level: number
}) {
  return (
    <div className="grid grid-cols-2 justify-between text-xl font-semibold">
      <div className="justify-self-start">{name}</div>
      <div className="justify-self-end">
        {type} {level}
      </div>
    </div>
  )
}
