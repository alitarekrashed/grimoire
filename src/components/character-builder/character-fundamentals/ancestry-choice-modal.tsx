import { Ancestry } from '@/models/db/ancestry'
import { useContext, useEffect, useState } from 'react'
import { PlayerCharacterContext } from '../../character-display/player-character-context'
import { FeatureChoiceModal } from '../feature-choice-modal'
import { SourcedFeature } from '@/models/player-character'
import { CharacterEntity } from '@/models/db/character-entity'

export function AncestryChoiceModal({
  onUpdate,
}: {
  onUpdate: (updateFunction: (cloned: CharacterEntity) => void) => void
}) {
  const { playerCharacter } = useContext(PlayerCharacterContext)
  const [ancestries, setAncestries] = useState<Ancestry[]>([])

  useEffect(() => {
    fetch('http://localhost:3000/api/ancestries', {
      cache: 'no-store',
    })
      .then((result) => result.json())
      .then((ancestries) => {
        setAncestries(ancestries)
      })
  }, [])

  return (
    <>
      <FeatureChoiceModal
        label="Ancestry"
        entities={ancestries}
        initialId={playerCharacter.getAncestryId()}
        onSave={(ancestry) =>
          onUpdate((character: CharacterEntity) => {
            character.ancestry_id = ancestry._id.toString()
            character.attributes.ancestry = []
            character.languages = []
            character.heritage_id = ''
            character.features
              .filter(
                (val: SourcedFeature) =>
                  val.source === 'ANCESTRY' &&
                  val.feature.type === 'ANCESTRY_FEAT_SELECTION'
              )
              .forEach((val) => (val.feature.value = null))
          })
        }
      ></FeatureChoiceModal>
    </>
  )
}
