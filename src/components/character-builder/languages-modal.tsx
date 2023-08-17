import { Ancestry } from '@/models/db/ancestry'
import { CharacterEntity } from '@/models/db/character-entity'
import { roboto_condensed } from '@/utils/fonts'
import { cloneDeep } from 'lodash'
import React, { useContext, useEffect, useState } from 'react'
import { Modal } from '../modal/modal'
import { PlayerCharacterContext } from '../character-display/player-character-context'

function getAncestryLanguageChoices(
  knownLanguages: string[],
  ancestry: Ancestry
): string[] {
  let options = ancestry.languages.options
  options = options.filter(
    (option: string) => knownLanguages.indexOf(option) === -1
  )

  return options
}

export function LanguagesModal({
  ancestry,
  onLanguagesUpdate,
}: {
  ancestry: Ancestry
  onLanguagesUpdate: (languages: string[]) => void
}) {
  const { playerCharacter } = useContext(PlayerCharacterContext)
  const [modifiedCharacter, setModifiedCharacter] = useState<CharacterEntity>()
  const [choices, setChoices] = useState<string[]>([])

  useEffect(() => {
    setChoices(getAncestryLanguageChoices(ancestry.languages.given, ancestry))
  }, [modifiedCharacter])

  useEffect(() => {
    setModifiedCharacter(cloneDeep(playerCharacter.getCharacter()))
  }, [playerCharacter.getCharacter()])

  let totalCount = 0
  let setCount = 0
  playerCharacter.getCharacter().languages.forEach((language) => {
    totalCount += 1
    setCount += language ? 1 : 0
  })

  const trigger = (
    <button
      className="border border-stone-300 rounded-md relative flex w-44 h-9 p-1 justify-center items-center hover:bg-stone-600"
      tabIndex={0}
    >
      Languages {setCount}/{totalCount}
    </button>
  )

  const body = (
    <div className={`${roboto_condensed.className} p-2`}>
      {modifiedCharacter?.languages.map((choice: any, i: number) => {
        return (
          <React.Fragment key={i}>
            <select
              className="bg-stone-700 mr-2 rounded-md"
              value={choice ?? ''}
              onChange={(e) => {
                let updated = cloneDeep(modifiedCharacter)!
                updated.languages[i] = e.target.value as Attribute
                setModifiedCharacter(updated)
              }}
            >
              <option value={choice}>{choice}</option>
              {choices
                .filter(
                  (choice) =>
                    modifiedCharacter?.languages.includes(choice) === false
                )
                .map((language) => (
                  <option key={language} value={language}>
                    {language}
                  </option>
                ))}
            </select>
          </React.Fragment>
        )
      })}
    </div>
  )
  return (
    <Modal
      size="small"
      trigger={trigger}
      body={body}
      closeButtons={[
        {
          label: 'Save',
          onClick: () => {
            onLanguagesUpdate(modifiedCharacter?.languages ?? [])
          },
        },
        {
          label: 'Cancel',
          onClick: () => {
            onLanguagesUpdate(playerCharacter.getCharacter().languages)
          },
        },
      ]}
    ></Modal>
  )
}
