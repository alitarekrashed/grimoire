import { ClassEntity } from '@/models/db/class-entity'
import { useContext, useEffect, useState } from 'react'
import { FeatureChoiceModal } from '../feature-choice-modal'
import { PlayerCharacterContext } from '../../character-display/player-character-context'
import { PlayerCharacter, SourcedFeature } from '@/models/player-character'
import { CharacterEntity } from '@/models/db/character-entity'

export function ClassChoiceModal({
  onUpdate,
}: {
  onUpdate: (updateFunction: (cloned: CharacterEntity) => void) => void
}) {
  const { playerCharacter } = useContext(PlayerCharacterContext)
  const [classes, setClasses] = useState<ClassEntity[]>([])

  useEffect(() => {
    fetch('http://localhost:3000/api/classes', {
      cache: 'no-store',
    })
      .then((result) => result.json())
      .then((classes) => {
        setClasses(classes)
      })
  }, [])

  return (
    <>
      <FeatureChoiceModal
        label="Class"
        entities={classes}
        initialId={playerCharacter.getClassEntity()._id.toString()}
        onSave={(classEntity) =>
          onUpdate((character: CharacterEntity) => {
            character.class_id = classEntity._id.toString()
            character.attributes.class = []
            character.features = character.features.filter(
              (value: SourcedFeature) => value.source !== 'CLASS'
            )
            character.features.push(
              ...classEntity.features.map((feature: Feature) => {
                if (feature.type === 'SKILL_SELECTION') {
                  feature.value.value = [null]
                }
                return { source: 'CLASS', feature: feature }
              })
            )
            character.spellcasting = character.spellcasting.filter(
              (val) => val.source !== 'CLASS'
            )
            character.spellcasting.push({
              source: 'CLASS',
              value: classEntity.spellcasting,
            })
          })
        }
      ></FeatureChoiceModal>
    </>
  )
}
