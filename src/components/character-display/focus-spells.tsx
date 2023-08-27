import { Spell } from '@/models/db/spell'
import { SpellInlineDisplay } from '../spells/spell-inline-display'
import { SiCodemagic } from 'react-icons/si'

export function FocusSpells({ spells }: { spells: Spell[] }) {
  const focusPool: number = Math.min(spells.length, 3)
  const options = []

  for (let i = 0; i < focusPool; i++) {
    options.push({ checked: false })
  }

  return (
    <div>
      <div className="text-lg font-light flex flex-row gap-2 items-center">
        Focus
        <div className="flex flex-row gap-1">
          {options.map((value, index) => (
            <button key={index} className="hover:text-rose-600">
              <SiCodemagic />
            </button>
          ))}
        </div>
      </div>
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
