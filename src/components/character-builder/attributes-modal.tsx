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
import { Modal } from '../base/modal'
import { ChoiceSelect } from '../choice-select/choice-select'
import { PlayerCharacter } from '@/models/player-character'
import { LoadingSpinner } from '../loading-spinner/loading-spinner'

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
    return getAncestryDefaultAttributeChoices(ancestry)
  } else {
    return getAncestryFreeAttributeChoices()
  }
}

function getAncestryDefaultAttributeChoices(ancestry: Ancestry) {
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
          .indexOf(option) === -1
    )
  }
  return options
}

function getAncestryFreeAttributeChoices() {
  let options: Attribute[][] = [[...ATTRIBUTES], [...ATTRIBUTES]]

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

function getLevelAttributeChoices() {
  let options: Attribute[][] = [
    [...ATTRIBUTES],
    [...ATTRIBUTES],
    [...ATTRIBUTES],
    [...ATTRIBUTES],
  ]

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
  const [loading, setLoading] = useState<boolean>(false)

  const [choices, setChoices] = useState<AttributeOptions>({
    ancestry: getAncestryAttributeChoices(
      modifiedCharacter,
      playerCharacter.getAncestry()
    ),
    background: getBackgroundAttributeChoices(playerCharacter.getBackground()),
    class: getClassAttributeChoices(playerCharacter.getClassEntity()),
    level_1: getLevelAttributeChoices(),
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

  const loadWhileSetting = (modifiedCharacter: CharacterEntity) => {
    setLoading(true)
    return modifiedCharacter
  }

  const trigger = (
    <button
      className="border border-stone-300 rounded-md relative flex w-full h-9 p-1 justify-center items-center hover:bg-stone-600"
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
      level_1: getLevelAttributeChoices(),
    })
    setLoading(false)
  }, [modifiedCharacter])

  const body = (
    <>
      <LoadingSpinner loading={loading}></LoadingSpinner>
      {!loading && (
        <div className={`${roboto_condensed.className} text-sm p-2 w-full`}>
          <div className="flex flex-col flex-wrap mb-4">
            <div className="">Ancestry</div>
            <div className="inline-flex gap-2 items-center">
              {modifiedCharacter.attributes.ancestry.map(
                (choice: any, i: number) => {
                  return (
                    <ChoiceSelect
                      key={i}
                      value={choice}
                      title={`Attribute #${i + 1}`}
                      options={choices.ancestry[i].filter((val) => {
                        if (val === choice) {
                          return true
                        }
                        return (
                          modifiedCharacter.attributes.ancestry.indexOf(val) ===
                          -1
                        )
                      })}
                      onChange={(val: string) => {
                        let updated = cloneDeep(modifiedCharacter)
                        updated.attributes.ancestry[i] = val as Attribute
                        setModifiedCharacter(updated)
                      }}
                    ></ChoiceSelect>
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
                      if (
                        updated.attributes.free_ancestry_attribute_selection
                      ) {
                        updated.attributes.ancestry = [undefined!, undefined!]
                      } else {
                        updated.attributes.ancestry = [undefined!]
                      }
                      setModifiedCharacter(loadWhileSetting(updated))
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
                      options={choices.background[i].filter((val) => {
                        if (val === choice) {
                          return true
                        }
                        return (
                          modifiedCharacter.attributes.background.indexOf(
                            val
                          ) === -1
                        )
                      })}
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
            {modifiedCharacter.attributes.class.map(
              (choice: any, i: number) => {
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
              }
            )}
          </div>
          <div className="mb-4">
            <div>Level 1 Attributes</div>
            {modifiedCharacter.attributes.level_1.map(
              (choice: any, i: number) => {
                return (
                  <span key={i} className="mr-2">
                    <ChoiceSelect
                      value={choice}
                      title={`Attribute #${i + 1}`}
                      options={choices.level_1[i].filter((val) => {
                        if (val === choice) {
                          return true
                        }
                        return (
                          modifiedCharacter.attributes.level_1.indexOf(val) ===
                          -1
                        )
                      })}
                      onChange={(val: string) => {
                        let updated = cloneDeep(modifiedCharacter)
                        updated.attributes.level_1[i] = val as Attribute
                        setModifiedCharacter(updated)
                      }}
                    ></ChoiceSelect>
                  </span>
                )
              }
            )}
          </div>
        </div>
      )}
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
