import { useEffect, useState } from 'react'
import { SpellInlineDisplay } from '../spells/spell-inline-display'
import { Spell } from '@/models/db/spell'
import { retrieveEntityByNames } from '@/utils/services/reference-lookup.service'

export function Spells({ spellNames }: { spellNames: string[] }) {
  const [spells, setSpells] = useState<Spell[]>()

  useEffect(() => {
    console.log(spellNames)
    retrieveEntityByNames(spellNames, 'SPELL').then((spells) => {
      console.log(spells)
      setSpells(spells as unknown as Spell[])
    })
  }, [spellNames])
  return (
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
  )
}
