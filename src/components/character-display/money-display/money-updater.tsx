import { useEffect, useState } from 'react'
import { roboto_flex } from '@/utils/fonts'
import CurrencyImage from './currency-image'
import { CurrencyType } from '@/models/db/equipment'
import { getCurrencyMetadata } from './money-utils'
import { CharacterMoney } from '@/models/db/character-entity'
import { Button } from '@/components/base/button'
import { cloneDeep } from 'lodash'
import { Separator } from '@/components/base/separator'

export default function MoneyUpdater({
  money,
  onChange,
}: {
  money: CharacterMoney
  onChange: (value: CharacterMoney) => void
}) {
  const [updatedMoney, setUpdatedMoney] = useState<CharacterMoney>(money)
  const [amountsToChange, setAmountsToChange] = useState<{
    pp: number
    gp: number
    sp: number
    cp: number
  }>({ pp: 0, gp: 0, sp: 0, cp: 0 })

  useEffect(() => {
    onChange(updatedMoney)
  }, [updatedMoney, onChange])

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
              <div>{updatedMoney[currency as keyof CharacterMoney]}</div>
            </div>
            <Separator className="mt-2 bg-stone-300/20"></Separator>
          </div>
        ))}
        <div className="p-2 mb-2 flex flex-row items-start">
          <span className="flex-1">
            <CurrencyImage type={'gp'} hoverable={false}></CurrencyImage>
            <span className="ml-2">Total in gp</span>
          </span>
          <span>{calculateTotal(updatedMoney)}</span>
        </div>
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
            <Button
              label="+ Add"
              className="text-sm"
              onClick={() => {
                const updated = cloneDeep(updatedMoney)
                Object.keys(updated).forEach((currency) => {
                  updated[currency as CurrencyType] +=
                    amountsToChange[currency as CurrencyType]
                })
                setUpdatedMoney(updated)
              }}
            ></Button>
            <Button
              label="- Subtract"
              className="text-sm"
              onClick={() => {
                const updated = cloneDeep(updatedMoney)
                Object.keys(updated).forEach((currency) => {
                  updated[currency as CurrencyType] -=
                    amountsToChange[currency as CurrencyType]
                })
                setUpdatedMoney(updated)
              }}
            ></Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function calculateTotal(money: CharacterMoney): number {
  const silverTotal = Math.floor(money.cp / 10) + money.sp
  return money.gp + money.pp * 10 + Math.floor(silverTotal / 10)
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
