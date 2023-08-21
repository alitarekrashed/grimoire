import { PlayerCharacter, SourcedFeature } from '@/models/player-character'
import { SubclassChoice } from './subclass-choice'
import { MultipleSkillSelect } from '../skills/multiple-skill-select'
import * as Separator from '@radix-ui/react-separator'
import { useContext } from 'react'
import { PlayerCharacterContext } from '../../character-display/player-character-context'
import { ClassFeatChoiceModal } from './class-feat.modal'
import { AncestryFeatChoiceModal } from './ancestry-feat.modal'
import { cloneDeep } from 'lodash'
import { CharacterEntity } from '@/models/db/character-entity'
import { Subclass } from '@/models/db/subclass'
import { Feature } from '@/models/db/feature'
import { CharacterLevelContext } from '../character-level-context'

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
        toReplace = toReplace.filter((sourced) => sourced.feature.level)
      }

      toReplace.forEach((item, idx) => {
        const index = updated.features.indexOf(item)
        updated.features.splice(index, 1, features[idx])
      })
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
          {playerCharacter.getSubclassIfAvailable() && (
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
          {featuresForLevel
            .filter(
              (value) =>
                value.feature.type === 'CLASS_FEAT_SELECTION' ||
                value.feature.type === 'ANCESTRY_FEAT_SELECTION' ||
                value.feature.type === 'SKILL_FEAT_SELECTION'
            )
            .map((val: SourcedFeature, index: number) => (
              <div key={`${val.source}-${index}`}>
                {buildFeatChoice(val, handleFeatureUpdateForLevel(level))}
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

function buildFeatChoice(
  sourced: SourcedFeature,
  onChange: (
    matchingFunction: (source: SourcedFeature) => boolean
  ) => (features: SourcedFeature[]) => void
) {
  switch (sourced.source) {
    case 'CLASS': {
      return (
        <ClassFeatChoiceModal
          existingFeat={sourced}
          onChange={onChange(
            (source: SourcedFeature) =>
              source.feature.type === 'CLASS_FEAT_SELECTION'
          )}
        ></ClassFeatChoiceModal>
      )
    }
    case 'ANCESTRY':
      return (
        <AncestryFeatChoiceModal
          existingFeat={sourced}
          onChange={onChange(
            (source: SourcedFeature) =>
              source.feature.type === 'ANCESTRY_FEAT_SELECTION'
          )}
        ></AncestryFeatChoiceModal>
      )
  }
}
