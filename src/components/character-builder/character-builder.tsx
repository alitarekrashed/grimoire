'use client'

import { CharacterEntity } from '@/models/db/character-entity'
import { FeatureType } from '@/models/db/feature'
import { PlayerCharacter, SourcedFeature } from '@/models/player-character'
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
import { SkillsModal } from './skills-modal'
import { ClassFeatChoiceModal } from './class-feat.modal'

export default function CharacterBuilderModal({
  playerCharacter,
  onClose,
}: {
  playerCharacter: PlayerCharacter
  onClose: (character: CharacterEntity) => void
}) {
  const [character, setCharacter] = useState<PlayerCharacter>(playerCharacter)
  const [name, setName] = useState<string>(playerCharacter.getCharacter().name)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    setCharacter(playerCharacter)
    setName(playerCharacter.getCharacter().name)
  }, [playerCharacter])

  const updatePlayerCharacter = (updated: CharacterEntity) => {
    setLoading(true)
    PlayerCharacter.build(updated).then((val) => {
      setCharacter(val)
      setLoading(false)
    })
  }

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
    updatePlayerCharacter(updated)
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

  const handleFeatureUpdate =
    (source: string, featureType: FeatureType) =>
    (features: SourcedFeature[]) => {
      let updated = cloneDeep(character.getCharacter())
      const toReplace = updated.features['1'].filter(
        (sourced) =>
          sourced.source === source && sourced.feature.type === featureType
      )
      toReplace.forEach((item) => {
        const index = updated.features['1'].indexOf(item)
        updated.features['1'].splice(index, 1)
      })
      updated.features['1'].push(...features)
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
              <div className="inline-flex gap-2">
                <div>
                  {character
                    .getLevelFeatures()
                    .filter((sourced) => sourced.source === 'ANCESTRY')
                    .map((value, index) => {
                      return (
                        <AncestryFeatChoiceModal
                          key={`${value.source}-${index}`}
                          existingFeat={value}
                          existingFeatName={
                            value.feature.value ? value.feature.value : ''
                          }
                          traits={character.getTraits()}
                          onChange={handleFeatureUpdate('ANCESTRY', 'FEAT')}
                        ></AncestryFeatChoiceModal>
                      )
                    })}
                </div>
                <div>
                  <SkillsModal
                    skillFeatures={character
                      .getLevelFeatures()
                      .filter(
                        (sourced) =>
                          sourced.source === 'CLASS' &&
                          sourced.feature.type === 'SKILL_SELECTION'
                      )}
                    // basically what we're trying to say here is "filter out Class Level 1 proficiencies when passing in existing profs"
                    // the reasoning is that since all the values for Class Level 1 profs are encapsulated within this modal, it can just
                    // check itself for its values
                    proficiencies={character.getSkills('1')}
                    onSkillsUpdate={handleFeatureUpdate(
                      'CLASS',
                      'SKILL_SELECTION'
                    )}
                  ></SkillsModal>
                </div>
                <div>
                  {character
                    .getLevelFeatures()
                    .filter(
                      (sourced) =>
                        sourced.source === 'CLASS' &&
                        sourced.feature.type === 'CLASS_FEAT_SELECTION'
                    )
                    .map((value, index) => {
                      return (
                        <ClassFeatChoiceModal
                          key={`${value.source}-${index}`}
                          existingFeat={value}
                          traits={[
                            character.getClassEntity().name.toLowerCase(),
                          ]}
                          onChange={handleFeatureUpdate(
                            'CLASS',
                            'CLASS_FEAT_SELECTION'
                          )}
                        ></ClassFeatChoiceModal>
                      )
                    })}
                </div>
              </div>
            </div>
          </div>
        }
        closeButtons={[
          {
            label: 'Save',
            onClick: () => onClose(character.getCharacter()),
            disabled: loading,
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
