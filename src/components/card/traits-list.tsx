import React from 'react'
import { ParsedToken } from '../parsed-description/parsed-description'

export function TraitsList({
  traits,
  rarity,
  className,
}: {
  traits: string[]
  rarity?: string
  className?: string
}) {
  return (
    <span className={className ?? 'text-xs'}>
      {rarity ? <Rarity rarity={rarity}></Rarity> : null}
      {traits.map((trait, index) => {
        return (
          <React.Fragment key={trait}>
            <span className={`${index < traits.length - 1 && 'mr-2'}`}>
              <Badge trait={trait} type="trait"></Badge>
            </span>
          </React.Fragment>
        )
      })}
    </span>
  )
}

export function Rarity({ rarity }: { rarity: string }) {
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
      }  p-0.5 inline-flex items-end h-4/5`}
    >
      {type === 'trait' ? (
        <ParsedToken token={trait} type="TRAIT"></ParsedToken>
      ) : (
        trait
      )}
    </span>
  )
}
