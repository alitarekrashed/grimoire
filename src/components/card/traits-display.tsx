import { ParsedToken } from '../parsed-description/parsed-description'

export function TraitsList({
  traits,
  rarity,
}: {
  traits: string[]
  rarity?: string
}) {
  return (
    <span className="text-xs">
      {rarity ? <Rarity rarity={rarity}></Rarity> : null}
      {traits.map((trait, index) => {
        return (
          <>
            <span className={`${index < traits.length - 1 && 'mr-2'}`}>
              <Badge key={trait} trait={trait} type="trait"></Badge>
            </span>
          </>
        )
      })}
    </span>
  )
}

function Rarity({ rarity }: { rarity: string }) {
  let background = 'bg-stone-500'
  if (rarity === 'uncommon') {
    background = 'bg-orange-600'
  } else if (rarity === 'rare') {
    background = 'bg-blue-900'
  }

  return (
    <span className="mr-2">
      <Badge backgroundColor={background} trait={rarity} type="rarity"></Badge>
    </span>
  )
}

export function Badge({
  trait,
  backgroundColor,
  type,
}: {
  trait: string
  backgroundColor?: string
  type: 'rarity' | 'trait'
}) {
  return (
    <span
      className={`border border-stone-400 rounded ${
        backgroundColor ? backgroundColor : 'bg-stone-600'
      }  p-0.5`}
    >
      {type === 'trait' ? (
        <ParsedToken token={trait} type="TRAIT"></ParsedToken>
      ) : (
        trait
      )}
    </span>
  )
}
