export default function CardHeader({
  name,
  type,
  level,
}: {
  name: string
  type: string
  level: number | number[] | undefined
}) {
  let displayLevel: string = '' + level
  if (Array.isArray(level)) {
    level.sort((a, b) => a - b)
    displayLevel = '' + level[0]
    displayLevel = level.length > 1 ? displayLevel.concat('+') : displayLevel
  }

  return (
    <div className="grid grid-cols-4 justify-between text-xl font-semibold">
      <div className="col-span-3 justify-self-start capitalize">{name}</div>
      <div className="justify-self-end">
        {type} {displayLevel}
      </div>
    </div>
  )
}
