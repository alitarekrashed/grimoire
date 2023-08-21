import { ClassEntity } from '@/models/db/class-entity'
import { useContext, useEffect, useState } from 'react'
import { FeatureChoiceModal } from '../feature-choice-modal'
import { PlayerCharacterContext } from '../../character-display/player-character-context'

export function ClassChoiceModal({
  onClassChange,
}: {
  onClassChange: (classEntity: classEntity) => void
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

  const updateClass = (classEntity: ClassEntity) => {
    onClassChange(classEntity)
  }

  return (
    <>
      <FeatureChoiceModal
        label="Class"
        entities={classes}
        initialId={playerCharacter.getClassEntity()._id.toString()}
        onSave={updateClass}
      ></FeatureChoiceModal>
    </>
  )
}
