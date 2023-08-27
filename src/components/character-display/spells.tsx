import { useEffect, useState } from 'react'
import { SpellInlineDisplay } from '../spells/spell-inline-display'
import { Spell } from '@/models/db/spell'
import { retrieveEntityByNames } from '@/utils/services/reference-lookup.service'

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
        <div>
          <div className="text-lg font-light">Focus</div>
          <span className="text-xs">
            {spells &&
              spells.length > 0 &&
              spells.map((spell, index) => (
                <div key={`${spell}-${index}`} className="mb-1">
                  <SpellInlineDisplay spell={spell}></SpellInlineDisplay>
                </div>
              ))}
          </span>
        </div>
      )}
    </div>
  )
}
