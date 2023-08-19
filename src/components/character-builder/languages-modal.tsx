import { Ancestry, Attribute } from '@/models/db/ancestry'
import { CharacterEntity } from '@/models/db/character-entity'
import { roboto_condensed } from '@/utils/fonts'
import { cloneDeep } from 'lodash'
import React, { useContext, useEffect, useState } from 'react'
import { Modal } from '../modal/modal'
import { PlayerCharacterContext } from '../character-display/player-character-context'
import { ChoiceSelect } from '../choice-select/choice-select'

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
    <div className={`inline-flex gap-2 ${roboto_condensed.className} p-2`}>
      {modifiedCharacter?.languages.map((choice: any, i: number) => {
        return (
          <ChoiceSelect
            key={i}
            value={choice}
            title={`Language #${i + 1}`}
            options={choices.filter((val) => {
              if (val === choice) {
                return true
              }
              return modifiedCharacter?.languages.includes(val) === false
            })}
            onChange={(val: string) => {
              let updated = cloneDeep(modifiedCharacter)!
              updated.languages[i] = val
              setModifiedCharacter(updated)
            }}
          ></ChoiceSelect>
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
