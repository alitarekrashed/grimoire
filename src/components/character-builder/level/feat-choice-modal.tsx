import { Feat, Prerequisite } from '@/models/db/feat'
import { SourcedFeature } from '@/models/player-character'
import { useContext, useEffect, useState } from 'react'
import { FeatureChoiceModal } from '../feature-choice-modal'
import { cloneDeep } from 'lodash'
import { PlayerCharacterContext } from '../../character-display/player-character-context'
import { FeatSubChoiceSelect } from './feat-subchoice-select'
import { CharacterLevelContext } from '../character-level-context'
import { isGreaterThanOrEqualTo } from '@/utils/services/gear-proficiency-manager'
import { CalculatedProficiency, SkillType } from '@/models/statistic'
import { FeatSpellModal } from './feat-spell-modal'
import { SpellcastingManager } from '@/utils/services/spellcasting-manager'

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

  useEffect(() => {
    setFeat(existingFeat)
  }, [existingFeat])

  useEffect(() => {
    fetch(`http://localhost:3000/api/feats?traits=${traits}`, {
      cache: 'no-store',
    })
      .then((result) => result.json())
      .then((feats) => {
        const filterFeats = (feats: Feat[]): Feat[] => {
          let filtered = feats
            .filter((feat: Feat) => feat.level <= level)
            .filter((feat: Feat) => {
              if (feat.prerequisites) {
                return feat.prerequisites.every((prerequisite: Prerequisite) =>
                  evaluatePrerequisite(
                    prerequisite,
                    playerCharacter.getSkillProfciencyManager().getSkills(),
                    playerCharacter.getFeatNames(),
                    playerCharacter.getActions(),
                    playerCharacter.getSpellcastingManager(),
                    playerCharacter.getResolvedFeatures()
                  )
                )
              }
              return true
            })
            // TODO instead of filtering them out, should these be disabled??
            .filter((feat: Feat) => {
              if (feat.name === existingFeat.feature.value) {
                return true
              }
              return (
                playerCharacter.getFeatNames().includes(feat.name) === false ||
                feat.repeatable
              )
            })
          return filtered
        }

        let filtered: Feat[] = filterFeats(feats)
        filtered.sort((a, b) => b.level - a.level)
        setFeats(filtered)
      })
  }, [traits, existingFeat, level, playerCharacter])

  useEffect(() => {
    const matchFeat = () => {
      const matched = feats.find((val) => val.name === feat.feature.value)
      if (matched && matched.configuration) {
        setFeatWithSubChoice(matched)
      } else {
        setFeatWithSubChoice(undefined)
      }
    }
    matchFeat()
  }, [feat, feats])

  const handleSubChoiceChange = (value: string) => {
    const updated = cloneDeep(feat)
    updated.feature.context = [value]
    onChange(updated)
  }

  return (
    <>
      <div className="mb-1">
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
      </div>
      {featWithSubChoice && !featWithSubChoice.configuration!.type && (
        <FeatSubChoiceSelect
          feat={featWithSubChoice}
          choice={feat.feature.context ? feat.feature.context[0] : ''}
          onChange={handleSubChoiceChange}
        ></FeatSubChoiceSelect>
      )}
      {featWithSubChoice && featWithSubChoice.configuration!.type && (
        <FeatSpellModal
          feat={featWithSubChoice}
          choice={feat.feature.context ? feat.feature.context[0] : ''}
          onChange={handleSubChoiceChange}
        ></FeatSpellModal>
      )}
    </>
  )
}

function evaluatePrerequisite(
  prerequisite: Prerequisite,
  skillMap: Map<string, CalculatedProficiency>,
  featNames: string[],
  actions: SourcedFeature[],
  spellcastingManager: SpellcastingManager,
  features: SourcedFeature[]
): boolean {
  switch (prerequisite.type) {
    case 'SKILL':
      return isGreaterThanOrEqualTo(
        skillMap.get(prerequisite.value.skill)!.rank,
        prerequisite.value.minimum_rank
      )
    case 'FEAT':
      return featNames
        .map((name) => name.toLowerCase())
        .includes(prerequisite.value.toLowerCase())
    case 'ACTION':
      return actions
        .map((sourced) => sourced.feature.value)
        .includes(prerequisite.value)
    case 'SPELL_TYPE':
      return spellcastingManager.getTypes().includes(prerequisite.value)
    case 'FEATURE':
      return !!features.find(
        (val) =>
          val.feature.name?.toLowerCase() === prerequisite.value.toLowerCase()
      )
    default:
      return true
  }
}
