export default function Traits({
  traits,
  rarity,
}: {
  traits: string[]
  rarity?: string
}) {
  return (
    <div className="text-xs my-1">
      {rarity ? <Rarity rarity={rarity}></Rarity> : null}
      {traits.map((trait) => (
        <Trait key={trait} trait={trait}></Trait>
      ))}
    </div>
  )
}

export function Rarity({ rarity }: { rarity: string }) {
  let background = 'bg-slate-600'
  if (rarity === 'uncommon') {
    background = 'bg-orange-600'
  }

  return <Trait className={background} trait={rarity}></Trait>
}

export function Trait({
  trait,
  className,
}: {
  trait: string
  className?: string
}) {
  return (
    <span
      className={`border border-slate-400 rounded bg-slate-600 p-0.5 mr-2 ${className}`}
    >
      {trait}
    </span>
  )
}
