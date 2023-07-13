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

function Rarity({ rarity }: { rarity: string }) {
  let background = 'bg-slate-500'
  if (rarity === 'uncommon') {
    background = 'bg-orange-600'
  }

  return <Trait backgroundColor={background} trait={rarity}></Trait>
}

function Trait({
  trait,
  backgroundColor,
}: {
  trait: string
  backgroundColor?: string
}) {
  return (
    <span
      className={`border border-slate-400 rounded ${
        backgroundColor ? backgroundColor : 'bg-slate-600'
      }  p-0.5 mr-2`}
    >
      {trait}
    </span>
  )
}
