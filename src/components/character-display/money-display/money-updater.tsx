import { useContext, useState } from 'react'
import { PlayerCharacterContext } from '../player-character-context'
import { roboto_flex } from '@/utils/fonts'
import CurrencyImage from './currency-image'
import { CurrencyType } from '@/models/db/equipment'
import { getCurrencyMetadata } from './money-utils'
import { CharacterMoney } from '@/models/db/character-entity'
import { Separator } from '@radix-ui/react-separator'
import { Button } from '@/components/base/button'

export default function MoneyUpdater() {
  const { playerCharacter } = useContext(PlayerCharacterContext)
  const [amountsToChange, setAmountsToChange] = useState<{
    pp: number
    gp: number
    sp: number
    cp: number
  }>({ pp: 0, gp: 0, sp: 0, cp: 0 })
  return (
    <div className={`${roboto_flex.className} w-128 flex flex-row`}>
      <div className="w-44 h-full border-r border-stone-300/20 text-xs flex flex-col gap-2">
        {['pp', 'gp', 'sp', 'cp'].map((currency: string) => (
          <div key={currency}>
            <div className="p-2 flex flex-row items-start">
              <div className="mr-2">
                <CurrencyImage
                  type={currency as CurrencyType}
                  hoverable={false}
                ></CurrencyImage>
              </div>
              <div className="pr-2 flex-1">
                <div>
                  <span>
                    {getCurrencyMetadata(currency as CurrencyType)!.name}
                  </span>
                  <span>&nbsp;({currency})</span>
                </div>
                <div className="text-[8px] flex flex-col leading-3 text-stone-400">
                  {getCurrencyMetadata(
                    currency as CurrencyType
                  )!.additional.map((val, index) => (
                    <span key={index}>{val}</span>
                  ))}
                </div>
              </div>
              <div>
                {
                  playerCharacter.getCharacter().player_state.money[
                    currency as keyof CharacterMoney
                  ]
                }
              </div>
            </div>
            <Separator className="mt-2 bg-stone-300/20"></Separator>
          </div>
        ))}
      </div>
      <div className="flex-1 p-2 w-full">
        <div className="flex flex-col items-center text-sm w-full">
          <span className="mb-4">Manage</span>
          <div className="text-xs flex flex-row gap-4 w-full mb-8">
            {['pp', 'gp', 'sp', 'cp'].map((currency) => (
              <CurrencyInput
                type={currency as CurrencyType}
                key={currency}
                onChange={(amount: number) => {
                  const updated = amountsToChange
                  updated[currency as CurrencyType] = amount
                  setAmountsToChange(updated)
                }}
              ></CurrencyInput>
            ))}
          </div>
          <div className="flex flex-row gap-2">
            <Button label="+ Add" className="text-sm"></Button>
            <Button label="- Subtract" className="text-sm"></Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function CurrencyInput({
  type,
  onChange,
}: {
  type: CurrencyType
  onChange: (amount: number) => void
}) {
  const [amount, setAmount] = useState<number>(0)

  return (
    <div className="flex flex-col items-center gap-1">
      <div>
        <span>
          <CurrencyImage
            type={type as CurrencyType}
            hoverable={false}
          ></CurrencyImage>
        </span>
        <span>&nbsp;{type}</span>
      </div>
      <div>
        <input
          className="px-1 w-full rounded bg-stone-600"
          value={amount === 0 ? '' : amount}
          onChange={(event) => {
            setAmount(Math.floor(Number(event.target.value)))
            onChange(Math.floor(Number(event.target.value)))
          }}
          type="number"
          min={0}
        ></input>
      </div>
    </div>
  )
}
