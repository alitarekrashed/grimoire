import { Subclass } from '@/models/db/subclass'
import { useContext, useEffect, useState } from 'react'
import { PlayerCharacterContext } from '../character-display/player-character-context'
import { FeatureChoiceModal } from './feature-choice-modal'

export function SubclassChoiceModal({
  onSubclassChange,
}: {
  onSubclassChange: (subclass: Subclass) => void
}) {
  const { playerCharacter } = useContext(PlayerCharacterContext)
  const [subclasses, setSubclasses] = useState<Subclass[]>([])

  useEffect(() => {
    fetch(
      `http://localhost:3000/api/subclasses?class_name=${playerCharacter
        .getClassEntity()
        .name.toLowerCase()}`,
      {
        cache: 'no-store',
      }
    )
      .then((result) => result.json())
      .then((subclasses) => {
        setSubclasses(subclasses)
      })
  }, [])

  const updateSubclass = (subclass: Subclass) => {
    onSubclassChange(subclass)
  }

  return (
    <>
      <FeatureChoiceModal
        label={playerCharacter.getSubclassIfAvaialable()!.name!}
        entities={subclasses}
        initialId={playerCharacter.getSubclassIfAvaialable()!.value ?? ''}
        onSave={updateSubclass}
      ></FeatureChoiceModal>
    </>
  )
}
