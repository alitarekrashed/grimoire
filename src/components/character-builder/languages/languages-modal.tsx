import { Ancestry } from '@/models/db/ancestry'
import { CharacterEntity } from '@/models/db/character-entity'
import { roboto_condensed } from '@/utils/fonts'
import { cloneDeep } from 'lodash'
import { useContext, useEffect, useState } from 'react'
import { Modal } from '../../base/modal'
import { PlayerCharacterContext } from '../../character-display/player-character-context'
import { LanguageSelect } from './language-select'
import { OptionInlineIndicator } from '@/components/indicators/indicator'

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
  onUpdate,
}: {
  ancestry: Ancestry
  onUpdate: (updateFunction: (cloned: CharacterEntity) => void) => void
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
      className="border border-stone-300 rounded-md relative flex w-full h-9 p-1 justify-center items-center hover:bg-stone-600"
      tabIndex={0}
    >
      <div className="flex items-center">
        <span>
          Languages {setCount}/{totalCount}
        </span>
        {setCount < totalCount && <OptionInlineIndicator />}
      </div>
    </button>
  )

  const body = (
    <div className={`grid grid-cols-4 gap-2 ${roboto_condensed.className} p-2`}>
      {modifiedCharacter?.languages.map((choice: any, i: number) => {
        return (
          <LanguageSelect
            key={`language-${i}`}
            value={choice}
            languages={choices}
            alreadyChosenLanguages={modifiedCharacter?.languages}
            title={`Language #${i + 1}`}
            onChange={(val: string) => {
              let updated = cloneDeep(modifiedCharacter)!
              updated.languages[i] = val
              setModifiedCharacter(updated)
            }}
          ></LanguageSelect>
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
            onUpdate(
              (character: CharacterEntity) =>
                (character.languages = modifiedCharacter?.languages ?? [])
            )
          },
        },
        {
          label: 'Cancel',
          onClick: () => {
            setModifiedCharacter(playerCharacter.getCharacter())
          },
        },
      ]}
    ></Modal>
  )
}
