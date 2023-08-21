import { Feat, Prerequisite } from '@/models/db/feat'
import { SourcedFeature } from '@/models/player-character'
import { cloneDeep } from 'lodash'
import { useContext, useEffect, useState } from 'react'
import { PlayerCharacterContext } from '../../character-display/player-character-context'
import { CharacterLevelContext } from '../character-level-context'
import { FeatureChoiceModal } from '../feature-choice-modal'
import {
  getGreaterThan,
  isGreaterThanOrEqualTo,
} from '@/utils/services/gear-proficiency-manager'
import { CalculatedProficiency, SkillType } from '@/models/statistic'

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
        setFeats(filterFeats(feats, level, playerCharacter.getSkills()))
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

function filterFeats(
  feats: Feat[],
  level: number,
  skillMap: Map<SkillType, CalculatedProficiency>
): Feat[] {
  let filtered = feats
    .filter((feat: Feat) => feat.level <= level)
    .filter((feat: Feat) => {
      if (feat.prerequisites) {
        return feat.prerequisites.every((prerequisite: Prerequisite) =>
          evaluatePrerequisite(prerequisite, skillMap)
        )
      }
      return true
    })
  return filtered
}

function evaluatePrerequisite(
  prerequisite: Prerequisite,
  skillMap: Map<SkillType, CalculatedProficiency>
): boolean {
  switch (prerequisite.type) {
    case 'SKILL':
      return isGreaterThanOrEqualTo(
        skillMap.get(prerequisite.value.skill)!.rank,
        prerequisite.value.minimum_rank
      )
    default:
      return true
  }
}
