import { Feat } from '@/models/db/feat'
import { SourcedFeature } from '@/models/player-character'
import { useEffect, useState } from 'react'
import { FeatureChoiceModal } from './feature-choice-modal'
import { cloneDeep } from 'lodash'

export function AncestryFeatChoiceModal({
  existingFeat,
  existingFeatName,
  traits,
  onChange,
}: {
  existingFeat: SourcedFeature
  existingFeatName: string
  traits: string[]
  onChange: (sourcedFeature: SourcedFeature[]) => void
}) {
  const [ancestryFeat, setAncestryFeat] = useState<SourcedFeature>(existingFeat)
  const [feats, setFeats] = useState<Feat[]>([])

  useEffect(() => {
    setAncestryFeat(existingFeat)
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
        label="Ancestry Feat"
        entities={feats}
        initialId={existingFeat.feature.value ?? ''}
        idField="name"
        onSave={(feat: Feat) => {
          const updated = cloneDeep(ancestryFeat)
          updated.feature.value = feat.name
          onChange([updated])
        }}
        onClear={() => {
          const updated = cloneDeep(ancestryFeat)
          updated.feature.value = null!
          onChange([updated])
        }}
      ></FeatureChoiceModal>
    </>
  )
}
