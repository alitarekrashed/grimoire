import { Feat, Prerequisite } from '@/models/db/feat'
import { SourcedFeature } from '@/models/player-character'
import { useContext, useEffect, useState } from 'react'
import { FeatureChoiceModal } from '../feature-choice-modal'
import { cloneDeep } from 'lodash'
import { PlayerCharacterContext } from '../../character-display/player-character-context'
import { FeatSubChoiceModal } from './feat-subchoice-modal'
import { CharacterLevelContext } from '../character-level-context'
import { isGreaterThanOrEqualTo } from '@/utils/services/gear-proficiency-manager'
import { CalculatedProficiency, SkillType } from '@/models/statistic'

export function FeatChoiceModal({
  name,
  traits,
  existingFeat,
  onChange,
}: {
  name: string
  traits: string[]
  existingFeat: SourcedFeature
  onChange: (sourcedFeature: SourcedFeature) => void
}) {
  const { playerCharacter } = useContext(PlayerCharacterContext)
  const { level } = useContext(CharacterLevelContext)
  const [feat, setFeat] = useState<SourcedFeature>(existingFeat)
  const [featWithSubChoice, setFeatWithSubChoice] = useState<Feat>()
  const [feats, setFeats] = useState<Feat[]>([])

  const matchFeat = () => {
    const matched = feats.find((val) => val.name === feat.feature.value)
    if (matched && matched.configuration) {
      setFeatWithSubChoice(matched)
    } else {
      setFeatWithSubChoice(undefined)
    }
  }

  const filterFeats = (
    feats: Feat[],
    level: number,
    skillMap: Map<string, CalculatedProficiency>
  ): Feat[] => {
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

  useEffect(() => {
    setFeat(existingFeat)
  }, [existingFeat])

  useEffect(() => {
    fetch(`http://localhost:3000/api/feats?traits=${traits}`, {
      cache: 'no-store',
    })
      .then((result) => result.json())
      .then((feats) => {
        let filtered: Feat[] = filterFeats(
          feats,
          level,
          playerCharacter.getSkillProfciencyManager().getSkills()
        )
        filtered.sort((a, b) => b.level - a.level)
        setFeats(filtered)
      })
  }, [playerCharacter.getTraits()])

  useEffect(() => {
    matchFeat()
  }, [feat, feats])

  const handleSubChoiceChange = (value: string) => {
    const updated = cloneDeep(feat)
    updated.feature.context = [value]
    onChange(updated)
  }

  return (
    <>
      <FeatureChoiceModal
        label={`${name} Feat`}
        entities={feats}
        initialId={existingFeat.feature.value ?? ''}
        idField="name"
        onSave={(val: Feat) => {
          const updated = cloneDeep(feat)
          updated.feature.value = val.name
          updated.feature.context = []
          onChange(updated)
        }}
        onClear={() => {
          const updated = cloneDeep(feat)
          updated.feature.value = null!
          onChange(updated)
        }}
      ></FeatureChoiceModal>
      {featWithSubChoice && (
        <div className="mt-1">
          <FeatSubChoiceModal
            feat={featWithSubChoice}
            choice={feat.feature.context ? feat.feature.context[0] : ''}
            onChange={handleSubChoiceChange}
          ></FeatSubChoiceModal>
        </div>
      )}
    </>
  )
}

function evaluatePrerequisite(
  prerequisite: Prerequisite,
  skillMap: Map<string, CalculatedProficiency>
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
