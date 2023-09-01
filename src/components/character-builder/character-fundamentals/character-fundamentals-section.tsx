import { PlayerCharacterContext } from '@/components/character-display/player-character-context'
import { CharacterEntity } from '@/models/db/character-entity'
import { PlayerCharacter, SourcedFeature } from '@/models/player-character'
import { cloneDeep, toNumber } from 'lodash'
import { useContext, useEffect, useState } from 'react'
import { AttributesModal } from '../attributes-modal'
import { LanguagesModal } from '../languages/languages-modal'
import { AncestryChoiceModal } from './ancestry-choice-modal'
import { BackgroundChoiceModal } from './background-choice-modal'
import { ClassChoiceModal } from './class-choice-modal'
import { HeritageChoiceModal } from './heritage-choice-modal'
import { LevelSelect } from './level-select'
import { ChoiceSelect } from '@/components/choice-select/choice-select'
import { Tradition } from '@/models/db/spell'
import { SpellcastingDefinition } from '@/models/db/class-entity'
import { SpellFeatureValue } from '@/models/db/feature'
import { SpellcastingTraditionChoice } from './spellcasting-tradition-choice'

export function CharacterFundamentalsSection({
  wrapCharacterUpdate,
}: {
  wrapCharacterUpdate: (promise: Promise<void>) => void
}) {
  const { playerCharacter, updatePlayerCharacter } = useContext(
    PlayerCharacterContext
  )

  const [name, setName] = useState<string>(playerCharacter.getCharacter().name)

  useEffect(() => {
    if (playerCharacter) {
      updatePlayerCharacter(playerCharacter)
      setName(playerCharacter.getCharacter().name)
    }
  }, [playerCharacter])

  const loadCharacter = (updated: CharacterEntity) => {
    const load: Promise<void> = (async () => {
      updatePlayerCharacter(await PlayerCharacter.build(updated))
    })()
    wrapCharacterUpdate(load)
  }

  const updateName = (value: string) => {
    setName(value)
    playerCharacter.getCharacter().name = value
  }

  const handleUpdate = (updateFunction: (cloned: CharacterEntity) => void) => {
    const updated = cloneDeep(playerCharacter.getCharacter())
    updateFunction(updated)
    loadCharacter(updated)
  }

  const spellcastingChoice = playerCharacter
    .getCharacter()
    .spellcasting.find((val) => val.value?.tradition?.options)

  return (
    <div className="mb-2 grid grid-cols-7 gap-2">
      <div className="relative h-9">
        <span className="text-stone-300 absolute top-0 text-[9px] pl-1.5">
          Name
        </span>
        <input
          className="absolute bottom-0 bg-transparent rounded-md h-full w-full pt-4 pl-1 border border-stone-300"
          value={name}
          onChange={(e) => {
            updateName(e.target.value)
          }}
        ></input>
      </div>
      <div>
        <AncestryChoiceModal onUpdate={handleUpdate}></AncestryChoiceModal>
      </div>
      <div>
        <HeritageChoiceModal onUpdate={handleUpdate}></HeritageChoiceModal>
      </div>
      <div>
        <BackgroundChoiceModal onUpdate={handleUpdate}></BackgroundChoiceModal>
      </div>
      <div>
        <ClassChoiceModal onUpdate={handleUpdate}></ClassChoiceModal>
      </div>
      <div>
        <AttributesModal onUpdate={handleUpdate}></AttributesModal>
      </div>
      <div>
        <LanguagesModal
          onUpdate={handleUpdate}
          ancestry={playerCharacter.getAncestry()}
        ></LanguagesModal>
      </div>
      <div>
        <LevelSelect onUpdate={handleUpdate}></LevelSelect>
      </div>
      <div>
        <SpellcastingTraditionChoice
          spellcastingDefinition={spellcastingChoice?.value}
        ></SpellcastingTraditionChoice>
      </div>
    </div>
  )
}
