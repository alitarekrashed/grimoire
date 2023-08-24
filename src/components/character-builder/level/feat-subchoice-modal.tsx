import { Feat } from '@/models/db/feat'
import { ChoiceSelect } from '../../choice-select/choice-select'
import { useState } from 'react'
import { useDebounce } from '@/utils/debounce'
import { BlockIndicator } from '@/components/indicators/indicator'
import { title } from 'process'
import { OtherInput } from '@/components/choice-select/other-input'

export function FeatSubChoiceModal({
  feat,
  choice,
  onChange,
}: {
  feat: Feat
  choice: string
  onChange: (value: string) => void
}) {
  const [otherValue, setOtherValue] = useState<string | undefined>(
    feat.configuration!.options.includes(choice) ? undefined : choice
  )

  const debouncedOnChange = useDebounce(() => {
    onChange(otherValue!)
  })

  return (
    <>
      <ChoiceSelect
        title={feat.configuration!.title}
        options={feat.configuration?.options!}
        value={otherValue ? 'other' : choice}
        onChange={(val: string) => {
          if (val === 'other') {
            setOtherValue('')
          } else {
            setOtherValue(undefined)
            onChange(val)
          }
        }}
      ></ChoiceSelect>
      {otherValue !== undefined && (
        <OtherInput
          value={otherValue}
          onChange={(val) => {
            setOtherValue(val)
            debouncedOnChange()
          }}
          title={feat.configuration!.title}
        ></OtherInput>
      )}
    </>
  )
}
