import { Ancestry } from '@/models/db/ancestry'
import { useContext, useEffect, useState } from 'react'
import { FeatureChoiceModal } from './feature-choice-modal'
import { PlayerCharacterContext } from '../character-display/player-character-context'

export function AncestryChoiceModal({
  onAncestryEdit,
}: {
  onAncestryEdit: (ancestryId: string) => void
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

  const updateAncestry = (ancestry: Ancestry) => {
    onAncestryEdit(ancestry._id.toString())
  }

  return (
    <>
      <FeatureChoiceModal
        label="Ancestry"
        entities={ancestries}
        initialId={playerCharacter.getAncestryId()}
        onSave={updateAncestry}
      ></FeatureChoiceModal>
    </>
  )
}
