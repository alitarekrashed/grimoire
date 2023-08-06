import {
  AttributeOptions,
  AttributeSelections,
} from '@/models/player-character'
import { Modal } from '../modal/modal'
import React, { useEffect, useState } from 'react'
import { roboto_condensed } from '@/utils/fonts'
import { CharacterAncestry } from '@/models/db/character-entity'
import { Ancestry, Attribute } from '@/models/db/ancestry'
import { clone, cloneDeep } from 'lodash'

const ATTRIBUTES: Attribute[] = [
  'Strength',
  'Dexterity',
  'Constitution',
  'Intelligence',
  'Wisdom',
  'Charisma',
]

function getAncestryAttributeChoices(
  characterAncestry: CharacterAncestry,
  ancestry: Ancestry
) {
  if (characterAncestry.free_attribute === false) {
    return getAncestryDefaultAttributeChoices(characterAncestry, ancestry)
  } else {
    return getAncestryFreeAttributeChoices(characterAncestry)
  }
}

function getAncestryDefaultAttributeChoices(
  characterAncestry: CharacterAncestry,
  ancestry: Ancestry
) {
  let options: Attribute[][] = ancestry.attribute_boosts
    .filter((choices) => choices.length)
    .filter((choices) => choices[0] === 'Free')
    .map(() => [...ATTRIBUTES])

  for (let i = 0; i < options.length; i++) {
    options[i] = options[i].filter(
      (option: any) =>
        ancestry.attribute_boosts
          .filter((attribute) => attribute.length === 1)
          .map((attribute: AttributeModifier[]) => attribute[0])
          .indexOf(option) === -1 &&
        characterAncestry.attribute_boost_selections.indexOf(option) === -1
    )
  }
  return options
}

function getAncestryFreeAttributeChoices(characterAncestry: CharacterAncestry) {
  let options: Attribute[][] = [[...ATTRIBUTES], [...ATTRIBUTES]]

  for (let i = 0; i < options.length; i++) {
    options[i] = options[i].filter((option: any) => {
      return characterAncestry.attribute_boost_selections.indexOf(option) === -1
    })
  }
  return options
}

export function AttributesModal({
  onAttributeUpdate,
  characterAncestry,
  ancestry,
}: {
  onAttributeUpdate: (value: CharacterAncestry) => void
  characterAncestry: CharacterAncestry
  ancestry: Ancestry
}) {
  const [modifiedAncestry, setModifiedAncestry] =
    useState<CharacterAncestry>(characterAncestry)
  const [choices, setChoices] = useState<Attribute[][]>(
    getAncestryAttributeChoices(modifiedAncestry, ancestry)
  )

  const trigger = (
    <span
      className="border border-stone-300 rounded-md relative flex w-44 h-9 p-1 justify-center items-center hover:bg-stone-600"
      tabIndex={0}
    >
      Attributes
    </span>
  )

  useEffect(() => {
    console.log(getAncestryAttributeChoices(modifiedAncestry, ancestry))
    setChoices(getAncestryAttributeChoices(modifiedAncestry, ancestry))
  }, [modifiedAncestry])

  const body = (
    <>
      <div className={`${roboto_condensed.className} text-sm p-2`}>
        <div className="w-fit flex items-center h-fit">
          <label>
            <input
              className="bg-stone-700 mt-0.5"
              type="checkbox"
              checked={modifiedAncestry.free_attribute}
              onChange={(e) => {
                let updated = cloneDeep(modifiedAncestry)
                updated.free_attribute = !modifiedAncestry.free_attribute
                if (updated.free_attribute) {
                  updated.attribute_boost_selections = [undefined!, undefined!]
                } else {
                  updated.attribute_boost_selections = [undefined!]
                }
                setModifiedAncestry(updated)
              }}
            />
            <span className="mr-2 float-left">
              Freely assign ancestry attributes
            </span>
          </label>
        </div>
        <span>
          <span>Attributes</span>
          {modifiedAncestry.attribute_boost_selections.map(
            (choice: any, i: number) => {
              return (
                <React.Fragment key={i}>
                  <select
                    className="bg-stone-700 mr-2 rounded-md"
                    value={choice ?? ''}
                    onChange={(e) => {
                      let updated = cloneDeep(modifiedAncestry)
                      updated.attribute_boost_selections[i] = e.target
                        .value as Attribute
                      setModifiedAncestry(updated)
                    }}
                  >
                    <option value={choice}>{choice}</option>
                    {choices[i]?.map((attribute) => (
                      <option key={attribute} value={attribute}>
                        {attribute}
                      </option>
                    ))}
                  </select>
                </React.Fragment>
              )
            }
          )}
        </span>
      </div>
    </>
  )
  return (
    <Modal
      trigger={trigger}
      body={body}
      closeButtons={[
        {
          label: 'Save',
          onClick: () => {
            onAttributeUpdate(modifiedAncestry)
          },
        },
        {
          label: 'Cancel',
          onClick: () => {
            setModifiedAncestry(characterAncestry)
          },
        },
      ]}
    ></Modal>
  )
}
