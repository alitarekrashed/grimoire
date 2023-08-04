'use client'

import * as Dialog from '@radix-ui/react-dialog'
import styles from './character-builder.module.css'

import { PlayerCharacter } from '@/models/player-character'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import {
  CharacterAncestry,
  CharacterBackground,
  CharacterEntity,
} from '@/models/db/character-entity'
import { Ancestry } from '@/models/db/ancestry'
import { Heritage } from '@/models/db/heritage'
import { useDebounce } from '@/utils/debounce'

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
      <Dialog.Root>
        <Dialog.Trigger>
          <span
            className="text-xs border p-0.5 rounded-sm hover:bg-stone-600"
            tabIndex={0}
          >
            EDIT
          </span>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className={styles.DialogOverlay} />
          <Dialog.Content
            className={`bg-stone-900 ${styles.DialogContent}`}
            onInteractOutside={(e) => e.preventDefault()}
          >
            <div className="mt-4">
              <div>
                <span>Name: </span>
                <input
                  className="bg-stone-800"
                  value={name}
                  onChange={(e) => {
                    updateName(e.target.value)
                  }}
                ></input>
              </div>
              <AncestryEdit
                character={character}
                onAncestryEdit={handleAncestryChange}
                onEdit={handleAncestryEdit}
              ></AncestryEdit>
              <BackgroundEdit
                character={character}
                onBackgroundEdit={handleBackgroundChange}
                onEdit={handleBackgroundEdit}
              ></BackgroundEdit>
            </div>
            <Dialog.Close>
              <span
                className={`${styles.IconButton} rounded `}
                aria-label="Close"
                onClick={() => onClose(character.getCharacter())}
              >
                <FontAwesomeIcon
                  className="p-1.5 bg-stone-800 rounded-full hover:bg-stone-400"
                  icon={faXmark}
                />
              </span>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}

// TODO separate out things like changing Ancestry with the choices from the Ancestry...
function AncestryEdit({
  character,
  onAncestryEdit,
  onEdit,
}: {
  character: PlayerCharacter
  onAncestryEdit: (ancestryId: string) => void
  onEdit: (val: CharacterAncestry) => void
}) {
  const [ancestries, setAncestries] = useState<Ancestry[]>([])
  const [heritages, setHeritages] = useState<Heritage[]>([])

  useEffect(() => {
    fetch('http://localhost:3000/api/ancestries', {
      cache: 'no-store',
    })
      .then((result) => result.json())
      .then((ancestries) => {
        setAncestries(ancestries)
      })
  }, [])

  useEffect(() => {
    fetch(
      `http://localhost:3000/api/heritages?ancestry=${character.getAncestryName()}`,
      {
        cache: 'no-store',
      }
    )
      .then((result) => result.json())
      .then((heritages) => {
        setHeritages(heritages)
      })
  }, [character.getCharacter().ancestry.id])

  const updateAncestry = (value: string) => {
    onAncestryEdit(value)
  }

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

  const updateHeritage = (value: string) => {
    let val: CharacterAncestry = { ...character.getCharacter().ancestry }
    val.heritage_id = value
    onEdit(val)
  }

  const languageChoices: (string | undefined)[] =
    character?.getCharacter().ancestry.language_selections

  return (
    <div className="inline-flex gap-5 border border-stone-300 p-2 items-center">
      <span>
        <h2>Ancestry</h2>
        <select
          className="bg-stone-800"
          value={character.getAncestryId()}
          onChange={(e) => updateAncestry(e.target.value)}
        >
          {ancestries.map((ancestry) => (
            <option
              key={ancestry._id.toString()}
              value={ancestry._id.toString()}
            >
              {ancestry.name}
            </option>
          ))}
        </select>
      </span>
      <span>
        {character && (
          <label>
            <input
              className="bg-stone-800"
              type="checkbox"
              checked={character.getCharacter().ancestry.free_attribute}
              onChange={(e) => updateAncestryAttributeMethod()}
            />
            Freely assign attributes?
          </label>
        )}

        <h2>Attributes</h2>
        {character &&
          character
            .getCharacter()
            .ancestry.attribute_boost_selections.map(
              (choice: any, i: number) => {
                return (
                  <React.Fragment key={i}>
                    <select
                      className="bg-stone-800 mr-2"
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
          <h2>Languages</h2>
          {character &&
            languageChoices.map((choice: any, i: number) => (
              <React.Fragment key={i}>
                <select
                  className="bg-stone-800 mr-2"
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
      <span>
        <h2>Heritage</h2>
        <select
          className="bg-stone-800"
          value={character.getCharacter().ancestry.heritage_id}
          onChange={(e) => updateHeritage(e.target.value)}
        >
          <option value=""></option>
          {heritages.map((heritage) => (
            <option
              key={heritage._id.toString()}
              value={heritage._id.toString()}
            >
              {heritage.name}
            </option>
          ))}
        </select>
      </span>
    </div>
  )
}

// TODO separate out things like changing Ancestry with the choices from the Ancestry...
function BackgroundEdit({
  character,
  onBackgroundEdit,
  onEdit,
}: {
  character: PlayerCharacter
  onBackgroundEdit: (backgroundId: string) => void
  onEdit: (val: CharacterBackground) => void
}) {
  const [backgrounds, setBackgrounds] = useState<Background[]>([])

  useEffect(() => {
    fetch('http://localhost:3000/api/backgrounds', {
      cache: 'no-store',
    })
      .then((result) => result.json())
      .then((backgrounds) => {
        setBackgrounds(backgrounds)
      })
  }, [])

  const updateBackground = (value: string) => {
    onBackgroundEdit(value)
  }

  const updateAttribute = (value: Attribute, index: number) => {
    let val: CharacterBackground = { ...character.getCharacter().background }
    val.attribute_boost_selections[index] = value
    onEdit(val)
  }

  return (
    <div className="inline-flex gap-5 border border-stone-300 p-2 items-center">
      <span>
        <h2>Background</h2>
        <select
          className="bg-stone-800"
          value={character.getBackgroundId()}
          onChange={(e) => updateBackground(e.target.value)}
        >
          {backgrounds.map((background) => (
            <option
              key={background._id.toString()}
              value={background._id.toString()}
            >
              {background.name}
            </option>
          ))}
        </select>
      </span>
      <span>
        <h2>Attributes</h2>
        {character?.getCharacter()?.background &&
          character
            .getCharacter()
            .background.attribute_boost_selections.map(
              (choice: any, i: number) => {
                return (
                  <React.Fragment key={i}>
                    <select
                      className="bg-stone-800 mr-2"
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
