import { Feat } from '@/models/db/feat'
import { SourcedFeature } from '@/models/player-character'
import { useContext, useEffect, useState } from 'react'
import { FeatureChoiceModal } from '../feature-choice-modal'
import { cloneDeep } from 'lodash'
import { PlayerCharacterContext } from '../../character-display/player-character-context'
import { CharacterLevelContext } from '../character-level-context'

export function ClassFeatChoiceModal({
  existingFeat,
  onChange,
}: {
  existingFeat: SourcedFeature
  onChange: (sourcedFeature: SourcedFeature[]) => void
}) {
  const { playerCharacter } = useContext(PlayerCharacterContext)
  const { level } = useContext(CharacterLevelContext)
  const [classFeat, setClassFeat] = useState<SourcedFeature>(existingFeat)
  const [feats, setFeats] = useState<Feat[]>([])

  useEffect(() => {
    setClassFeat(existingFeat)
  }, [existingFeat])

  useEffect(() => {
    fetch(
      `http://localhost:3000/api/feats?traits=${playerCharacter
        .getClassEntity()
        .name.toLowerCase()}`,
      {
        cache: 'no-store',
      }
    )
      .then((result) => result.json())
      .then((feats) => {
        let filtered = feats.filter((feat: Feat) => feat.level <= level)
        setFeats(filtered)
      })
  }, [playerCharacter.getTraits()])

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
