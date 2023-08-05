import { Ancestry } from '@/models/db/ancestry'
import { useEffect, useState } from 'react'
import { FeatureChoiceModal } from './feature-choice-modal'
import { Heritage } from '@/models/db/heritage'

export function HeritageChoiceModal({
  heritageId,
  ancestry,
  onHeritageChange,
}: {
  heritageId: string
  ancestry: Ancestry
  onHeritageChange: (heritageId: string) => void
}) {
  const [heritages, setHeritages] = useState<Heritage[]>([])

  useEffect(() => {
    fetch(`http://localhost:3000/api/heritages?ancestry=${ancestry.name}`, {
      cache: 'no-store',
    })
      .then((result) => result.json())
      .then((heritages) => {
        setHeritages(heritages)
      })
  }, [ancestry._id])

  const updateHeritage = (heritage: Heritage) => {
    onHeritageChange(heritage._id.toString())
  }

  return (
    <>
      <FeatureChoiceModal
        label="Heritage"
        entities={heritages}
        initialId={heritageId}
        onSave={updateHeritage}
      ></FeatureChoiceModal>
    </>
  )
}
