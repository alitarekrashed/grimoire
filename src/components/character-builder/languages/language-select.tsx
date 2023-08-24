import { ChoiceSelect } from '@/components/choice-select/choice-select'
import { OtherInput } from '@/components/choice-select/other-input'
import { BlockIndicator } from '@/components/indicators/indicator'
import { useDebounce } from '@/utils/debounce'
import { useState } from 'react'

export function LanguageSelect({
  value,
  languages,
  alreadyChosenLanguages,
  title,
  onChange,
}: {
  value: string
  languages: string[]
  alreadyChosenLanguages: string[]
  title: string
  onChange: (val: string) => void
}) {
  const [otherValue, setOtherValue] = useState<string | undefined>(
    languages.includes(value) || !value ? undefined : value
  )

  const debouncedOnChange = useDebounce(() => {
    onChange(otherValue!)
  })

  return (
    <span>
      <ChoiceSelect
        value={otherValue ? 'other' : value}
        title={title}
        options={languages.filter((val) => {
          if (val === value) {
            return true
          }
          return alreadyChosenLanguages.includes(val) === false
        })}
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
          title={title}
        ></OtherInput>
      )}
    </span>
  )
}
