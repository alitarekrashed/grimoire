import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CharacterBuilderModal from '../character-builder/character-builder'
import { CharacterEntity } from '@/models/db/character-entity'
import { useEffect, useState } from 'react'
import { PlayerCharacter } from '@/models/player-character'
import { ClassEntity } from '@/models/db/class-entity'
import { Feature } from '@/models/db/feature'

export function NewCharacterButton({ onSave }: { onSave: () => void }) {
  const [playerCharacter, setPlayerCharacter] = useState<PlayerCharacter>()

  const handleSave = (char: CharacterEntity) => {
    fetch(`http://localhost:3000/api/characters`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(char),
    }).then(() => onSave())
  }

  useEffect(() => {
    PlayerCharacter.getClass('64d24e0ece00a34d75caa847').then(
      (fighter: ClassEntity) => {
        const characterEntity: CharacterEntity = {
          _id: undefined!,
          name: 'New character',
          level: 1,
          attributes: {
            free_ancestry_attribute_selection: false,
            ancestry: [],
            background: [],
            class: [],
            level_1: [null!, null!, null!, null!],
          },
          languages: [],
          ancestry_id: '64c86dc6ce00a34d75caa80f',
          background_id: '64c87a12ce00a34d75caa812',
          // fighter: 64d24e0ece00a34d75caa847
          // monk: 64d82344de539d6f569f9194
          class_id: '64d24e0ece00a34d75caa847',
          heritage_id: '',
          features: {
            '1': fighter.features['1'].map((feature: Feature) => {
              if (feature.type === 'SKILL_SELECTION') {
                feature.value.value = [null]
              }
              return { source: 'CLASS', feature: feature }
            }),
          },
        }
        characterEntity.features['1'].push({
          source: 'ANCESTRY',
          feature: {
            type: 'FEAT',
            value: null,
          },
        })
        PlayerCharacter.build(characterEntity).then((val) =>
          setPlayerCharacter(val)
        )
      }
    )
  }, [])

  return (
    playerCharacter && (
      <CharacterBuilderModal
        trigger={
          <button className="py-1 px-5 rounded-md bg-stone-800 border border-stone-300 hover:bg-stone-600">
            <FontAwesomeIcon className="mr-1" size="2xs" icon={faPlus} />
            New
          </button>
        }
        playerCharacter={playerCharacter}
        onClose={handleSave}
      ></CharacterBuilderModal>
    )
  )
}
