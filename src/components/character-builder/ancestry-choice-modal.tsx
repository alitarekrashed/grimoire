import { Ancestry } from '@/models/db/ancestry'
import { useEffect, useState } from 'react'
import { FeatureChoiceModal } from './feature-choice-modal'

export function AncestryChoiceModal({
  ancestryId,
  onAncestryEdit,
}: {
  ancestryId: string
  onAncestryEdit: (ancestryId: string) => void
}) {
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
        entities={ancestries}
        initialId={ancestryId}
        onSave={updateAncestry}
      ></FeatureChoiceModal>
    </>
  )
}
