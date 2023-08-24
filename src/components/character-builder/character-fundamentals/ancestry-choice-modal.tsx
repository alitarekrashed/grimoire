import { Ancestry } from '@/models/db/ancestry'
import { PlayerCharacter } from '@/models/player-character'
import { useContext, useEffect, useState } from 'react'
import { PlayerCharacterContext } from '../../character-display/player-character-context'
import { FeatureChoiceModal } from '../feature-choice-modal'

export function AncestryChoiceModal({
  onUpdate,
}: {
  onUpdate: (
    updateFunction: (
      playerCharacter: PlayerCharacter
    ) => Promise<PlayerCharacter>
  ) => void
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
          onUpdate((playerCharacter) =>
            playerCharacter.updateAncestry(ancestry._id.toString())
          )
        }
      ></FeatureChoiceModal>
    </>
  )
}
