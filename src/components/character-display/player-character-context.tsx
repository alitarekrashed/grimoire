import { CharacterEntity } from '@/models/db/character-entity'
import { PlayerCharacter } from '@/models/player-character'
import { useDebounce } from '@/utils/debounce'
import React, { useState } from 'react'

const DEFAULT_VALUE: {
  playerCharacter: PlayerCharacter
  updatePlayerCharacter: (val: PlayerCharacter) => void
  updateAndSavePlayerCharacter: (val: PlayerCharacter) => void
  updateAndSaveCharacterEntity: (val: CharacterEntity) => void
} = {
  playerCharacter: undefined!,
  updatePlayerCharacter: () => null,
  updateAndSavePlayerCharacter: () => null,
  updateAndSaveCharacterEntity: () => null,
}

export const PlayerCharacterContext = React.createContext(DEFAULT_VALUE)

export function PlayerCharacterProvider(props: any) {
  const [playerCharacter, setPlayerCharacter] = useState<PlayerCharacter>(
    undefined!
  )

  const updatePlayerCharacter = (val: PlayerCharacter) => {
    setPlayerCharacter(val)
  }

  const updateAndSavePlayerCharacter = (val: PlayerCharacter) => {
    updatePlayerCharacter(val)
    debouncedRequest()
  }

  const updateAndSaveCharacterEntity = (val: CharacterEntity) => {
    PlayerCharacter.build(val).then((value) => {
      updateAndSavePlayerCharacter(value)
    })
  }

  const debouncedRequest = useDebounce(() => {
    const saveEntity = async () => {
      try {
        await fetch(
          `http://localhost:3000/api/characters/${
            playerCharacter.getCharacter()._id
          }`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(playerCharacter.getCharacter()),
          }
        )
      } catch (error) {
        console.log(error)
      }
    }

    saveEntity()
  })

  return (
    <PlayerCharacterContext.Provider
      value={{
        playerCharacter,
        updatePlayerCharacter,
        updateAndSavePlayerCharacter,
        updateAndSaveCharacterEntity,
      }}
    >
      {props.children}
    </PlayerCharacterContext.Provider>
  )
}
