import { Feat } from '@/models/db/feat'
import { SourcedFeature } from '@/models/player-character'
import { cloneDeep } from 'lodash'
import { useContext, useEffect, useState } from 'react'
import { PlayerCharacterContext } from '../../character-display/player-character-context'
import { CharacterLevelContext } from '../character-level-context'
import { FeatureChoiceModal } from '../feature-choice-modal'

export function SkillFeatChoiceModal({
  existingFeat,
  onChange,
}: {
  existingFeat: SourcedFeature
  onChange: (sourcedFeature: SourcedFeature[]) => void
}) {
  const { playerCharacter } = useContext(PlayerCharacterContext)
  const { level } = useContext(CharacterLevelContext)
  const [skillFeat, setSkillFeat] = useState<SourcedFeature>(existingFeat)
  const [feats, setFeats] = useState<Feat[]>([])

  useEffect(() => {
    setSkillFeat(existingFeat)
  }, [existingFeat])

  useEffect(() => {
    fetch(`http://localhost:3000/api/feats?traits=skill`, {
      cache: 'no-store',
    })
      .then((result) => result.json())
      .then((feats) => {
        let filtered = feats.filter((feat: Feat) => feat.level <= level)
        setFeats(filtered)
      })
  }, [playerCharacter.getTraits()])

  return (
    <>
      <FeatureChoiceModal
        label="Skill Feat"
        entities={feats}
        initialId={existingFeat.feature.value ?? ''}
        idField="name"
        onSave={(feat: Feat) => {
          const updated = cloneDeep(skillFeat)
          updated.feature.value = feat.name
          updated.feature.context = []
          onChange([updated])
        }}
        onClear={() => {
          const updated = cloneDeep(skillFeat)
          updated.feature.value = null!
          onChange([updated])
        }}
      ></FeatureChoiceModal>
    </>
  )
}
