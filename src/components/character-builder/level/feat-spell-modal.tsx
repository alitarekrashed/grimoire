import { retrieveSpellsByTraditionAndRank } from '@/utils/services/reference-lookup.service'
import { useEffect } from 'react'

export function FeatSpellModal({
  feat,
  choice,
  onChange,
}: {
  feat: Feat
  choice: string
  onChange: (value: string) => void
}) {
  useEffect(() => {
    retrieveSpellsByTraditionAndRank(['arcane'], ['0']).then((val) =>
      console.log(val)
    )
  })
  // need to get list of spells
  // just display for now
  // open in feature choice modal
  // hook up feature choice modal
  // maybe see about displaying and rendering on character sheet?

  return 'modal!'
}
