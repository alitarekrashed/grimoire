import { createComponentsForTraits } from '@/utils/services/description-parser.service'
import { useEffect, useState } from 'react'
import {
  ParsedDescription,
  ParsedToken,
} from '../parsed-description/parsed-description'

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
        <Badge key={trait} trait={trait} type="trait"></Badge>
      ))}
    </div>
  )
}

function Rarity({ rarity }: { rarity: string }) {
  let background = 'bg-stone-500'
  if (rarity === 'uncommon') {
    background = 'bg-orange-600'
  }

  return (
    <Badge backgroundColor={background} trait={rarity} type="rarity"></Badge>
  )
}

function Badge({
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
      }  p-0.5 mr-2`}
    >
      {type === 'trait' ? (
        <ParsedToken token={trait} type="TRAIT"></ParsedToken>
      ) : (
        trait
      )}
    </span>
  )
}
