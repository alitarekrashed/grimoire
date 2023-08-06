'use client'

import {
  CharacterAncestry,
  CharacterBackground,
  CharacterEntity,
} from '@/models/db/character-entity'
import { Heritage } from '@/models/db/heritage'
import { PlayerCharacter } from '@/models/player-character'
import { roboto_condensed } from '@/utils/fonts'
import React, { useEffect, useState } from 'react'
import { Modal } from '../modal/modal'
import { AncestryChoiceModal } from './ancestry-choice-modal'
import { HeritageChoiceModal } from './heritage-choice-modal'
import { BackgroundChoiceModal } from './background-choice-modal'
import { Attribute } from '@/models/db/ancestry'
import { AttributesModal } from './attributes-modal'
import { cloneDeep } from 'lodash'

export default function CharacterBuilderModal({
  playerCharacter,
  onClose,
}: {
  playerCharacter: PlayerCharacter
  onClose: (character: CharacterEntity) => void
}) {
  const [character, setCharacter] = useState<PlayerCharacter>(playerCharacter)
  const [name, setName] = useState<string>(playerCharacter.getCharacter().name)

  useEffect(() => {
    setCharacter(playerCharacter)
    setName(playerCharacter.getCharacter().name)
  }, [playerCharacter])

  const updateName = (value: string) => {
    setName(value)
    character.getCharacter().name = value
  }

  const handleAncestryChange = (ancestryId: string) => {
    character.updateAncestry(ancestryId).then((val) => {
      setCharacter(val)
    })
  }

  const handleHeritageChange = (heritageId: string) => {
    let newCharacter: CharacterEntity = {
      ...character!.getCharacter(),
    }
    newCharacter.ancestry = {
      ...newCharacter.ancestry,
      heritage_id: heritageId,
    }
    PlayerCharacter.build(newCharacter).then((val) => {
      setCharacter(val)
    })
  }

  const handleAttributeChange = (ancestry: CharacterAncestry) => {
    let updated: CharacterEntity = cloneDeep(character.getCharacter())
    updated.ancestry = ancestry
    PlayerCharacter.build(updated).then((val) => {
      setCharacter(val)
    })
  }

  const handleAncestryEdit = (ancestry: CharacterAncestry) => {
    let newCharacter: CharacterEntity = {
      ...character!.getCharacter(),
      ancestry: ancestry,
    }
    PlayerCharacter.build(newCharacter).then((val) => {
      setCharacter(val)
    })
  }

  const handleBackgroundChange = (backgroundId: string) => {
    character.updateBackground(backgroundId).then((val) => {
      setCharacter(val)
    })
  }

  const handleBackgroundEdit = (background: CharacterBackground) => {
    let newCharacter: CharacterEntity = {
      ...character!.getCharacter(),
      background: background,
    }
    PlayerCharacter.build(newCharacter).then((val) => {
      setCharacter(val)
    })
  }

  return (
    <>
      <Modal
        size="large"
        trigger={
          <span
            className="text-[9px] border p-0.5 rounded-sm hover:bg-stone-600"
            tabIndex={0}
          >
            EDIT
          </span>
        }
        body={
          <div className="p-2">
            <div className={`text-sm ${roboto_condensed.className}`}>
              <div className="mb-2 inline-flex">
                <div className="relative w-44 h-9 mr-2">
                  <span className="text-stone-300 absolute top-0 text-[9px] pl-1.5">
                    Name
                  </span>
                  <input
                    className="absolute bottom-0 bg-transparent rounded-md h-full w-full pt-4 pl-1 border border-stone-300"
                    value={name}
                    onChange={(e) => {
                      updateName(e.target.value)
                    }}
                  ></input>
                </div>
                <div className="mr-2">
                  <AncestryChoiceModal
                    ancestryId={character.getAncestryId()}
                    onAncestryEdit={handleAncestryChange}
                  ></AncestryChoiceModal>
                </div>
                <div className="mr-2">
                  <HeritageChoiceModal
                    heritageId={character.getHeritageId()}
                    ancestry={character.getAncestry()}
                    onHeritageChange={handleHeritageChange}
                  ></HeritageChoiceModal>
                </div>
                <div className="mr-2">
                  <BackgroundChoiceModal
                    backgroundId={character.getBackgroundId()}
                    onBackgroundChange={handleBackgroundChange}
                  ></BackgroundChoiceModal>
                </div>
                <div>
                  <AttributesModal
                    characterAncestry={character.getCharacter().ancestry}
                    ancestry={character.getAncestry()}
                    onAttributeUpdate={handleAttributeChange}
                  ></AttributesModal>
                </div>
              </div>
            </div>
            <div className="mb-128"></div>
            <div className="mt-4">
              <AncestryEdit
                character={character}
                onEdit={handleAncestryEdit}
              ></AncestryEdit>
              <BackgroundEdit
                character={character}
                onEdit={handleBackgroundEdit}
              ></BackgroundEdit>
            </div>
          </div>
        }
        closeButtons={[
          {
            label: 'Save',
            onClick: () => onClose(character.getCharacter()),
          },
          {
            label: 'Cancel',
            onClick: () => setCharacter(playerCharacter),
          },
        ]}
      ></Modal>
    </>
  )
}

