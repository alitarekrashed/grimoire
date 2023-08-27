import { Spell } from '@/models/db/spell'
import { SpellInlineDisplay } from '../spells/spell-inline-display'

export function FocusSpells({ spells }: { spells: Spell[] }) {
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
