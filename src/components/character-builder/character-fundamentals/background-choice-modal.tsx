import { Background } from '@/models/db/background'
import { useContext, useEffect, useState } from 'react'
import { FeatureChoiceModal } from '../feature-choice-modal'
import { PlayerCharacterContext } from '../../character-display/player-character-context'

export function BackgroundChoiceModal({
  onBackgroundChange,
}: {
  onBackgroundChange: (backgroundId: string) => void
}) {
  const { playerCharacter } = useContext(PlayerCharacterContext)
  const [backgrounds, setBackgrounds] = useState<Background[]>([])

  useEffect(() => {
    fetch('http://localhost:3000/api/backgrounds', {
      cache: 'no-store',
    })
      .then((result) => result.json())
      .then((backgrounds) => {
        setBackgrounds(backgrounds)
      })
  }, [])

  const updateBackground = (background: Background) => {
    onBackgroundChange(background._id.toString())
  }

  return (
    <>
      <FeatureChoiceModal
        label="Background"
        entities={backgrounds}
        initialId={playerCharacter.getBackgroundId()}
        onSave={updateBackground}
      ></FeatureChoiceModal>
    </>
  )
}
