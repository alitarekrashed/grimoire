import { Background } from '@/models/db/background'
import { useContext, useEffect, useState } from 'react'
import { FeatureChoiceModal } from '../feature-choice-modal'
import { PlayerCharacterContext } from '../../character-display/player-character-context'
import { Feat } from '@/models/db/feat'
import { retrieveEntity } from '@/utils/services/reference-lookup.service'
import { EntityModel } from '@/models/db/entity-model'
import { SourcedFeature } from '@/models/player-character'
import { FeatSubChoiceModal } from '../level/feat-subchoice-modal'
import { cloneDeep } from 'lodash'

export function BackgroundChoiceModal({
  onBackgroundChange,
  onFeatSubchoiceChange,
}: {
  onBackgroundChange: (background: Background) => void
  onFeatSubchoiceChange: (sourced: SourcedFeature) => void
}) {
  const { playerCharacter } = useContext(PlayerCharacterContext)
  const [featWithSubChoice, setFeatWithSubChoice] = useState<Feat>()
  const [backgrounds, setBackgrounds] = useState<Background[]>([])

  useEffect(() => {
    fetch('http://localhost:3000/api/backgrounds', {
      cache: 'no-store',
    })
      .then((result) => result.json())
      .then((backgrounds) => {
        setBackgrounds(backgrounds)
      })

    retrieveEntity(
      playerCharacter
        .getLevelFeatures()
        .find(
          (sourced) =>
            sourced.source === 'BACKGROUND' && sourced.feature.type === 'FEAT'
        )!.feature.value,
      'FEAT'
    ).then((val) => {
      if (val && (val as Feat).configuration) {
        setFeatWithSubChoice(val as Feat)
      } else {
        setFeatWithSubChoice(undefined)
      }
    })
  }, [])

  const updateBackground = (background: Background) => {
    onBackgroundChange(background)
    retrieveEntity(background.feat, 'FEAT').then((val) => {
      if (val && (val as Feat).configuration) {
        setFeatWithSubChoice(val as Feat)
      } else {
        setFeatWithSubChoice(undefined)
      }
    })
  }

  const handleSubChoiceChange = (value: string) => {
    const updated = cloneDeep(
      playerCharacter
        .getLevelFeatures()
        .find(
          (sourced) =>
            sourced.source === 'BACKGROUND' && sourced.feature.type === 'FEAT'
        )
    )!
    updated.feature.context = [value]
    onFeatSubchoiceChange(updated)
  }

  return (
    <>
      <FeatureChoiceModal
        label="Background"
        entities={backgrounds}
        initialId={playerCharacter.getBackgroundId()}
        onSave={updateBackground}
      ></FeatureChoiceModal>
      {featWithSubChoice && (
        <div className="mt-1">
          <FeatSubChoiceModal
            feat={featWithSubChoice}
            choice={
              playerCharacter
                .getLevelFeatures()
                .find(
                  (sourced) =>
                    sourced.source === 'BACKGROUND' &&
                    sourced.feature.type === 'FEAT'
                )!.feature.context![0]
            }
            onChange={handleSubChoiceChange}
          ></FeatSubChoiceModal>
        </div>
      )}{' '}
    </>
  )
}
