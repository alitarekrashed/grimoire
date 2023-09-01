import { PlayerCharacterContext } from '@/components/character-display/player-character-context'
import { ChoiceSelect } from '@/components/choice-select/choice-select'
import { CharacterEntity } from '@/models/db/character-entity'
import { SpellcastingDefinition } from '@/models/db/class-entity'
import { Spell } from '@/models/db/spell'
import { retrieveEntityByNames } from '@/utils/services/reference-lookup.service'
import { useContext, useEffect, useState } from 'react'

export function SpellcastingTraditionChoice({
  spellcastingDefinition,
  onUpdate,
}: {
  spellcastingDefinition: SpellcastingDefinition
  onUpdate: (updateFunction: (cloned: CharacterEntity) => void) => void
}) {
  const { playerCharacter } = useContext(PlayerCharacterContext)
  const [meetsCondition, setMeetsCondition] = useState<boolean>(false)

  useEffect(() => {
    if (spellcastingDefinition?.condition) {
      retrieveEntityByNames(
        playerCharacter.getSpells().map((val) => val.feature.value.name),
        'SPELL'
      ).then((val) => {
        const focusSpells = (val as unknown as Spell[])
          .map((spell: Spell) => spell.focus)
          .filter((focus) => focus)
        if (
          focusSpells.length > 0 &&
          focusSpells.includes(spellcastingDefinition.condition)
        ) {
          setMeetsCondition(true)
        } else {
          setMeetsCondition(false)
        }
      })
    }
  }, [playerCharacter, spellcastingDefinition?.condition])

  return (
    <>
      {spellcastingDefinition && meetsCondition && (
        <ChoiceSelect
          value={spellcastingDefinition.tradition.value}
          title={`${spellcastingDefinition.type} tradition`}
          options={spellcastingDefinition.tradition.options!}
          onChange={(e) => {
            const updateFunction = (updated: CharacterEntity) => {
              updated.spellcasting.find(
                (val) => val.value.type === spellcastingDefinition.type
              )!.value.tradition.value = e as Tradition
            }
            onUpdate(updateFunction)
          }}
        ></ChoiceSelect>
      )}
    </>
  )
}
