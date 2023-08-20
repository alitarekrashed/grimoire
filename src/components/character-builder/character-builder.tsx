'use client'

import { CharacterEntity } from '@/models/db/character-entity'
import { Feature } from '@/models/db/feature'
import { Subclass } from '@/models/db/subclass'
import { PlayerCharacter, SourcedFeature } from '@/models/player-character'
import { roboto_condensed } from '@/utils/fonts'
import { cloneDeep } from 'lodash'
import { ReactNode, useContext, useEffect, useState } from 'react'
import { PlayerCharacterContext } from '../character-display/player-character-context'
import { LoadingSpinner } from '../loading-spinner/loading-spinner'
import { Modal } from '../base/modal'
import { AncestryChoiceModal } from './ancestry-choice-modal'
import { AncestryFeatChoiceModal } from './ancestry-feat.modal'
import { AttributesModal } from './attributes-modal'
import { BackgroundChoiceModal } from './background-choice-modal'
import { ClassChoiceModal } from './class-choice-modal'
import { ClassFeatChoiceModal } from './class-feat.modal'
import { HeritageChoiceModal } from './heritage-choice-modal'
import { LanguagesModal } from './languages/languages-modal'
import { SubclassChoice } from './subclass-choice'
import { MultipleSkillSelect } from './skills/multiple-skill-select'
import { SkillSelect } from './skills/skill-select'
import * as Separator from '@radix-ui/react-separator'

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
      const toReplace = updated.features.filter((sourced) =>
        matchingFunction(sourced)
      )
      toReplace.forEach((item, idx) => {
        const index = updated.features.indexOf(item)
        updated.features.splice(index, 1, features[idx])
      })
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
                  <Separator.Root
                    className="w-full bg-stone-300/50 h-px"
                    style={{ margin: '10px 0' }}
                  />
                  <div>
                    <span className="flex text-stone-300 mb-1">Level 1</span>
                    <div className="inline-flex gap-2">
                      {playerCharacter.getSubclassIfAvailable() && (
                        <div>
                          <SubclassChoice
                            onSubclassChange={handleSubclassChange}
                            onFeatureUpdate={handleFeatureUpdate(
                              (sourced) =>
                                sourced.source === 'CLASS' &&
                                sourced.feature.type === 'SUBCLASS_FEATURE' &&
                                sourced.feature.value.type === 'SKILL_SELECTION'
                            )}
                          ></SubclassChoice>
                        </div>
                      )}
                      <div>
                        <MultipleSkillSelect
                          skillFeatures={playerCharacter
                            .getLevelFeatures()
                            .filter(
                              (sourced) =>
                                sourced.source === 'CLASS' &&
                                sourced.feature.type === 'SKILL_SELECTION'
                            )
                            .map((sourced) => sourced.feature)}
                          onSkillsUpdate={(features: Feature[]) => {
                            handleFeatureUpdate(
                              (source: SourcedFeature) =>
                                source.source === 'CLASS' &&
                                source.feature.type === 'SKILL_SELECTION'
                            )(
                              features.map((feature) => {
                                return {
                                  source: 'CLASS',
                                  feature: feature,
                                }
                              })
                            )
                          }}
                        ></MultipleSkillSelect>
                      </div>
                      {playerCharacter
                        .getLevelFeatures()
                        .filter(
                          (value) => value.feature.type === 'FEAT_SELECTION'
                        )
                        .map((val: SourcedFeature, index: number) => (
                          <div key={`${val.source}-${index}`}>
                            {buildFeatChoice(val, handleFeatureUpdate)}
                          </div>
                        ))}
                    </div>
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

export function buildFeatChoice(
  sourced: SourcedFeature,
  onChange: (
    matchingFunction: (source: SourcedFeature) => boolean
  ) => (features: SourcedFeature[]) => void
) {
  switch (sourced.source) {
    case 'CLASS': {
      return (
        <ClassFeatChoiceModal
          existingFeat={sourced}
          onChange={onChange(
            (source: SourcedFeature) =>
              source.source === 'CLASS' &&
              source.feature.type === 'FEAT_SELECTION'
          )}
        ></ClassFeatChoiceModal>
      )
    }
    case 'ANCESTRY':
      return (
        <AncestryFeatChoiceModal
          existingFeat={sourced}
          onChange={onChange(
            (source: SourcedFeature) =>
              source.source === 'ANCESTRY' &&
              source.feature.type === 'FEAT_SELECTION'
          )}
        ></AncestryFeatChoiceModal>
      )
  }
}
