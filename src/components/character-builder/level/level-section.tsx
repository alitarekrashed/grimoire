import { Feature } from '@/models/db/feature'
import { Subclass } from '@/models/db/subclass'
import { PlayerCharacter, SourcedFeature } from '@/models/player-character'
import { cloneDeep } from 'lodash'
import { useContext } from 'react'
import { PlayerCharacterContext } from '../../character-display/player-character-context'
import { CharacterLevelContext } from '../character-level-context'
import { SkillIncreaseModal } from '../skills/skill-increase-modal'
import { FeatChoiceModal } from './feat-choice-modal'
import { SubclassChoice } from './subclass-choice'
import { Separator } from '@/components/base/separator'

export function LevelSection({
  wrapCharacterUpdate,
}: {
  wrapCharacterUpdate: (promise: Promise<void>) => void
}) {
  const { playerCharacter, updatePlayerCharacter } = useContext(
    PlayerCharacterContext
  )
  const { level } = useContext(CharacterLevelContext)

  const handleFeatureUpdate =
    (original: SourcedFeature) => (replacement: SourcedFeature) => {
      let updated = cloneDeep(playerCharacter.getCharacter())

      const index = playerCharacter.getCharacter().features.indexOf(original)
      updated.features.splice(index, 1, replacement)

      const load: Promise<void> = (async () => {
        updatePlayerCharacter(await PlayerCharacter.build(updated))
      })()
      wrapCharacterUpdate(load)
    }

  const handleSubclassChange = (subclass: Subclass) => {
    const updated = cloneDeep(playerCharacter.getCharacter())
    const subclassChoice = updated.features.find(
      (value) => value.source === 'CLASS' && value.feature.type === 'SUBCLASS'
    )
    if (subclassChoice) {
      subclassChoice.feature.value = subclass._id

      updated.features = updated.features.filter(
        (value) => value.feature.type !== 'SUBCLASS_FEATURE'
      )

      const newFeatures = playerCharacter
        .getClassEntity()
        .features.filter((val) => val.type === 'SUBCLASS_FEATURE')

      newFeatures.forEach((subclassFeature: Feature) => {
        const matched = subclass.features.find(
          (feature) => feature.name === subclassFeature.name
        )
        if (matched) {
          subclassFeature.value = matched
        }
      })

      updated.features.push(
        ...newFeatures.map((feature: Feature) => {
          return { source: 'CLASS', feature: feature }
        })
      )
    }

    const load: Promise<void> = (async () => {
      updatePlayerCharacter(await PlayerCharacter.build(updated))
    })()
    wrapCharacterUpdate(load)
  }

  const featuresForLevel = playerCharacter
    .getLevelFeatures()
    .filter((sourced: SourcedFeature) => sourced.feature.level === level)

  return (
    <div key={`level-${level}`}>
      <Separator className="my-2"></Separator>
      <div>
        <span className="flex text-stone-300 mb-1">Level {level}</span>
        <div className="grid grid-cols-7 gap-2">
          {featuresForLevel
            .filter((sourced) => sourced.feature.type === 'SUBCLASS')
            .map((val, index) => (
              <div key={`${val.feature.name}-${index}`}>
                <SubclassChoice
                  onSubclassChange={handleSubclassChange}
                  onFeatureUpdate={handleFeatureUpdate}
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
              <div
                key={`${sourced.feature.name}-${index}`}
                className="flex flex-col gap-1"
              >
                <SkillIncreaseModal
                  key={`skills-${index}`}
                  skillFeature={sourced.feature}
                  onSkillsUpdate={(feature: Feature) => {
                    handleFeatureUpdate(sourced)({
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
                  handleFeatureUpdate(val)
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
          name="General"
          existingFeat={sourced}
          onChange={onChange}
          traits={['general']}
        ></FeatChoiceModal>
      )
    }
  }
}
