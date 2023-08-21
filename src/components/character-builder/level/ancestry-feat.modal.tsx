import { Feat } from '@/models/db/feat'
import { SourcedFeature } from '@/models/player-character'
import { useContext, useEffect, useState } from 'react'
import { FeatureChoiceModal } from '../feature-choice-modal'
import { cloneDeep } from 'lodash'
import { PlayerCharacterContext } from '../../character-display/player-character-context'
import { FeatSubChoiceModal } from './feat-subchoice-modal'
import { CharacterLevelContext } from '../character-level-context'

export function AncestryFeatChoiceModal({
  existingFeat,
  onChange,
}: {
  existingFeat: SourcedFeature
  onChange: (sourcedFeature: SourcedFeature[]) => void
}) {
  const { playerCharacter } = useContext(PlayerCharacterContext)
  const { level } = useContext(CharacterLevelContext)
  const [ancestryFeat, setAncestryFeat] = useState<SourcedFeature>(existingFeat)
  const [featWithSubChoice, setFeatWithSubChoice] = useState<Feat>()
  const [feats, setFeats] = useState<Feat[]>([])

  const matchFeat = () => {
    const matched = feats.find((val) => val.name === ancestryFeat.feature.value)
    if (matched && matched.configuration) {
      setFeatWithSubChoice(matched)
    } else {
      setFeatWithSubChoice(undefined)
    }
  }

  useEffect(() => {
    setAncestryFeat(existingFeat)
  }, [existingFeat])

  useEffect(() => {
    fetch(
      `http://localhost:3000/api/feats?traits=${playerCharacter.getTraits()}`,
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

  useEffect(() => {
    matchFeat()
  }, [ancestryFeat, feats])

  const handleSubChoiceChange = (value: string) => {
    const updated = cloneDeep(ancestryFeat)
    updated.feature.context = [value]
    onChange([updated])
  }

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
          updated.feature.context = []
          onChange([updated])
        }}
        onClear={() => {
          const updated = cloneDeep(ancestryFeat)
          updated.feature.value = null!
          onChange([updated])
        }}
      ></FeatureChoiceModal>
      {featWithSubChoice && (
        <div className="mt-1">
          <FeatSubChoiceModal
            feat={featWithSubChoice}
            choice={ancestryFeat.feature.context![0]}
            onChange={handleSubChoiceChange}
          ></FeatSubChoiceModal>
        </div>
      )}
    </>
  )
}
