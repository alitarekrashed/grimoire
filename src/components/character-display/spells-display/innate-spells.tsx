import { useContext } from 'react'
import { PlayerCharacterContext } from '../player-character-context'
import { Separator } from '@/components/base/separator'
import { SpellInlineDisplay } from '@/components/spells/spell-inline-display'

export function InnateSpells({ spells }: { spells: Spell[] }) {
  const { playerCharacter, updateAndSaveCharacterEntity } = useContext(
    PlayerCharacterContext
  )

  return (
    <div>
      <div className="text-lg font-light flex flex-row gap-2 items-center mb-1">
        Innate
      </div>
      <Separator className="my-2"></Separator>
      <span className="text-xs">
        {spells &&
          spells.length > 0 &&
          spells.map((spell, index) => (
            <div key={`${spell}-${index}`} className="mb-3">
              <SpellInlineDisplay spell={spell}></SpellInlineDisplay>
            </div>
          ))}
      </span>
    </div>
  )
}
