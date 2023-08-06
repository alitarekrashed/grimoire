import { useEffect, useState } from 'react'
import { Modal } from '../modal/modal'
import { CharacterAncestry } from '@/models/db/character-entity'
import { Ancestry } from '@/models/db/ancestry'
import React from 'react'
import { cloneDeep } from 'lodash'
import { roboto_condensed } from '@/utils/fonts'

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
  characterAncestry,
  ancestry,
  onLanguagesUpdate,
}: {
  characterAncestry: CharacterAncestry
  ancestry: Ancestry
  onLanguagesUpdate: (languages: string[]) => void
}) {
  const [modifiedAncestry, setModifiedAncestry] = useState<CharacterAncestry>()
  const [choices, setChoices] = useState<string[]>([])

  useEffect(() => {
    setChoices(getAncestryLanguageChoices(ancestry.languages.given, ancestry))
  }, [modifiedAncestry])

  useEffect(() => {
    setModifiedAncestry(cloneDeep(characterAncestry))
  }, [characterAncestry])

  const trigger = (
    <span
      className="border border-stone-300 rounded-md relative flex w-44 h-9 p-1 justify-center items-center hover:bg-stone-600"
      tabIndex={0}
    >
      Languages
    </span>
  )

  const body = (
    <div className={`${roboto_condensed.className} p-2`}>
      {modifiedAncestry?.language_selections.map((choice: any, i: number) => {
        return (
          <React.Fragment key={i}>
            <select
              className="bg-stone-700 mr-2 rounded-md"
              value={choice ?? ''}
              onChange={(e) => {
                let updated = cloneDeep(modifiedAncestry)!
                updated.language_selections[i] = e.target.value as Attribute
                setModifiedAncestry(updated)
              }}
            >
              <option value={choice}>{choice}</option>
              {choices
                .filter(
                  (choice) =>
                    modifiedAncestry?.language_selections.includes(choice) ===
                    false
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
  console.log(modifiedAncestry)
  return (
    <Modal
      size="small"
      trigger={trigger}
      body={body}
      closeButtons={[
        {
          label: 'Save',
          onClick: () => {
            onLanguagesUpdate(modifiedAncestry?.language_selections ?? [])
          },
        },
        {
          label: 'Cancel',
          onClick: () => {
            onLanguagesUpdate(characterAncestry.language_selections)
          },
        },
      ]}
    ></Modal>
  )
}
