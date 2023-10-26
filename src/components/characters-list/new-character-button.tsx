import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CharacterBuilderModal from '../character-builder/character-builder'
import { CharacterEntity } from '@/models/db/character-entity'
import { useEffect, useState } from 'react'
import { PlayerCharacter } from '@/models/player-character'
import { ClassEntity } from '@/models/db/class-entity'
import { Feature } from '@/models/db/feature'
import { PlayerCharacterProvider } from '../character-display/player-character-context'

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
            levels: [
              {
                level: 1,
                attributes: [null!, null!, null!, null!],
              },
              {
                level: 5,
                attributes: [null!, null!, null!, null!],
              },
              {
                level: 10,
                attributes: [null!, null!, null!, null!],
              },
              {
                level: 15,
                attributes: [null!, null!, null!, null!],
              },
              {
                level: 20,
                attributes: [null!, null!, null!, null!],
              },
            ],
          },
          player_state: {
            focus_points: [],
            money: {
              pp: 0,
              gp: 15,
              sp: 0,
              cp: 0,
            },
          },
          languages: [],
          ancestry_id: '64c86dc6ce00a34d75caa80f',
          background_id: '64c87a12ce00a34d75caa812',
          // fighter: 64d24e0ece00a34d75caa847
          // monk: 64d82344de539d6f569f9194
          class_id: '64d24e0ece00a34d75caa847',
          heritage_id: '',
          equipment: [],
          equipped_armor: '',
          features: fighter.features.map((feature: Feature) => {
            if (feature.type === 'SKILL_SELECTION') {
              feature.value.value = [null]
            }
            return { source: 'CLASS', feature: feature }
          }),
          spellcasting: [],
        }
        characterEntity.features.push(
          {
            source: 'ANCESTRY',
            feature: {
              level: 1,
              type: 'ANCESTRY_FEAT_SELECTION',
              value: null,
            },
          },
          {
            source: 'ANCESTRY',
            feature: {
              level: 5,
              type: 'ANCESTRY_FEAT_SELECTION',
              value: null,
            },
          },
          {
            source: 'ANCESTRY',
            feature: {
              level: 9,
              type: 'ANCESTRY_FEAT_SELECTION',
              value: null,
            },
          },
          {
            source: 'ANCESTRY',
            feature: {
              level: 13,
              type: 'ANCESTRY_FEAT_SELECTION',
              value: null,
            },
          },
          {
            source: 'ANCESTRY',
            feature: {
              level: 17,
              type: 'ANCESTRY_FEAT_SELECTION',
              value: null,
            },
          },
          {
            source: 'BACKGROUND',
            feature: {
              type: 'FEAT',
              value: 'Steady Balance',
              context: [],
            },
          },
          {
            source: 'BACKGROUND',
            feature: {
              type: 'PROFICIENCY',
              value: {
                type: 'Skill',
                value: 'Acrobatics',
                rank: 'trained',
              },
            },
          },
          {
            source: 'BACKGROUND',
            feature: {
              type: 'PROFICIENCY',
              value: {
                type: 'Lore',
                value: 'Circus',
                rank: 'trained',
              },
            },
          }
        )
        PlayerCharacter.build(characterEntity).then((val) => {
          setPlayerCharacter(val)
        })
      }
    )
  }, [])

  return (
    playerCharacter && (
      <>
        <PlayerCharacterProvider>
          <CharacterBuilderModal
            trigger={
              <button className="py-1 px-5 rounded-md bg-stone-800 border border-stone-300 hover:bg-stone-600">
                <FontAwesomeIcon className="mr-1" size="2xs" icon={faPlus} />
                New
              </button>
            }
            initialValue={playerCharacter}
            onClose={handleSave}
          ></CharacterBuilderModal>
        </PlayerCharacterProvider>
      </>
    )
  )
}
