import { Ancestry, Attribute, AttributeModifier } from '@/models/db/ancestry'
import { Background } from '@/models/db/background'
import {
  CharacterAttributes,
  CharacterEntity,
} from '@/models/db/character-entity'
import { ClassEntity } from '@/models/db/class-entity'
import { roboto_condensed } from '@/utils/fonts'
import { cloneDeep } from 'lodash'
import React, { useContext, useEffect, useState } from 'react'
import { PlayerCharacterContext } from '../character-display/player-character-context'
import { Modal } from '../modal/modal'
import { ChoiceSelect } from '../choice-select/choice-select'

const ATTRIBUTES: Attribute[] = [
  'Strength',
  'Dexterity',
  'Constitution',
  'Intelligence',
  'Wisdom',
  'Charisma',
]

export interface AttributeOptions {
  ancestry: Attribute[][]
  background: Attribute[][]
  class: Attribute[][]
  level_1: Attribute[][]
}

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

function getBackgroundAttributeChoices(background: Background) {
  let options: Attribute[][] = background.attributes.map(
    (choices: AttributeModifier[]) => {
      if (choices.length === 1 && choices[0] === 'Free') {
        return [...ATTRIBUTES]
      } else {
        return choices as Attribute[]
      }
    }
  )

  return options
}

function getClassAttributeChoices(classEntity: ClassEntity) {
  let options: Attribute[][] = classEntity.key_ability.map(
    (choices: AttributeModifier[]) => choices as Attribute[]
  )

  return options
}

function getLevelAttributeChoices(character: CharacterEntity) {
  let options: Attribute[][] = [
    [...ATTRIBUTES],
    [...ATTRIBUTES],
    [...ATTRIBUTES],
    [...ATTRIBUTES],
  ]

  for (let i = 0; i < options.length; i++) {
    options[i] = options[i].filter(
      (option: Attribute) => character.attributes.level_1.indexOf(option) === -1
    )
  }

  return options
}

export function AttributesModal({
  onAttributeUpdate,
}: {
  onAttributeUpdate: (character: CharacterEntity) => void
}) {
  const { playerCharacter } = useContext(PlayerCharacterContext)
  const [modifiedCharacter, setModifiedCharacter] = useState<CharacterEntity>(
    playerCharacter.getCharacter()
  )

  const [choices, setChoices] = useState<AttributeOptions>({
    ancestry: getAncestryAttributeChoices(
      modifiedCharacter,
      playerCharacter.getAncestry()
    ),
    background: getBackgroundAttributeChoices(playerCharacter.getBackground()),
    class: getClassAttributeChoices(playerCharacter.getClassEntity()),
    level_1: getLevelAttributeChoices(modifiedCharacter),
  })

  let totalCount = 0
  let setCount = 0
  ;['ancestry', 'background', 'class', 'level_1'].forEach((key) => {
    ;(
      playerCharacter.getCharacter().attributes[
        key as keyof CharacterAttributes
      ] as Attribute[]
    ).forEach((attribute) => {
      totalCount += 1
      setCount += attribute ? 1 : 0
    })
  })

  const trigger = (
    <button
      className="border border-stone-300 rounded-md relative flex w-44 h-9 p-1 justify-center items-center hover:bg-stone-600"
      tabIndex={0}
    >
      Attributes {setCount}/{totalCount}
    </button>
  )

  useEffect(() => {
    setChoices({
      ancestry: getAncestryAttributeChoices(
        modifiedCharacter,
        playerCharacter.getAncestry()
      ),
      background: getBackgroundAttributeChoices(
        playerCharacter.getBackground()
      ),
      class: getClassAttributeChoices(playerCharacter.getClassEntity()),
      level_1: getLevelAttributeChoices(modifiedCharacter),
    })
  }, [modifiedCharacter])

  const body = (
    <>
      <div className={`${roboto_condensed.className} text-sm p-2 w-full`}>
        <div className="flex flex-col flex-wrap mb-4">
          <div className="">Ancestry</div>
          <div className="">
            {modifiedCharacter.attributes.ancestry.map(
              (choice: any, i: number) => {
                return (
                  <React.Fragment key={i}>
                    <select
                      className="bg-stone-700 mr-2 rounded-md"
                      value={choice ?? ''}
                      onChange={(e) => {
                        let updated = cloneDeep(modifiedCharacter)
                        updated.attributes.ancestry[i] = e.target
                          .value as Attribute
                        setModifiedCharacter(updated)
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
                    modifiedCharacter.attributes
                      .free_ancestry_attribute_selection
                  }
                  onChange={(e) => {
                    let updated = cloneDeep(modifiedCharacter)
                    updated.attributes.free_ancestry_attribute_selection =
                      !modifiedCharacter.attributes
                        .free_ancestry_attribute_selection
                    if (updated.attributes.free_ancestry_attribute_selection) {
                      updated.attributes.ancestry = [undefined!, undefined!]
                    } else {
                      updated.attributes.ancestry = [undefined!]
                    }
                    setModifiedCharacter(updated)
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
          {modifiedCharacter.attributes.background.map(
            (choice: any, i: number) => {
              return (
                <span key={i} className="mr-2">
                  <ChoiceSelect
                    value={choice}
                    title={`Attribute #${i + 1}`}
                    options={choices.background[i]}
                    onChange={(val: string) => {
                      let updated = cloneDeep(modifiedCharacter)
                      updated.attributes.background[i] = val as Attribute
                      setModifiedCharacter(updated)
                    }}
                  ></ChoiceSelect>
                </span>
              )
            }
          )}
        </div>
        <div className="mb-4">
          <div>Class Key Attribute</div>
          {modifiedCharacter.attributes.class.map((choice: any, i: number) => {
            return (
              <span key={i} className="mr-2">
                <ChoiceSelect
                  value={choice}
                  title={`Attribute #${i + 1}`}
                  options={choices.class[i]}
                  onChange={(val: string) => {
                    let updated = cloneDeep(modifiedCharacter)
                    updated.attributes.class[i] = val as Attribute
                    setModifiedCharacter(updated)
                  }}
                ></ChoiceSelect>
              </span>
            )
          })}
        </div>
        <div className="mb-4">
          <div>Level 1 Attributes</div>
          {modifiedCharacter.attributes.level_1.map(
            (choice: any, i: number) => {
              return (
                <React.Fragment key={i}>
                  <select
                    className="bg-stone-700 mr-2 rounded-md"
                    value={choice ?? ''}
                    onChange={(e) => {
                      let updated = cloneDeep(modifiedCharacter)
                      updated.attributes.level_1[i] = e.target
                        .value as Attribute
                      setModifiedCharacter(updated)
                    }}
                  >
                    <option value={choice}>{choice}</option>
                    {choices.level_1[i]?.map((attribute) => (
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
            onAttributeUpdate(modifiedCharacter)
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
