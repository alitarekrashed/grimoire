'use client'

import { CharacterEntity } from '@/models/db/character-entity'
import { Feat } from '@/models/db/feat'
import { PlayerCharacter } from '@/models/player-character'
import { roboto_condensed } from '@/utils/fonts'
import { cloneDeep } from 'lodash'
import { useEffect, useState } from 'react'
import { Modal } from '../modal/modal'
import { AncestryChoiceModal } from './ancestry-choice-modal'
import { AncestryFeatChoiceModal } from './ancestry-feat.modal'
import { AttributesModal } from './attributes-modal'
import { BackgroundChoiceModal } from './background-choice-modal'
import { HeritageChoiceModal } from './heritage-choice-modal'
import { LanguagesModal } from './languages-modal'

export default function CharacterBuilderModal({
  playerCharacter,
  onClose,
}: {
  playerCharacter: PlayerCharacter
  onClose: (character: CharacterEntity) => void
}) {
  const [character, setCharacter] = useState<PlayerCharacter>(playerCharacter)
  const [name, setName] = useState<string>(playerCharacter.getCharacter().name)

  useEffect(() => {
    setCharacter(playerCharacter)
    setName(playerCharacter.getCharacter().name)
  }, [playerCharacter])

  const updateName = (value: string) => {
    setName(value)
    character.getCharacter().name = value
  }

  const handleAncestryChange = (ancestryId: string) => {
    character.updateAncestry(ancestryId).then((val) => {
      setCharacter(val)
    })
  }

  const handleHeritageChange = (heritageId: string) => {
    let updated: CharacterEntity = cloneDeep(character!.getCharacter())
    updated.heritage_id = heritageId
    PlayerCharacter.build(updated).then((val) => {
      setCharacter(val)
    })
  }

  const handleAttributeChange = (characterEntity: CharacterEntity) => {
    let updated: CharacterEntity = cloneDeep(character.getCharacter())
    updated.attributes = characterEntity.attributes
    PlayerCharacter.build(updated).then((val) => {
      setCharacter(val)
    })
  }

  const handleLanguageChange = (chosenLanguages: string[]) => {
    let updated: CharacterEntity = cloneDeep(character.getCharacter())
    updated.languages = chosenLanguages
    PlayerCharacter.build(updated).then((val) => {
      setCharacter(val)
    })
  }

  const handleBackgroundChange = (backgroundId: string) => {
    character.updateBackground(backgroundId).then((val) => {
      setCharacter(val)
    })
  }

  const handleFeatChange = (index: number) => (feat: Feat) => {
    let updated = cloneDeep(character.getCharacter())
    if (feat) {
      updated.features['1'][index].feature.value = feat.name
    } else {
      updated.features['1'][index].feature.value = undefined!
    }
    PlayerCharacter.build(updated).then((val) => {
      setCharacter(val)
    })
  }

  return (
    <>
      <Modal
        size="large"
        trigger={
          <span
            className="text-[9px] border p-0.5 rounded-sm hover:bg-stone-600"
            tabIndex={0}
          >
            EDIT
          </span>
        }
        body={
          <div className="p-2">
            <div className={`text-sm ${roboto_condensed.className}`}>
              <div className="mb-2 inline-flex">
                <div className="relative w-44 h-9 mr-2">
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
                <div className="mr-2">
                  <AncestryChoiceModal
                    ancestryId={character.getAncestryId()}
                    onAncestryEdit={handleAncestryChange}
                  ></AncestryChoiceModal>
                </div>
                <div className="mr-2">
                  <HeritageChoiceModal
                    heritageId={character.getHeritageId()}
                    ancestry={character.getAncestry()}
                    onHeritageChange={handleHeritageChange}
                  ></HeritageChoiceModal>
                </div>
                <div className="mr-2">
                  <BackgroundChoiceModal
                    backgroundId={character.getBackgroundId()}
                    onBackgroundChange={handleBackgroundChange}
                  ></BackgroundChoiceModal>
                </div>
                <div className="mr-2">
                  <AttributesModal
                    characterEntity={character.getCharacter()}
                    ancestry={character.getAncestry()}
                    background={character.getBackground()}
                    classEntity={character.getClassEntity()}
                    onAttributeUpdate={handleAttributeChange}
                  ></AttributesModal>
                </div>
                <div>
                  <LanguagesModal
                    onLanguagesUpdate={handleLanguageChange}
                    character={character.getCharacter()}
                    ancestry={character.getAncestry()}
                  ></LanguagesModal>
                </div>
              </div>
              <div>
                {character
                  .getLevelFeatures()
                  .filter((sourced) => sourced.source === 'ANCESTRY')
                  .map((value, index) => {
                    return (
                      <AncestryFeatChoiceModal
                        key={`${value.source}-${index}`}
                        existingFeatName={
                          value.feature.value ? value.feature.value : ''
                        }
                        traits={character.getTraits()}
                        onChange={handleFeatChange(index)}
                      ></AncestryFeatChoiceModal>
                    )
                  })}
              </div>
            </div>
            <div className="mb-128"></div>
          </div>
        }
        closeButtons={[
          {
            label: 'Save',
            onClick: () => onClose(character.getCharacter()),
          },
          {
            label: 'Cancel',
            onClick: () => setCharacter(playerCharacter),
          },
        ]}
      ></Modal>
    </>
  )
}
