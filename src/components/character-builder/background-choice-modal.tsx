import { Background } from '@/models/db/background'
import { useEffect, useState } from 'react'
import { FeatureChoiceModal } from './feature-choice-modal'

export function BackgroundChoiceModal({
  backgroundId,
  onBackgroundChange,
}: {
  backgroundId: string
  onBackgroundChange: (backgroundId: string) => void
}) {
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
        entities={backgrounds}
        initialId={backgroundId}
        onSave={updateBackground}
      ></FeatureChoiceModal>
    </>
  )
}
