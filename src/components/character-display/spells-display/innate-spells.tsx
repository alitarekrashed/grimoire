import { useContext } from 'react'
import { PlayerCharacterContext } from '../player-character-context'
import { Separator } from '@/components/base/separator'
import { SpellInlineDisplay } from '@/components/spells/spell-inline-display'
import { SpellcastingProficiencies } from '@/utils/services/spellcasting-manager'

export function InnateSpells({ spells }: { spells: Spell[] }) {
  const { playerCharacter, updateAndSaveCharacterEntity } = useContext(
    PlayerCharacterContext
  )

  const proficiencies: SpellcastingProficiencies = playerCharacter
    .getSpellcastingManager()
    .getSpellcasting('innate')

  return (
    <div>
      <div className="text-lg font-light flex flex-row gap-2 items-center mb-1">
        <div className="flex flex-col gap-1 text-center">
          <span className="leading-4">Innate</span>
          <span className="text-[8px] capitalize leading-3">
            {
              playerCharacter
                .getSpellcastingManager()
                .getTypeDefinition('innate')?.attribute
            }
          </span>
        </div>
        <span className="rounded border py-0.5 px-1 text-xs">
          Spell attack: +{proficiencies.attack.modifier}
        </span>
        <span className="rounded border py-0.5 px-1 text-xs">
          Saving throw: +{proficiencies.savingThrow.modifier}
        </span>
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
