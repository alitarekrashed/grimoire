'use client'

import { CharacterEntity } from '@/models/db/character-entity'
import { FeatureType, SubclassFeatureValue } from '@/models/db/feature'
import { PlayerCharacter, SourcedFeature } from '@/models/player-character'
import { roboto_condensed } from '@/utils/fonts'
import { cloneDeep, update } from 'lodash'
import { ReactNode, useContext, useEffect, useState } from 'react'
import { Modal } from '../modal/modal'
import { AncestryChoiceModal } from './ancestry-choice-modal'
import { AncestryFeatChoiceModal } from './ancestry-feat.modal'
import { AttributesModal } from './attributes-modal'
import { BackgroundChoiceModal } from './background-choice-modal'
import { HeritageChoiceModal } from './heritage-choice-modal'
import { LanguagesModal } from './languages-modal'
import { SkillsModal } from './skills-modal'
import { ClassFeatChoiceModal } from './class-feat.modal'
import { LoadingSpinner } from '../loading-spinner/loading-spinner'
import { ClassChoiceModal } from './class-choice-modal'
import { PlayerCharacterContext } from '../character-display/player-character-context'
import { Subclass } from '@/models/db/subclass'
import { SubclassChoiceModal } from './subclass-choice-modal'

export default function CharacterBuilderModal({
  trigger,
  initialValue,
  onClose,
  onCancel,
}: {
  trigger: ReactNode
  initialValue: PlayerCharacter
  onClose: (character: CharacterEntity) => void
  onCancel?: () => void
}) {
  const { playerCharacter, updatePlayerCharacter } = useContext(
    PlayerCharacterContext
  )
  const [name, setName] = useState<string>()
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    updatePlayerCharacter(initialValue)
  }, [initialValue])

  useEffect(() => {
    if (playerCharacter) {
      updatePlayerCharacter(playerCharacter)
      setName(playerCharacter.getCharacter().name)
    }
  }, [playerCharacter])

  const loadCharacter = (updated: CharacterEntity) => {
    setLoading(true)
    PlayerCharacter.build(updated).then((val) => {
      updatePlayerCharacter(val)
      setLoading(false)
    })
  }

  const updateName = (value: string) => {
    setName(value)
    playerCharacter.getCharacter().name = value
  }

  const handleAncestryChange = (ancestryId: string) => {
    setLoading(true)
    playerCharacter.updateAncestry(ancestryId).then((val) => {
      updatePlayerCharacter(val)
      setLoading(false)
    })
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

  const handleBackgroundChange = (backgroundId: string) => {
    setLoading(true)
    playerCharacter.updateBackground(backgroundId).then((val) => {
      updatePlayerCharacter(val)
      setLoading(false)
    })
  }

  const handleClassChange = (classEntity: classEntity) => {
    setLoading(true)
    playerCharacter.updateClass(classEntity).then((val) => {
      updatePlayerCharacter(val)
      setLoading(false)
    })
  }

  const handleSubclassChange = (subclass: Subclass) => {
    setLoading(true)
    playerCharacter.updateSubclass(subclass).then((val) => {
      updatePlayerCharacter(val)
      setLoading(false)
    })
  }

  const handleFeatureUpdate =
    (matchingFunction: (source: SourcedFeature) => boolean) =>
    (features: SourcedFeature[]) => {
      let updated = cloneDeep(playerCharacter.getCharacter())
      const toReplace = updated.features['1'].filter((sourced) =>
        matchingFunction(sourced)
      )
      toReplace.forEach((item) => {
        const index = updated.features['1'].indexOf(item)
        updated.features['1'].splice(index, 1)
      })
      updated.features['1'].push(...features)
      loadCharacter(updated)
    }

  return (
    playerCharacter && (
      <>
        <Modal
          size="large"
          trigger={trigger}
          body={
            <>
              <LoadingSpinner loading={loading}></LoadingSpinner>
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
                        onAncestryEdit={handleAncestryChange}
                      ></AncestryChoiceModal>
                    </div>
                    <div className="mr-2">
                      <HeritageChoiceModal
                        onHeritageChange={handleHeritageChange}
                      ></HeritageChoiceModal>
                    </div>
                    <div className="mr-2">
                      <BackgroundChoiceModal
                        onBackgroundChange={handleBackgroundChange}
                      ></BackgroundChoiceModal>
                    </div>
                    <div className="mr-2">
                      <ClassChoiceModal
                        onClassChange={handleClassChange}
                      ></ClassChoiceModal>
                    </div>
                    <div className="mr-2">
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
                  </div>
                  <div className="inline-flex gap-2">
                    <div>
                      {playerCharacter
                        .getLevelFeatures()
                        .filter((sourced) => sourced.source === 'ANCESTRY')
                        .map((value, index) => {
                          return (
                            <AncestryFeatChoiceModal
                              key={`${value.source}-${value.feature}-${index}`}
                              existingFeat={value}
                              existingFeatName={
                                value.feature.value ? value.feature.value : ''
                              }
                              onChange={handleFeatureUpdate(
                                (source: SourcedFeature) =>
                                  source.source === 'ANCESTRY' &&
                                  source.feature.type === 'FEAT'
                              )}
                            ></AncestryFeatChoiceModal>
                          )
                        })}
                    </div>
                    <div>
                      <SkillsModal
                        skillFeatures={playerCharacter
                          .getLevelFeatures()
                          .filter(
                            (sourced) =>
                              sourced.source === 'CLASS' &&
                              sourced.feature.type === 'SKILL_SELECTION'
                          )}
                        // basically what we're trying to say here is "filter out Class Level 1 proficiencies when passing in existing profs"
                        // the reasoning is that since all the values for Class Level 1 profs are encapsulated within this modal, it can just
                        // check itself for its values
                        proficiencies={playerCharacter.getSkills('1')}
                        onSkillsUpdate={handleFeatureUpdate(
                          (source: SourcedFeature) =>
                            source.source === 'CLASS' &&
                            source.feature.type === 'SKILL_SELECTION'
                        )}
                      ></SkillsModal>
                    </div>
                    <div>
                      {playerCharacter
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
                              onChange={handleFeatureUpdate(
                                (source: SourcedFeature) =>
                                  source.source === 'CLASS' &&
                                  source.feature.type === 'CLASS_FEAT_SELECTION'
                              )}
                            ></ClassFeatChoiceModal>
                          )
                        })}
                    </div>
                    {playerCharacter.getSubclassIfAvaialable() && (
                      <div>
                        <SubclassChoiceModal
                          onSubclassChange={handleSubclassChange}
                        ></SubclassChoiceModal>
                        {playerCharacter
                          .getLevelFeatures()
                          .filter(
                            (sourced) =>
                              sourced.source === 'CLASS' &&
                              sourced.feature.type === 'SUBCLASS_FEATURE' &&
                              sourced.feature.value.feature?.type ===
                                'SKILL_SELECTION'
                          ).length > 0 && (
                          <SkillsModal
                            skillFeatures={playerCharacter
                              .getLevelFeatures()
                              .filter(
                                (sourced) =>
                                  sourced.source === 'CLASS' &&
                                  sourced.feature.type === 'SUBCLASS_FEATURE' &&
                                  sourced.feature.value.feature.type ===
                                    'SKILL_SELECTION'
                              )
                              .map((sourced) => {
                                return {
                                  source: '',
                                  feature: sourced.feature.value.feature,
                                }
                              })}
                            // basically what we're trying to say here is "filter out Class Level 1 proficiencies when passing in existing profs"
                            // the reasoning is that since all the values for Class Level 1 profs are encapsulated within this modal, it can just
                            // check itself for its values
                            proficiencies={playerCharacter.getSkills('1')}
                            onSkillsUpdate={(features: SourcedFeature[]) => {
                              const newFeatures: SourcedFeature[] =
                                features.map((value) => {
                                  return {
                                    source: 'CLASS',
                                    feature: {
                                      type: 'SUBCLASS_FEATURE',
                                      value: {
                                        name: value.feature.name,
                                        feature: value.feature,
                                      },
                                    },
                                  }
                                })
                              handleFeatureUpdate(
                                (sourced) =>
                                  sourced.source === 'CLASS' &&
                                  sourced.feature.type === 'SUBCLASS_FEATURE' &&
                                  sourced.feature.value.feature.type ===
                                    'SKILL_SELECTION'
                              )(newFeatures)
                            }}
                          ></SkillsModal>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          }
          closeButtons={[
            {
              label: 'Save',
              onClick: () => onClose(playerCharacter.getCharacter()),
              disabled: loading,
            },
            {
              label: 'Cancel',
              onClick: () => {
                updatePlayerCharacter(initialValue)
                onCancel && onCancel()
              },
            },
          ]}
        ></Modal>
      </>
    )
  )
}
