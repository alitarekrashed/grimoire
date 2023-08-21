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
import { AncestryChoiceModal } from './character-fundamentals/ancestry-choice-modal'
import { AttributesModal } from './attributes-modal'
import { BackgroundChoiceModal } from './character-fundamentals/background-choice-modal'
import { ClassChoiceModal } from './character-fundamentals/class-choice-modal'
import { HeritageChoiceModal } from './character-fundamentals/heritage-choice-modal'
import { LanguagesModal } from './languages/languages-modal'
import { LevelSection } from './level/level-section'
import { CharacterFundamentalsSection } from './character-fundamentals/character-fundamentals-section'
import { CharacterLevelContext } from './character-level-context'

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
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    updatePlayerCharacter(initialValue)
  }, [initialValue])

  const loadBuilderWhileExecuting = (promise: Promise<any>) => {
    setLoading(true)
    promise.then(() => setLoading(false))
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
                  <CharacterFundamentalsSection
                    wrapCharacterUpdate={loadBuilderWhileExecuting}
                  ></CharacterFundamentalsSection>
                  {[...Array(playerCharacter.getCharacter().level)].map(
                    (_, i) => (
                      <CharacterLevelContext.Provider
                        key={`level-${i + 1}`}
                        value={{ level: i + 1 }}
                      >
                        <LevelSection
                          wrapCharacterUpdate={loadBuilderWhileExecuting}
                        ></LevelSection>
                      </CharacterLevelContext.Provider>
                    )
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
