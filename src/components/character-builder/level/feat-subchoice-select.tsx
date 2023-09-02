import { PlayerCharacterContext } from '@/components/character-display/player-character-context'
import { OtherInput } from '@/components/choice-select/other-input'
import { Feat } from '@/models/db/feat'
import { useDebounce } from '@/utils/debounce'
import { useContext, useState } from 'react'
import { ChoiceSelect } from '../../choice-select/choice-select'
import { caseInsensitiveMatch } from '@/utils/helpers'

export function FeatSubChoiceSelect({
  feat,
  choice,
  onChange,
}: {
  feat: Feat
  choice: string
  onChange: (value: string) => void
}) {
  const { playerCharacter } = useContext(PlayerCharacterContext)
  const [otherValue, setOtherValue] = useState<string | undefined>(
    feat.configuration!.options.includes(choice) ? undefined : choice
  )

  const debouncedOnChange = useDebounce(() => {
    onChange(otherValue!)
  })

  const options = feat.configuration!.options.filter((option: string) => {
    if (option === choice || caseInsensitiveMatch(option, 'other')) {
      return true
    }

    return (
      playerCharacter
        .getResolvedFeats()
        .filter(
          (sourced) =>
            sourced.feature.context && sourced.feature.context.length === 1
        )
        .map((sourced) => sourced.feature.context![0])
        .includes(option) === false
    )
  })

  return (
    <>
      <ChoiceSelect
        title={feat.configuration!.title}
        options={options}
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