// TODO separate out things like changing Ancestry with the choices from the Ancestry...
function AncestryEdit({
  character,
  onEdit,
}: {
  character: PlayerCharacter
  onEdit: (val: CharacterAncestry) => void
}) {
  const updateAncestryAttributeMethod = () => {
    let val: CharacterAncestry = { ...character.getCharacter().ancestry }
    val.free_attribute = !val.free_attribute
    onEdit(val)
  }

  const updateAncestryAttribute = (value: Attribute, index: number) => {
    let val: CharacterAncestry = { ...character.getCharacter().ancestry }
    val.attribute_boost_selections[index] = value
    onEdit(val)
  }

  const updateAncestryLanguage = (value: string, index: number) => {
    let val: CharacterAncestry = { ...character.getCharacter().ancestry }
    val.language_selections[index] = value
    onEdit(val)
  }

  const languageChoices: (string | undefined)[] =
    character?.getCharacter().ancestry.language_selections

  return (
    <div className="inline-flex gap-5 border border-stone-300 p-2 items-center">
      <span>
        {character && (
          <label>
            <input
              className="bg-stone-700"
              type="checkbox"
              checked={character.getCharacter().ancestry.free_attribute}
              onChange={(e) => updateAncestryAttributeMethod()}
            />
            Freely assign attributes?
          </label>
        )}

        <span>Attributes</span>
        {character &&
          character
            .getCharacter()
            .ancestry.attribute_boost_selections.map(
              (choice: any, i: number) => {
                return (
                  <React.Fragment key={i}>
                    <select
                      className="bg-stone-700 mr-2"
                      value={choice ?? ''}
                      onChange={(e) =>
                        updateAncestryAttribute(e.target.value as Attribute, i)
                      }
                    >
                      <option value={choice}>{choice}</option>
                      {character
                        .getAttributeChoices()
                        .ancestry[i].map((attribute) => (
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
      {languageChoices.length > 0 && (
        <span>
          <span>Languages</span>
          {character &&
            languageChoices.map((choice: any, i: number) => (
              <React.Fragment key={i}>
                <select
                  className="bg-stone-700 mr-2"
                  value={choice ?? ''}
                  onChange={(e) => updateAncestryLanguage(e.target.value, i)}
                >
                  <option value={choice}>{choice}</option>
                  {character.getLanguageChoices().ancestry.map((language) => (
                    <option key={language} value={language}>
                      {language}
                    </option>
                  ))}
                </select>
              </React.Fragment>
            ))}
        </span>
      )}
    </div>
  )
}

// TODO separate out things like changing Ancestry with the choices from the Ancestry...
function BackgroundEdit({
  character,
  onEdit,
}: {
  character: PlayerCharacter
  onEdit: (val: CharacterBackground) => void
}) {
  const updateAttribute = (value: Attribute, index: number) => {
    let val: CharacterBackground = { ...character.getCharacter().background }
    val.attribute_boost_selections[index] = value
    onEdit(val)
  }

  return (
    <div className="inline-flex gap-5 border border-stone-300 p-2 items-center">
      <span>
        <span>Attributes</span>
        {character?.getCharacter()?.background &&
          character
            .getCharacter()
            .background.attribute_boost_selections.map(
              (choice: any, i: number) => {
                return (
                  <React.Fragment key={i}>
                    <select
                      className="bg-stone-700 mr-2"
                      value={choice ?? ''}
                      onChange={(e) =>
                        updateAttribute(e.target.value as Attribute, i)
                      }
                    >
                      <option value={choice}>{choice}</option>
                      {character
                        .getAttributeChoices()
                        .background[i].map((attribute) => (
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
  )
}
