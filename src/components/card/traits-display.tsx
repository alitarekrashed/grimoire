import { ParsedToken } from '../parsed-description/parsed-description'

export function Traits({
  traits,
  backgroundColor,
  bordered,
  rarity,
}: {
  traits: string[]
  backgroundColor?: string
  bordered?: boolean
  rarity?: string
}) {
  return (
    <span className="text-xs">
      {rarity ? <Rarity rarity={rarity}></Rarity> : null}
      {traits.map((trait, index) => {
        return (
          <>
            <span className={`${index < traits.length - 1 && 'mr-2'}`}>
              <Badge
                key={trait}
                trait={trait}
                type="trait"
                bordered={bordered}
                backgroundColor={backgroundColor}
              ></Badge>
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
  bordered,
  type,
}: {
  trait: string
  backgroundColor?: string
  bordered?: boolean
  type: 'rarity' | 'trait'
}) {
  return (
    <span
      className={`${
        bordered === false ? '' : 'border'
      } border-stone-400 rounded ${
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
