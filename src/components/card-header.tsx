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
    <div className="grid grid-cols-4 justify-between text-xl font-semibold">
      <div className="col-span-3 justify-self-start">{name}</div>
      <div className="justify-self-end">
        {type} {level}
      </div>
    </div>
  )
}
