import { Subclass } from '@/models/db/subclass'
import { useContext, useEffect, useState } from 'react'
import { PlayerCharacterContext } from '../character-display/player-character-context'
import { FeatureChoiceModal } from './feature-choice-modal'
import { SourcedFeature } from '@/models/player-character'
import { Feature } from '@/models/db/feature'
import { SkillSelect } from './skills/skill-select'

export function SubclassChoiceModal({
  onSubclassChange,
  onFeatureUpdate,
}: {
  onSubclassChange: (subclass: Subclass) => void
  onFeatureUpdate: (features: SourcedFeature[]) => void
}) {
  const { playerCharacter } = useContext(PlayerCharacterContext)
  const [subclasses, setSubclasses] = useState<Subclass[]>([])

  useEffect(() => {
    fetch(
      `http://localhost:3000/api/subclasses?class_name=${playerCharacter
        .getClassEntity()
        .name.toLowerCase()}`,
      {
        cache: 'no-store',
      }
    )
      .then((result) => result.json())
      .then((subclasses) => {
        setSubclasses(subclasses)
      })
  }, [])

  const updateSubclass = (subclass: Subclass) => {
    onSubclassChange(subclass)
  }

  return (
    <>
      <FeatureChoiceModal
        label={playerCharacter.getSubclassIfAvailable()!.name!}
        entities={subclasses}
        initialId={playerCharacter.getSubclassIfAvailable()!.value ?? ''}
        onSave={updateSubclass}
      ></FeatureChoiceModal>
      {getSubclassSkillSelections(playerCharacter).length > 0 && (
        <div className="mt-1">
          <SkillSelect
            skillFeature={
              getSubclassSkillSelections(playerCharacter).map(
                (sourced) => sourced.feature.value
              )[0]
            }
            onSkillsUpdate={(features: Feature[]) => {
              onFeatureUpdate(
                features.map((value) => mapSubclassFeatureSkillSelection(value))
              )
            }}
          ></SkillSelect>
        </div>
      )}{' '}
    </>
  )
}

function mapSubclassFeatureSkillSelection(value: Feature): SourcedFeature {
  console.log(value)
  return {
    source: 'CLASS',
    feature: {
      type: 'SUBCLASS_FEATURE',
      value: value,
    },
  }
}

function getSubclassSkillSelections(
  playerCharacter: PlayerCharacter
): SourcedFeature[] {
  return playerCharacter
    .getLevelFeatures()
    .filter(
      (sourced: SourcedFeature) =>
        sourced.source === 'CLASS' &&
        sourced.feature.type === 'SUBCLASS_FEATURE' &&
        sourced.feature.value.type === 'SKILL_SELECTION'
    )
}
