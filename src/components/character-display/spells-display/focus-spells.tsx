import { Spell } from '@/models/db/spell'
import { SpellInlineDisplay } from '../../spells/spell-inline-display'
import { SpellSlot } from './spell-slot'

export function FocusSpells({ spells }: { spells: Spell[] }) {
  const focusPool: number = Math.min(spells.length, 3)
  const options: { checked: boolean }[] = []

  for (let i = 0; i < focusPool; i++) {
    options.push({ checked: false })
  }

  return (
    <div>
      <div className="text-lg font-light flex flex-row gap-2 items-center">
        Focus
        <div className="flex flex-row gap-1">
          {options.map((value, index) => (
            <SpellSlot
              key={index}
              initial={options[index].checked}
              onClick={(checked: boolean) => {
                options[index].checked = checked
              }}
            ></SpellSlot>
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
