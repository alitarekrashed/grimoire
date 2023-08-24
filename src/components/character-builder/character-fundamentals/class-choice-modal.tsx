import { ClassEntity } from '@/models/db/class-entity'
import { useContext, useEffect, useState } from 'react'
import { FeatureChoiceModal } from '../feature-choice-modal'
import { PlayerCharacterContext } from '../../character-display/player-character-context'
import { PlayerCharacter } from '@/models/player-character'

export function ClassChoiceModal({
  onUpdate,
}: {
  onUpdate: (
    updateFunction: (
      playerCharacter: PlayerCharacter
    ) => Promise<PlayerCharacter>
  ) => void
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
          onUpdate((playerCharacter: PlayerCharacter) =>
            playerCharacter.updateClass(classEntity)
          )
        }
      ></FeatureChoiceModal>
    </>
  )
}
