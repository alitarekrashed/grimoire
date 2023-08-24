import { ChoiceSelect } from '@/components/choice-select/choice-select'
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
    languages.includes(value) ? undefined : value
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
        <div className="mt-1 relative w-full h-9">
          <span className="text-stone-300 absolute top-0 text-[9px] pl-1.5">
            Other
          </span>
          <input
            className="absolute bottom-0 bg-transparent rounded-md h-full w-full pt-4 pl-1 border border-stone-300"
            value={otherValue}
            onChange={(e) => {
              setOtherValue(e.target.value)
              debouncedOnChange()
            }}
          ></input>
        </div>
      )}
    </span>
  )
}
