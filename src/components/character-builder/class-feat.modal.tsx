import { Feat } from '@/models/db/feat'
import { SourcedFeature } from '@/models/player-character'
import { useEffect, useState } from 'react'
import { FeatureChoiceModal } from './feature-choice-modal'
import { cloneDeep } from 'lodash'

export function ClassFeatChoiceModal({
  existingFeat,
  traits,
  onChange,
}: {
  existingFeat: SourcedFeature
  traits: string[]
  onChange: (sourcedFeature: SourcedFeature[]) => void
}) {
  const [classFeat, setClassFeat] = useState<SourcedFeature>(existingFeat)
  const [feats, setFeats] = useState<Feat[]>([])

  useEffect(() => {
    setClassFeat(existingFeat)
  }, [existingFeat])

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
        label="Class Feat"
        entities={feats}
        initialId={existingFeat.feature.value ?? ''}
        idField="name"
        onSave={(feat: Feat) => {
          const updated = cloneDeep(classFeat)
          updated.feature.value = feat.name
          onChange([updated])
        }}
        onClear={() => {
          const updated = cloneDeep(classFeat)
          updated.feature.value = null!
          onChange([updated])
        }}
      ></FeatureChoiceModal>
    </>
  )
}
