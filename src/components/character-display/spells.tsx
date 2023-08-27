import { useEffect, useState } from 'react'
import { SpellInlineDisplay } from '../spells/spell-inline-display'
import { Spell } from '@/models/db/spell'
import { retrieveEntityByNames } from '@/utils/services/reference-lookup.service'
import { FocusSpells } from './focus-spells'

export function Spells({ spellNames }: { spellNames: string[] }) {
  const [spells, setSpells] = useState<Spell[]>()

  useEffect(() => {
    retrieveEntityByNames(spellNames, 'SPELL').then((spells) => {
      setSpells(spells as unknown as Spell[])
    })
  }, [spellNames])

  const focusSpells = spells ? spells.filter((spell: Spell) => spell.focus) : []

  return (
    <div>
      {focusSpells.length > 0 && (
        <FocusSpells spells={focusSpells}></FocusSpells>
      )}
    </div>
  )
}
