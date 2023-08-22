import { Feature } from '@/models/db/feature'
import { Subclass } from '@/models/db/subclass'
import { PlayerCharacter, SourcedFeature } from '@/models/player-character'
import { useContext, useEffect, useState } from 'react'
import { PlayerCharacterContext } from '../../character-display/player-character-context'
import { FeatureChoiceModal } from '../feature-choice-modal'
import { SkillIncreaseModal } from '../skills/skill-increase-modal'

export function SubclassChoice({
  onSubclassChange,
  onFeatureUpdate,
}: {
  onSubclassChange: (subclass: Subclass) => void
  onFeatureUpdate: (
    feature: SourcedFeature
  ) => (feature: SourcedFeature) => void
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
      {getSubclassSkillSelections(playerCharacter) && (
        <div className="mt-1">
          <SkillIncreaseModal
            skillFeature={
              getSubclassSkillSelections(playerCharacter)!.feature.value
            }
            onSkillsUpdate={(feature: Feature) => {
              onFeatureUpdate(getSubclassSkillSelections(playerCharacter)!)(
                mapSubclassFeatureSkillSelection(feature)
              )
            }}
          ></SkillIncreaseModal>
        </div>
      )}{' '}
    </>
  )
}

function mapSubclassFeatureSkillSelection(value: Feature): SourcedFeature {
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
): SourcedFeature | undefined {
  return playerCharacter
    .getLevelFeatures()
    .find(
      (sourced: SourcedFeature) =>
        sourced.source === 'CLASS' &&
        sourced.feature.type === 'SUBCLASS_FEATURE' &&
        sourced.feature.value.type === 'SKILL_SELECTION'
    )
}
