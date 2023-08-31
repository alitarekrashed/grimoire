import { Spell } from '@/models/db/spell'
import { retrieveSpellsByTraditionAndRank } from '@/utils/services/reference-lookup.service'
import { useEffect, useState } from 'react'
import { FeatureChoiceModal } from '../feature-choice-modal'
import { Feat, SpellSelectionOption } from '@/models/db/feat'
import { cloneDeep } from 'lodash'

export function FeatSpellModal({
  feat,
  choice,
  onChange,
}: {
  feat: Feat
  choice: string
  onChange: (value: string) => void
}) {
  const [selection, setSelection] = useState<string>(choice ?? '')
  const [spells, setSpells] = useState<Spell[]>([])

  useEffect(() => {
    const configuration = feat.configuration!.options as SpellSelectionOption
    retrieveSpellsByTraditionAndRank(
      [configuration.tradition],
      [configuration.rank.toString()]
    ).then((val) => setSpells(val))
  }, [feat])

  const handleChange = (val: string) => {
    setSelection(val)
    onChange(val)
  }
  // need to get list of spells
  // just display for now
  // open in feature choice modal
  // hook up feature choice modal
  // maybe see about displaying and rendering on character sheet?

  return (
    <>
      <FeatureChoiceModal
        label={feat.configuration!.options.rank === 0 ? 'Cantrip' : 'Spell'}
        entities={spells}
        initialId={selection}
        idField="name"
        onSave={(val: Spell) => handleChange(val.name)}
        onClear={() => handleChange(choice)}
      ></FeatureChoiceModal>
    </>
  )
}
