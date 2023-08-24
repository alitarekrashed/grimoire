import { CharacterEntity } from '@/models/db/character-entity'
import { Feature } from '@/models/db/feature'
import { Subclass } from '@/models/db/subclass'
import { PlayerCharacter, SourcedFeature } from '@/models/player-character'
import * as Separator from '@radix-ui/react-separator'
import { cloneDeep } from 'lodash'
import { useContext } from 'react'
import { PlayerCharacterContext } from '../../character-display/player-character-context'
import { CharacterLevelContext } from '../character-level-context'
import { SkillIncreaseModal } from '../skills/skill-increase-modal'
import { FeatChoiceModal } from './feat-choice-modal'
import { SubclassChoice } from './subclass-choice'

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
        <div className="grid grid-cols-7 gap-2">
          {featuresForLevel
            .filter((sourced) => sourced.feature.type === 'SUBCLASS')
            .map((val) => (
              <div>
                <SubclassChoice
                  onSubclassChange={handleSubclassChange}
                  onFeatureUpdate={alternateHandleFeatureUpdate}
                ></SubclassChoice>
              </div>
            ))}
          {featuresForLevel
            .filter(
              (sourced) =>
                sourced.source === 'CLASS' &&
                sourced.feature.type === 'SKILL_SELECTION'
            )
            .map((sourced, index) => (
              <div className="flex flex-col gap-1">
                <SkillIncreaseModal
                  key={`skills-${index}`}
                  skillFeature={sourced.feature}
                  onSkillsUpdate={(feature: Feature) => {
                    alternateHandleFeatureUpdate(sourced)({
                      source: 'CLASS',
                      feature: feature,
                    })
                  }}
                ></SkillIncreaseModal>
              </div>
            ))}
          {featuresForLevel
            .filter(
              (value) =>
                value.feature.type === 'CLASS_FEAT_SELECTION' ||
                value.feature.type === 'ANCESTRY_FEAT_SELECTION' ||
                value.feature.type === 'SKILL_FEAT_SELECTION' ||
                value.feature.type === 'GENERAL_FEAT_SELECTION'
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
    case 'GENERAL_FEAT_SELECTION': {
      return (
        <FeatChoiceModal
          name="Skill"
          existingFeat={sourced}
          onChange={onChange}
          traits={['general']}
        ></FeatChoiceModal>
      )
    }
  }
}
