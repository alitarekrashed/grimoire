import { ClassEntity } from '@/models/db/class-entity'
import { useEffect, useState } from 'react'
import { FeatureChoiceModal } from './feature-choice-modal'

export function ClassChoiceModal({
  classId,
  onClassChange,
}: {
  classId: string
  onClassChange: (classEntity: classEntity) => void
}) {
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
        initialId={classId}
        onSave={updateClass}
      ></FeatureChoiceModal>
    </>
  )
}
