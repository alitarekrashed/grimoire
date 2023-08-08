import { Ancestry } from '@/models/db/ancestry'
import { Feat } from '@/models/db/feat'
import { useEffect, useState } from 'react'
import { FeatureChoiceModal } from './feature-choice-modal'

export function AncestryFeatChoiceModal({
  existingFeatName,
  traits,
  onChange,
}: {
  existingFeatName: string
  traits: string[]
  onChange: (feat: Feat) => void
}) {
  const [feats, setFeats] = useState<Feat[]>([])

  useEffect(() => {
    fetch(`http://localhost:3000/api/feats?traits=${traits}`, {
      cache: 'no-store',
    })
      .then((result) => result.json())
      .then((feats) => {
        setFeats(feats)
      })
  }, [traits])

  return (
    <>
      <FeatureChoiceModal
        label="Ancestry Feat"
        entities={feats}
        initialId={existingFeatName}
        idField="name"
        onSave={onChange}
        onClear={() => onChange(undefined!)}
      ></FeatureChoiceModal>
    </>
  )
}
