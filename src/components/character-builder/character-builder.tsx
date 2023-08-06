'use client'

import {
  CharacterAncestry,
  CharacterBackground,
  CharacterEntity,
} from '@/models/db/character-entity'
import { PlayerCharacter } from '@/models/player-character'
import { roboto_condensed } from '@/utils/fonts'
import { cloneDeep } from 'lodash'
import React, { useEffect, useState } from 'react'
import { Modal } from '../modal/modal'
import { AncestryChoiceModal } from './ancestry-choice-modal'
import { AttributesModal } from './attributes-modal'
import { BackgroundChoiceModal } from './background-choice-modal'
import { HeritageChoiceModal } from './heritage-choice-modal'

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

  const handleAttributeChange = (
    ancestry: CharacterAncestry,
    background: CharacterBackground
  ) => {
    let updated: CharacterEntity = cloneDeep(character.getCharacter())
    updated.ancestry = ancestry
    updated.background = background
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
                    characterBackground={character.getCharacter().background}
                    background={character.getBackground()}
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
  const updateAncestryLanguage = (value: string, index: number) => {
    let val: CharacterAncestry = { ...character.getCharacter().ancestry }
    val.language_selections[index] = value
    onEdit(val)
  }

  const languageChoices: (string | undefined)[] =
    character?.getCharacter().ancestry.language_selections

  return (
    <div>
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
