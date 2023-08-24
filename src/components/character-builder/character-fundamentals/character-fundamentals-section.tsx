import { PlayerCharacterContext } from '@/components/character-display/player-character-context'
import { CharacterEntity } from '@/models/db/character-entity'
import { PlayerCharacter, SourcedFeature } from '@/models/player-character'
import { cloneDeep, toNumber } from 'lodash'
import { useContext, useEffect, useState } from 'react'
import { AncestryChoiceModal } from './ancestry-choice-modal'
import { HeritageChoiceModal } from './heritage-choice-modal'
import { BackgroundChoiceModal } from './background-choice-modal'
import { ClassChoiceModal } from './class-choice-modal'
import { AttributesModal } from '../attributes-modal'
import { LanguagesModal } from '../languages/languages-modal'
import { ChoiceSelect } from '@/components/choice-select/choice-select'

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

  const handleAncestryChange = (ancestryId: string) => {
    const load: Promise<void> = (async () => {
      const value: PlayerCharacter = await playerCharacter.updateAncestry(
        ancestryId
      )
      updatePlayerCharacter(value)
    })()
    wrapCharacterUpdate(load)
  }

  const handleHeritageChange = (heritageId: string) => {
    let updated: CharacterEntity = cloneDeep(playerCharacter!.getCharacter())
    updated.heritage_id = heritageId
    loadCharacter(updated)
  }

  const handleAttributeChange = (characterEntity: CharacterEntity) => {
    let updated: CharacterEntity = cloneDeep(playerCharacter.getCharacter())
    updated.attributes = characterEntity.attributes
    loadCharacter(updated)
  }

  const handleLanguageChange = (chosenLanguages: string[]) => {
    let updated: CharacterEntity = cloneDeep(playerCharacter.getCharacter())
    updated.languages = chosenLanguages
    loadCharacter(updated)
  }

  const handleBackgroundChange = (background: Background) => {
    const load: Promise<void> = (async () => {
      const value: PlayerCharacter = await playerCharacter.updateBackground(
        background
      )
      updatePlayerCharacter(value)
    })()
    wrapCharacterUpdate(load)
  }
  const handleFeatSubchoiceChange = (sourced: SourcedFeature) => {
    let updated = cloneDeep(playerCharacter.getCharacter())

    let indexToReplace = updated.features.findIndex(
      (sourced) =>
        sourced.source === 'BACKGROUND' && sourced.feature.type === 'FEAT'
    )

    updated.features.splice(indexToReplace, 1, sourced)

    loadCharacter(updated)
  }

  const handleClassChange = (classEntity: ClassEntity) => {
    const load: Promise<void> = (async () => {
      const value: PlayerCharacter = await playerCharacter.updateClass(
        classEntity
      )
      updatePlayerCharacter(value)
    })()
    wrapCharacterUpdate(load)
  }

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
        <AncestryChoiceModal
          onAncestryEdit={handleAncestryChange}
        ></AncestryChoiceModal>
      </div>
      <div>
        <HeritageChoiceModal
          onHeritageChange={handleHeritageChange}
        ></HeritageChoiceModal>
      </div>
      <div>
        <BackgroundChoiceModal
          onBackgroundChange={handleBackgroundChange}
          onFeatSubchoiceChange={handleFeatSubchoiceChange}
        ></BackgroundChoiceModal>
      </div>
      <div>
        <ClassChoiceModal onClassChange={handleClassChange}></ClassChoiceModal>
      </div>
      <div>
        <AttributesModal
          onAttributeUpdate={handleAttributeChange}
        ></AttributesModal>
      </div>
      <div>
        <LanguagesModal
          onLanguagesUpdate={handleLanguageChange}
          ancestry={playerCharacter.getAncestry()}
        ></LanguagesModal>
      </div>
      <div>
        <ChoiceSelect
          value={playerCharacter.getCharacter().level.toString()}
          title="Level"
          options={['1', '2', '3']}
          onChange={(val: string) => {
            let updated: CharacterEntity = cloneDeep(
              playerCharacter!.getCharacter()
            )
            updated.level = toNumber(val)
            loadCharacter(updated)
          }}
        ></ChoiceSelect>
      </div>
    </div>
  )
}
