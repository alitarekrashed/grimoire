import { Feat } from '@/models/db/feat'
import { ChoiceSelect } from '../choice-select/choice-select'
import { useState } from 'react'
import { useDebounce } from '@/utils/debounce'

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
        <div className="mt-1 relative w-44 h-9 mr-2">
          <span className="text-stone-300 absolute top-0 text-[9px] pl-1.5">
            Other: {feat.configuration!.title}
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
    </>
  )
}
