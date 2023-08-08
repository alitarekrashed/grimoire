import { Ancestry, Attribute, AttributeModifier } from '@/models/db/ancestry'
import { Background } from '@/models/db/background'
import {
  CharacterAncestry,
  CharacterBackground,
  CharacterClass,
} from '@/models/db/character-entity'
import { AttributeOptions } from '@/models/player-character'
import { roboto_condensed } from '@/utils/fonts'
import { cloneDeep } from 'lodash'
import React, { useEffect, useState } from 'react'
import { Modal } from '../modal/modal'
import { ClassEntity } from '@/models/db/class_entity'

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

function getClassAttributeChoices(
  characterClass: CharacterClass,
  classEntity: ClassEntity
) {
  let options: Attribute[][] = classEntity.key_ability.map(
    (choices: AttributeModifier[]) => choices as Attribute[]
  )

  for (let i = 0; i < options.length; i++) {
    options[i] = options[i].filter(
      (option: Attribute) =>
        characterClass.attribute_boost_selections.indexOf(option) === -1
    )
  }

  return options
}

export function AttributesModal({
  onAttributeUpdate,
  characterAncestry,
  characterBackground,
  characterClass,
  ancestry,
  background,
  classEntity,
}: {
  onAttributeUpdate: (
    characterAncestry: CharacterAncestry,
    characterBackground: CharacterBackground,
    characterClass: CharacterClass
  ) => void
  characterAncestry: CharacterAncestry
  characterBackground: CharacterBackground
  characterClass: CharacterClass
  ancestry: Ancestry
  background: Background
  classEntity: ClassEntity
}) {
  const [characterState, setCharacterState] = useState<{
    ancestry: CharacterAncestry
    background: CharacterBackground
    class: CharacterClass
  }>({
    ancestry: characterAncestry,
    background: characterBackground,
    class: characterClass,
  })

  const [choices, setChoices] = useState<AttributeOptions>({
    ancestry: getAncestryAttributeChoices(characterState.ancestry, ancestry),
    background: getBackgroundAttributeChoices(
      characterState.background,
      background
    ),
    class: getClassAttributeChoices(characterState.class, classEntity),
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
      ancestry: getAncestryAttributeChoices(characterState.ancestry, ancestry),
      background: getBackgroundAttributeChoices(
        characterState.background,
        background
      ),
      class: getClassAttributeChoices(characterState.class, classEntity),
    })
  }, [characterState])

  const body = (
    <>
      <div className={`${roboto_condensed.className} text-sm p-2 w-full`}>
        <div className="flex flex-col flex-wrap mb-4">
          <div className="">Ancestry</div>
          <div className="">
            {characterState.ancestry.attribute_boost_selections.map(
              (choice: any, i: number) => {
                return (
                  <React.Fragment key={i}>
                    <select
                      className="bg-stone-700 mr-2 rounded-md"
                      value={choice ?? ''}
                      onChange={(e) => {
                        let updated = cloneDeep(characterState)
                        updated.ancestry.attribute_boost_selections[i] = e
                          .target.value as Attribute
                        setCharacterState(updated)
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
                  checked={characterState.ancestry.free_attribute}
                  onChange={(e) => {
                    let updated = cloneDeep(characterState)
                    updated.ancestry.free_attribute =
                      !characterState.ancestry.free_attribute
                    if (updated.ancestry.free_attribute) {
                      updated.ancestry.attribute_boost_selections = [
                        undefined!,
                        undefined!,
                      ]
                    } else {
                      updated.ancestry.attribute_boost_selections = [undefined!]
                    }
                    setCharacterState(updated)
                  }}
                />
                <span className="mr-2 float-left">
                  Freely assign ancestry attributes
                </span>
              </label>
            </span>
          </div>
        </div>
        <div className="mb-4">
          <div>Background</div>
          {characterState.background.attribute_boost_selections.map(
            (choice: any, i: number) => {
              return (
                <React.Fragment key={i}>
                  <select
                    className="bg-stone-700 mr-2 rounded-md"
                    value={choice ?? ''}
                    onChange={(e) => {
                      let updated = cloneDeep(characterState)
                      updated.background.attribute_boost_selections[i] = e
                        .target.value as Attribute
                      setCharacterState(updated)
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
        </div>
        <div>
          <div>Class Key Attribute</div>
          {characterState.class.attribute_boost_selections.map(
            (choice: any, i: number) => {
              return (
                <React.Fragment key={i}>
                  <select
                    className="bg-stone-700 mr-2 rounded-md"
                    value={choice ?? ''}
                    onChange={(e) => {
                      let updated = cloneDeep(characterState)
                      updated.class.attribute_boost_selections[i] = e.target
                        .value as Attribute
                      setCharacterState(updated)
                    }}
                  >
                    <option value={choice}>{choice}</option>
                    {choices.class[i]?.map((attribute) => (
                      <option key={attribute} value={attribute}>
                        {attribute}
                      </option>
                    ))}
                  </select>
                </React.Fragment>
              )
            }
          )}
        </div>
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
            onAttributeUpdate(
              characterState.ancestry,
              characterState.background,
              characterState.class
            )
          },
        },
        {
          label: 'Cancel',
          onClick: () => {
            setCharacterState({
              ancestry: characterAncestry,
              background: characterBackground,
              class: characterClass,
            })
          },
        },
      ]}
    ></Modal>
  )
}
