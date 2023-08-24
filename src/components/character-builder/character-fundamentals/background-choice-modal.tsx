import { Background } from '@/models/db/background'
import { CharacterEntity } from '@/models/db/character-entity'
import { Feat } from '@/models/db/feat'
import { SourcedFeature } from '@/models/player-character'
import { retrieveEntity } from '@/utils/services/reference-lookup.service'
import { cloneDeep } from 'lodash'
import { useContext, useEffect, useState } from 'react'
import { PlayerCharacterContext } from '../../character-display/player-character-context'
import { FeatureChoiceModal } from '../feature-choice-modal'
import { FeatSubChoiceModal } from '../level/feat-subchoice-modal'

export function BackgroundChoiceModal({
  onUpdate,
}: {
  onUpdate: (updateFunction: (cloned: CharacterEntity) => void) => void
}) {
  const { playerCharacter } = useContext(PlayerCharacterContext)
  const [featWithSubChoice, setFeatWithSubChoice] = useState<Feat>()
  const [backgrounds, setBackgrounds] = useState<Background[]>([])

  const getBackgroundFeatFromCharacter = () => {
    return playerCharacter
      .getLevelFeatures()
      .find(
        (sourced) =>
          sourced.source === 'BACKGROUND' && sourced.feature.type === 'FEAT'
      )!
  }

  const reloadFeat = (name: string) => {
    retrieveEntity(name, 'FEAT').then((val) => {
      if (val && (val as Feat).configuration) {
        setFeatWithSubChoice(val as Feat)
      } else {
        setFeatWithSubChoice(undefined)
      }
    })
  }

  useEffect(() => {
    fetch('http://localhost:3000/api/backgrounds', {
      cache: 'no-store',
    })
      .then((result) => result.json())
      .then((backgrounds) => {
        setBackgrounds(backgrounds)
      })

    reloadFeat(getBackgroundFeatFromCharacter().feature.value)
  }, [])

  const updateBackground = (background: Background) => {
    onUpdate((character: CharacterEntity) => {
      character.background_id = background._id.toString()
      character.attributes.background = []
      character.features = character.features.filter(
        (value) => value.source !== 'BACKGROUND'
      )
      character.features.push({
        source: 'BACKGROUND',
        feature: {
          type: 'FEAT',
          value: background.feat,
          context: [],
        },
      })
      character.features.push(
        ...background.skills.map((value: ProficiencyFeatureValue) => {
          return {
            source: 'BACKGROUND',
            feature: {
              type: 'PROFICIENCY' as FeatureType,
              value: value,
            },
          }
        })
      )
    })

    reloadFeat(background.feat)
  }

  const handleSubChoiceChange = (value: string) => {
    const updated: SourcedFeature = cloneDeep(getBackgroundFeatFromCharacter())
    updated.feature.context = [value]

    onUpdate((character: CharacterEntity) => {
      let indexToReplace = character.features.findIndex(
        (sourced: SourcedFeature) =>
          sourced.source === 'BACKGROUND' && sourced.feature.type === 'FEAT'
      )

      character.features.splice(indexToReplace, 1, updated)
    })
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
            choice={getBackgroundFeatFromCharacter().feature.context![0]}
            onChange={handleSubChoiceChange}
          ></FeatSubChoiceModal>
        </div>
      )}
    </>
  )
}
