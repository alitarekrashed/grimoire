import { CharacterEntity } from '@/models/db/character-entity'
import { Feature } from '@/models/db/feature'
import { Subclass } from '@/models/db/subclass'
import { PlayerCharacter, SourcedFeature } from '@/models/player-character'
import * as Separator from '@radix-ui/react-separator'
import { cloneDeep, replace } from 'lodash'
import { useContext } from 'react'
import { PlayerCharacterContext } from '../../character-display/player-character-context'
import { CharacterLevelContext } from '../character-level-context'
import { MultipleSkillSelect } from '../skills/multiple-skill-select'
import { FeatChoiceModal } from './feat-choice-modal'
import { SubclassChoice } from './subclass-choice'
import { SkillIncreaseModal } from '../skills/skill-increase-modal'

export function LevelSection({
  wrapCharacterUpdate,
}: {
  wrapCharacterUpdate: (promise: Promise<void>) => void
}) {
  const { playerCharacter, updatePlayerCharacter } = useContext(
    PlayerCharacterContext
  )
  const { level } = useContext(CharacterLevelContext)

  const loadCharacter = (updated: CharacterEntity) => {
    const load: Promise<void> = (async () => {
      updatePlayerCharacter(await PlayerCharacter.build(updated))
    })()
    wrapCharacterUpdate(load)
  }

  const handleFeatureUpdateForLevel =
    (level?: number) =>
    (matchingFunction: (source: SourcedFeature) => boolean) =>
    (features: SourcedFeature[]) => {
      let updated = cloneDeep(playerCharacter.getCharacter())

      let toReplace = updated.features.filter((sourced) =>
        matchingFunction(sourced)
      )

      if (level) {
        toReplace = toReplace.filter(
          (sourced) => sourced.feature.level == level
        )
      }

      toReplace.forEach((item, idx) => {
        const index = updated.features.indexOf(item)
        updated.features.splice(index, 1, features[idx])
      })
      loadCharacter(updated)
    }

  const alternateHandleFeatureUpdate =
    (original: SourcedFeature) => (replacement: SourcedFeature) => {
      let updated = cloneDeep(playerCharacter.getCharacter())

      const index = playerCharacter.getCharacter().features.indexOf(original)
      updated.features.splice(index, 1, replacement)

      loadCharacter(updated)
    }

  const handleSubclassChange = (subclass: Subclass) => {
    const load: Promise<void> = (async () => {
      const value: PlayerCharacter = await playerCharacter.updateSubclass(
        subclass
      )
      updatePlayerCharacter(value)
    })()
    wrapCharacterUpdate(load)
  }

  const featuresForLevel = playerCharacter
    .getLevelFeatures()
    .filter((sourced: SourcedFeature) => sourced.feature.level === level)
  return (
    <div key={`level-${level}`}>
      <Separator.Root
        className="w-full bg-stone-300/50 h-px"
        style={{ margin: '10px 0' }}
      />
      <div>
        <span className="flex text-stone-300 mb-1">Level {level}</span>
        <div className="inline-flex gap-2">
          {/* TODO: this needs to be improved, i dont like level specific filtering here.... */}
          {level === 1 && playerCharacter.getSubclassIfAvailable() && (
            <div>
              <SubclassChoice
                onSubclassChange={handleSubclassChange}
                onFeatureUpdate={handleFeatureUpdateForLevel(level)(
                  (sourced) =>
                    sourced.source === 'CLASS' &&
                    sourced.feature.type === 'SUBCLASS_FEATURE' &&
                    sourced.feature.value.type === 'SKILL_SELECTION'
                )}
              ></SubclassChoice>
            </div>
          )}
          <div>
            <MultipleSkillSelect
              skillFeatures={featuresForLevel
                .filter(
                  (sourced) =>
                    sourced.source === 'CLASS' &&
                    sourced.feature.type === 'SKILL_SELECTION'
                )
                .map((sourced) => sourced.feature)}
              onSkillsUpdate={(features: Feature[]) => {
                handleFeatureUpdateForLevel(level)(
                  (source: SourcedFeature) =>
                    source.source === 'CLASS' &&
                    source.feature.type === 'SKILL_SELECTION'
                )(
                  features.map((feature) => {
                    return {
                      source: 'CLASS',
                      feature: feature,
                    }
                  })
                )
              }}
            ></MultipleSkillSelect>
          </div>
          <div>
            <SkillIncreaseModal
              skillFeatures={featuresForLevel
                .filter(
                  (sourced) =>
                    sourced.source === 'CLASS' &&
                    sourced.feature.type === 'SKILL_SELECTION'
                )
                .map((sourced) => sourced.feature)}
              onSkillsUpdate={(features: Feature[]) => {
                handleFeatureUpdateForLevel(level)(
                  (source: SourcedFeature) =>
                    source.source === 'CLASS' &&
                    source.feature.type === 'SKILL_SELECTION'
                )(
                  features.map((feature) => {
                    return {
                      source: 'CLASS',
                      feature: feature,
                    }
                  })
                )
              }}
            ></SkillIncreaseModal>
          </div>

          {featuresForLevel
            .filter(
              (value) =>
                value.feature.type === 'CLASS_FEAT_SELECTION' ||
                value.feature.type === 'ANCESTRY_FEAT_SELECTION' ||
                value.feature.type === 'SKILL_FEAT_SELECTION'
            )
            .map((val: SourcedFeature, index: number) => (
              <div key={`${val.source}-${index}`}>
                {buildFeatChoice(
                  playerCharacter,
                  val,
                  alternateHandleFeatureUpdate(val)
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

function buildFeatChoice(
  playerCharacter: PlayerCharacter,
  sourced: SourcedFeature,
  onChange: (replacement: SourcedFeature) => void
) {
  switch (sourced.feature.type) {
    case 'CLASS_FEAT_SELECTION': {
      return (
        <FeatChoiceModal
          name="Class"
          existingFeat={sourced}
          onChange={onChange}
          traits={[playerCharacter.getClassEntity().name.toLowerCase()]}
        ></FeatChoiceModal>
      )
    }
    case 'ANCESTRY_FEAT_SELECTION':
      return (
        <FeatChoiceModal
          name="Ancestry"
          existingFeat={sourced}
          onChange={onChange}
          traits={playerCharacter.getTraits()}
        ></FeatChoiceModal>
      )
    case 'SKILL_FEAT_SELECTION': {
      return (
        <FeatChoiceModal
          name="Skill"
          existingFeat={sourced}
          onChange={onChange}
          traits={['skill']}
        ></FeatChoiceModal>
      )
    }
  }
}
