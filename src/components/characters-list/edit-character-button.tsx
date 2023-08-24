import { CharacterEntity } from '@/models/db/character-entity'
import { PlayerCharacter } from '@/models/player-character'
import { useEffect, useState } from 'react'
import CharacterBuilderModal from '../character-builder/character-builder'

export function EditCharacterButton({
  onClick,
  onSave,
  onCancel,
  character,
}: {
  onClick: () => void
  onSave: () => void
  onCancel: () => void
  character: CharacterEntity
}) {
  const [playerCharacter, setPlayerCharacter] = useState<PlayerCharacter>()

  useEffect(() => {
    PlayerCharacter.build(character).then((val) => setPlayerCharacter(val))
  }, [character])

  const handleSave = (character: CharacterEntity) => {
    fetch(`http://localhost:3000/api/characters/${character._id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(character),
    }).then(() => onSave())
  }

  useEffect(() => {}, [])
  return playerCharacter ? (
    <CharacterBuilderModal
      trigger={
        <button className="w-full" onClick={onClick}>
          Manage
        </button>
      }
      initialValue={playerCharacter}
      onClose={handleSave}
      onCancel={onCancel}
    ></CharacterBuilderModal>
  ) : (
    <span>Manage</span>
  )
}
