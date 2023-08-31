import { Spell } from '@/models/db/spell'
import { retrieveEntityByNames } from '@/utils/services/reference-lookup.service'
import { useEffect, useState } from 'react'
import { FocusSpells } from './focus-spells'
import { SpellFeatureValue } from '@/models/db/feature'
import { InnateSpells } from './innate-spells'

export function Spells({ features }: { features: SpellFeatureValue[] }) {
  const [allSpells, setAllSpells] = useState<Spell[]>()

  useEffect(() => {
    if (features) {
      retrieveEntityByNames(
        features.map((val) => val.name),
        'SPELL'
      ).then((val) => {
        setAllSpells(val as unknown as Spell[])
      })
    }
  }, [features])

  const match = (name: string) =>
    features.find((feature) => feature.name === name)

  const focusSpells = allSpells
    ? allSpells.filter((spell: Spell) => spell.focus)
    : []
  const innateSpells = allSpells
    ? allSpells.filter((spell: Spell) => match(spell.name)?.innate)
    : []

  return (
    <div>
      {focusSpells.length > 0 && (
        <FocusSpells spells={focusSpells}></FocusSpells>
      )}
      {innateSpells.length > 0 && (
        <InnateSpells spells={innateSpells}></InnateSpells>
      )}
    </div>
  )
}
