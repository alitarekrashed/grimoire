import { Feat, Prerequisite } from '@/models/db/feat'
import {
  Attributes,
  PlayerCharacter,
  SourcedFeature,
} from '@/models/player-character'
import { ProficiencyRank } from '@/models/proficiency-rank'
import { CalculatedProficiency } from '@/models/statistic'
import { caseInsensitiveMatch } from '@/utils/helpers'
import { SpellcastingManager } from '@/utils/services/spellcasting-manager'
import { cloneDeep } from 'lodash'
import { useContext, useEffect, useState } from 'react'
import { PlayerCharacterContext } from '../../character-display/player-character-context'
import { CharacterLevelContext } from '../character-level-context'
import { FeatureChoiceModal } from '../feature-choice-modal'
import { FeatSpellModal } from './feat-spell-modal'
import { FeatSubChoiceSelect } from './feat-subchoice-select'

type FeatChoice = Feat & { disabled: boolean; selected: boolean }

function isDisabled(feat: Feat, playerCharacter: PlayerCharacter) {
  if (feat.prerequisites) {
    return !feat.prerequisites.every((prerequisite: Prerequisite) =>
      evaluatePrerequisite(
        prerequisite,
        playerCharacter.getSkillProfciencyManager().getSkills(),
        playerCharacter.getFeatNames(),
        playerCharacter.getActions(),
        playerCharacter.getSpellcastingManager(),
        playerCharacter.getResolvedFeatures(),
        playerCharacter.getSubclassNames(),
        playerCharacter.getAttributes()
      )
    )
  }
  return !true
}

function isSelected(
  feat: Feat,
  existingFeat: SourcedFeature,
  playerCharacter: PlayerCharacter
) {
  if (feat.name === existingFeat.feature.value) {
    return !true
  }
  return !(
    playerCharacter.getFeatNames().includes(feat.name) === false ||
    feat.repeatable
  )
}

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
  const [feats, setFeats] = useState<FeatChoice[]>([])

  useEffect(() => {
    setFeat(existingFeat)
  }, [existingFeat])

  useEffect(() => {
    fetch(`http://localhost:3000/api/feats?traits=${traits}`, {
      cache: 'no-store',
    })
      .then((result) => result.json())
      .then((feats) => {
        const filterFeats = (feats: Feat[]): FeatChoice[] => {
          let filtered = feats
            .filter((feat: Feat) => feat.level <= level)
            .map((feat: Feat) => {
              return {
                ...feat,
                disabled:
                  isDisabled(feat, playerCharacter) ||
                  isSelected(feat, existingFeat, playerCharacter),
                selected: isSelected(feat, existingFeat, playerCharacter),
              }
            })
          return filtered
        }

        let filtered: FeatChoice[] = filterFeats(feats)

        filtered.sort((a, b) => a.level - b.level)
        filtered.sort((a, b) => {
          if (a.disabled && b.disabled) {
            return 0
          } else if (a.disabled) {
            return 1
          }
          return -1
        })
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
          onSave={(val: FeatChoice) => {
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
  features: SourcedFeature[],
  subclasses: string[],
  attributes: Attributes
): boolean {
  switch (prerequisite.type) {
    case 'SKILL':
      return ProficiencyRank.isGreaterThanOrEqualTo(
        skillMap.get(prerequisite.value.skill)!.rank,
        ProficiencyRank.get(prerequisite.value.minimum_rank)
      )
    case 'FEAT':
      return featNames.some((name) =>
        caseInsensitiveMatch(name, prerequisite.value)
      )
    case 'ACTION':
      return actions
        .map((sourced) => sourced.feature.value)
        .includes(prerequisite.value)
    case 'SPELL_TYPE':
      return spellcastingManager.getTypes().includes(prerequisite.value)
    case 'FEATURE':
      return features.some((val) =>
        caseInsensitiveMatch(val.feature.name, prerequisite.value)
      )
    case 'SUBCLASS':
      return subclasses.some((val) =>
        caseInsensitiveMatch(val, prerequisite.value)
      )
    case 'ATTRIBUTE':
      return (
        attributes[prerequisite.value.attribute as keyof Attributes] >=
        prerequisite.value.modifier
      )
    case 'SENSE':
      return features.some(
        (val) =>
          caseInsensitiveMatch(val.feature.value, prerequisite.value) &&
          caseInsensitiveMatch(val.feature.type, prerequisite.type)
      )
    default:
      return true
  }
}
