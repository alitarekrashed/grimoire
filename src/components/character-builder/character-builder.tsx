'use client'

import { CharacterEntity } from '@/models/db/character-entity'
import { ClassEntity } from '@/models/db/class-entity'
import { PlayerCharacter } from '@/models/player-character'
import { roboto_condensed } from '@/utils/fonts'
import { cloneDeep } from 'lodash'
import { ReactNode, useContext, useEffect, useState } from 'react'
import { Modal } from '../base/modal'
import { PlayerCharacterContext } from '../character-display/player-character-context'
import { LoadingSpinner } from '../loading-spinner/loading-spinner'
import { AncestryChoiceModal } from './ancestry-choice-modal'
import { AttributesModal } from './attributes-modal'
import { BackgroundChoiceModal } from './background-choice-modal'
import { ClassChoiceModal } from './class-choice-modal'
import { HeritageChoiceModal } from './heritage-choice-modal'
import { LanguagesModal } from './languages/languages-modal'
import { LevelSection } from './level-section'

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

  const executeWithLoad = (promise: Promise<any>) => {
    setLoading(true)
    promise.then(() => setLoading(false))
  }

  const loadCharacter = (updated: CharacterEntity) => {
    const load: Promise<void> = (async () => {
      const value: PlayerCharacter = await PlayerCharacter.build(updated)
      updatePlayerCharacter(value)
    })()
    executeWithLoad(load)
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
    executeWithLoad(load)
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
    const load: Promise<void> = (async () => {
      const value: PlayerCharacter = await playerCharacter.updateBackground(
        backgroundId
      )
      updatePlayerCharacter(value)
    })()
    executeWithLoad(load)
  }

  const handleClassChange = (classEntity: ClassEntity) => {
    const load: Promise<void> = (async () => {
      const value: PlayerCharacter = await playerCharacter.updateClass(
        classEntity
      )
      updatePlayerCharacter(value)
    })()
    executeWithLoad(load)
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
                  {[...Array(playerCharacter.getCharacter().level)].map(
                    (_, i) => {
                      // TODO candidate for context/provider?
                      const level = i + 1
                      return (
                        <LevelSection
                          key={`level-${level}`}
                          level={level}
                          loadCharacter={loadCharacter}
                          executeWithLoad={executeWithLoad}
                        ></LevelSection>
                      )
                    }
                  )}
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
