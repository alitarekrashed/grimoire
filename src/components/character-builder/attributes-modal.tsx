import { Ancestry, Attribute, AttributeModifier } from '@/models/db/ancestry'
import { Background } from '@/models/db/background'
import { CharacterEntity } from '@/models/db/character-entity'
import { ClassEntity } from '@/models/db/class_entity'
import { AttributeOptions } from '@/models/player-character'
import { roboto_condensed } from '@/utils/fonts'
import { cloneDeep } from 'lodash'
import React, { useEffect, useState } from 'react'
import { Modal } from '../modal/modal'

const ATTRIBUTES: Attribute[] = [
  'Strength',
  'Dexterity',
  'Constitution',
  'Intelligence',
  'Wisdom',
  'Charisma',
]

function getAncestryAttributeChoices(
  character: CharacterEntity,
  ancestry: Ancestry
) {
  if (character.attributes.free_ancestry_attribute_selection === false) {
    return getAncestryDefaultAttributeChoices(character, ancestry)
  } else {
    return getAncestryFreeAttributeChoices(character)
  }
}

function getAncestryDefaultAttributeChoices(
  character: CharacterEntity,
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
        character.attributes.ancestry.indexOf(option) === -1
    )
  }
  return options
}

function getAncestryFreeAttributeChoices(character: CharacterEntity) {
  let options: Attribute[][] = [[...ATTRIBUTES], [...ATTRIBUTES]]

  for (let i = 0; i < options.length; i++) {
    options[i] = options[i].filter((option: any) => {
      return character.attributes.ancestry.indexOf(option) === -1
    })
  }
  return options
}

function getBackgroundAttributeChoices(
  character: CharacterEntity,
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
        character.attributes.background.indexOf(option) === -1
    )
  }

  return options
}

function getClassAttributeChoices(
  character: CharacterEntity,
  classEntity: ClassEntity
) {
  let options: Attribute[][] = classEntity.key_ability.map(
    (choices: AttributeModifier[]) => choices as Attribute[]
  )

  for (let i = 0; i < options.length; i++) {
    options[i] = options[i].filter(
      (option: Attribute) => character.attributes.class.indexOf(option) === -1
    )
  }

  return options
}

export function AttributesModal({
  onAttributeUpdate,
  characterEntity,
  ancestry,
  background,
  classEntity,
}: {
  onAttributeUpdate: (character: CharacterEntity) => void
  characterEntity: CharacterEntity
  ancestry: Ancestry
  background: Background
  classEntity: ClassEntity
}) {
  const [characterState, setCharacterState] = useState<{
    character: CharacterEntity
  }>({
    character: characterEntity,
  })

  const [choices, setChoices] = useState<AttributeOptions>({
    ancestry: getAncestryAttributeChoices(characterState.character, ancestry),
    background: getBackgroundAttributeChoices(
      characterState.character,
      background
    ),
    class: getClassAttributeChoices(characterState.character, classEntity),
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
      ancestry: getAncestryAttributeChoices(characterState.character, ancestry),
      background: getBackgroundAttributeChoices(
        characterState.character,
        background
      ),
      class: getClassAttributeChoices(characterState.character, classEntity),
    })
  }, [characterState])

  const body = (
    <>
      <div className={`${roboto_condensed.className} text-sm p-2 w-full`}>
        <div className="flex flex-col flex-wrap mb-4">
          <div className="">Ancestry</div>
          <div className="">
            {characterState.character.attributes.ancestry.map(
              (choice: any, i: number) => {
                return (
                  <React.Fragment key={i}>
                    <select
                      className="bg-stone-700 mr-2 rounded-md"
                      value={choice ?? ''}
                      onChange={(e) => {
                        let updated = cloneDeep(characterState)
                        updated.character.attributes.ancestry[i] = e.target
                          .value as Attribute
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
                  checked={
                    characterState.character.attributes
                      .free_ancestry_attribute_selection
                  }
                  onChange={(e) => {
                    let updated = cloneDeep(characterState)
                    updated.character.attributes.free_ancestry_attribute_selection =
                      !characterState.character.attributes
                        .free_ancestry_attribute_selection
                    if (
                      updated.character.attributes
                        .free_ancestry_attribute_selection
                    ) {
                      updated.character.attributes.ancestry = [
                        undefined!,
                        undefined!,
                      ]
                    } else {
                      updated.character.attributes.ancestry = [undefined!]
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
          {characterState.character.attributes.background.map(
            (choice: any, i: number) => {
              return (
                <React.Fragment key={i}>
                  <select
                    className="bg-stone-700 mr-2 rounded-md"
                    value={choice ?? ''}
                    onChange={(e) => {
                      let updated = cloneDeep(characterState)
                      updated.character.attributes.background[i] = e.target
                        .value as Attribute
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
          {characterState.character.attributes.class.map(
            (choice: any, i: number) => {
              return (
                <React.Fragment key={i}>
                  <select
                    className="bg-stone-700 mr-2 rounded-md"
                    value={choice ?? ''}
                    onChange={(e) => {
                      let updated = cloneDeep(characterState)
                      updated.character.attributes.class[i] = e.target
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
            onAttributeUpdate(characterState.character)
          },
        },
        {
          label: 'Cancel',
          onClick: () => {
            setCharacterState({
              character: characterEntity,
            })
          },
        },
      ]}
    ></Modal>
  )
}
