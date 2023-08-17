import { Heritage } from '@/models/db/heritage'
import { useContext, useEffect, useState } from 'react'
import { PlayerCharacterContext } from '../character-display/player-character-context'
import { FeatureChoiceModal } from './feature-choice-modal'

export function HeritageChoiceModal({
  onHeritageChange,
}: {
  onHeritageChange: (heritageId: string) => void
}) {
  const { playerCharacter } = useContext(PlayerCharacterContext)
  const [heritages, setHeritages] = useState<Heritage[]>([])

  useEffect(() => {
    fetch(
      `http://localhost:3000/api/heritages?ancestry=${
        playerCharacter.getAncestry().name
      }`,
      {
        cache: 'no-store',
      }
    )
      .then((result) => result.json())
      .then((heritages) => {
        setHeritages(heritages)
      })
  }, [playerCharacter.getAncestry()._id])

  const updateHeritage = (heritage: Heritage) => {
    onHeritageChange(heritage._id.toString())
  }

  return (
    <>
      <FeatureChoiceModal
        label="Heritage"
        entities={heritages}
        initialId={playerCharacter.getHeritageId()}
        onSave={updateHeritage}
      ></FeatureChoiceModal>
    </>
  )
}
