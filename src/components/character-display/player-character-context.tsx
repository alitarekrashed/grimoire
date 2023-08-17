import { PlayerCharacter } from '@/models/player-character'
import React, { useState, useContext } from 'react'

const DEFAULT_VALUE: {
  playerCharacter: PlayerCharacter | undefined
  updatePlayerCharacter: (val: PlayerCharacter) => void
} = {
  playerCharacter: undefined,
  updatePlayerCharacter: () => null,
}

export const PlayerCharacterContext = React.createContext(DEFAULT_VALUE)

export function PlayerCharacterProvider(props: any) {
  const [playerCharacter, setPlayerCharacter] = useState<PlayerCharacter>()

  const updatePlayerCharacter = (val: PlayerCharacter) => {
    console.log(val)
    setPlayerCharacter(val)
  }

  return (
    <PlayerCharacterContext.Provider
      value={{ playerCharacter, updatePlayerCharacter }}
    >
      {props.children}
    </PlayerCharacterContext.Provider>
  )
}
