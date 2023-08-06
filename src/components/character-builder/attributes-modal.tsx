import {
  AttributeOptions,
  AttributeSelections,
} from '@/models/player-character'
import { Modal } from '../modal/modal'
import React, { useEffect, useState } from 'react'
import { roboto_condensed } from '@/utils/fonts'
import {
  CharacterAncestry,
  CharacterBackground,
} from '@/models/db/character-entity'
import { Ancestry, Attribute, AttributeModifier } from '@/models/db/ancestry'
import { clone, cloneDeep } from 'lodash'
import { Background } from '@/models/db/background'

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

function getBackgroundAttributeChoices(
  characterBackground: CharacterBackground,
  background: Background
) {
  let options: Attribute[][] = background.attributes.map(
    (choices: AttributeModifier[]) => {
      if (choices.length === 1 && choices[0] === 'Free') {
        return [...ATTRIBUTES]
      } else {
        return choices as Attribute[]
      }
    }
  )

  for (let i = 0; i < options.length; i++) {
    options[i] = options[i].filter(
      (option: Attribute) =>
        characterBackground.attribute_boost_selections.indexOf(option) === -1
    )
  }

  return options
}

export function AttributesModal({
  onAttributeUpdate,
  characterAncestry,
  characterBackground,
  ancestry,
  background,
}: {
  onAttributeUpdate: (
    characterAncestry: CharacterAncestry,
    characterBackground: CharacterBackground
  ) => void
  characterAncestry: CharacterAncestry
  characterBackground: CharacterBackground
  ancestry: Ancestry
  background: Background
}) {
  const [modifiedAncestry, setModifiedAncestry] =
    useState<CharacterAncestry>(characterAncestry)
  const [modifiedBackground, setModifiedBackground] =
    useState<CharacterBackground>(characterBackground)

  const [choices, setChoices] = useState<AttributeOptions>({
    ancestry: getAncestryAttributeChoices(modifiedAncestry, ancestry),
    background: getBackgroundAttributeChoices(modifiedBackground, background),
  })

  const trigger = (
    <span
      className="border border-stone-300 rounded-md relative flex w-44 h-9 p-1 justify-center items-center hover:bg-stone-600"
      tabIndex={0}
    >
      Attributes
    </span>
  )

  useEffect(() => {
    setChoices({
      ancestry: getAncestryAttributeChoices(modifiedAncestry, ancestry),
      background: getBackgroundAttributeChoices(modifiedBackground, background),
    })
  }, [modifiedAncestry, modifiedBackground])

  const body = (
    <>
      <div className={`${roboto_condensed.className} text-sm p-2 w-full`}>
        <div className="flex flex-col flex-wrap mb-4">
          <div className="">Ancestry</div>
          <div className="">
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
                      {choices.ancestry[i]?.map((attribute) => (
                        <option key={attribute} value={attribute}>
                          {attribute}
                        </option>
                      ))}
                    </select>
                  </React.Fragment>
                )
              }
            )}
            <span className="w-fit inline-flex items-center h-fit">
              <label>
                <input
                  className="bg-stone-700 mt-0.5"
                  type="checkbox"
                  checked={modifiedAncestry.free_attribute}
                  onChange={(e) => {
                    let updated = cloneDeep(modifiedAncestry)
                    updated.free_attribute = !modifiedAncestry.free_attribute
                    if (updated.free_attribute) {
                      updated.attribute_boost_selections = [
                        undefined!,
                        undefined!,
                      ]
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
            </span>
          </div>
        </div>
        <span>
          <div>Background</div>
          {modifiedBackground.attribute_boost_selections.map(
            (choice: any, i: number) => {
              return (
                <React.Fragment key={i}>
                  <select
                    className="bg-stone-700 mr-2 rounded-md"
                    value={choice ?? ''}
                    onChange={(e) => {
                      let updated = cloneDeep(modifiedBackground)
                      updated.attribute_boost_selections[i] = e.target
                        .value as Attribute
                      setModifiedBackground(updated)
                    }}
                  >
                    <option value={choice}>{choice}</option>
                    {choices.background[i]?.map((attribute) => (
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
            onAttributeUpdate(modifiedAncestry, modifiedBackground)
          },
        },
        {
          label: 'Cancel',
          onClick: () => {
            setModifiedAncestry(characterAncestry)
            setModifiedBackground(characterBackground)
          },
        },
      ]}
    ></Modal>
  )
}
