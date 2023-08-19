import { Feat } from '@/models/db/feat'
import { ChoiceSelect } from '../choice-select/choice-select'

export function FeatSubChoiceModal({
  feat,
  choice,
  onChange,
}: {
  feat: Feat
  choice: string
  onChange: (value: string) => void
}) {
  return (
    <ChoiceSelect
      title={feat.configuration!.title}
      options={feat.configuration?.options!}
      value={choice}
      onChange={onChange}
    ></ChoiceSelect>
  )
}
