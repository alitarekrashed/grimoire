import HoverableImage from '@/components/base/hoverable-image'
import { CurrencyType } from '@/models/db/equipment'
import { useContext } from 'react'
import { PlayerCharacterContext } from '../player-character-context'
import { Modal } from '@/components/base/modal'
import { roboto_flex } from '@/utils/fonts'
import { CharacterMoney } from '@/models/db/character-entity'
import { Separator } from '@/components/base/separator'
import Image from 'next/image'

interface CurrencyMetadata {
  file: string
  name: string
  additional: string[]
}

export default function MoneyDisplay() {
  const { playerCharacter } = useContext(PlayerCharacterContext)

  const display = (
    <div className="p-2 border border-stone-500 rounded mx-auto w-fit flex flex-row gap-2 hover:bg-stone-500 hover:cursor-pointer">
      {Object.entries(playerCharacter.getCharacter().player_state.money).map(
        (value: [string, any]) => (
          <div className="flex flex-row items-center" key={value[0]}>
            <span className="mr-1">
              {getImageFromCurrency(value[0] as CurrencyType, true)}
            </span>
            <span>{value[1]}</span>
          </div>
        )
      )}
    </div>
  )

  const manage = (
    <div className={`${roboto_flex.className} w-128 flex flex-row`}>
      <div className="w-44 h-full border-r border-stone-300/20 text-xs flex flex-col gap-2">
        {['pp', 'gp', 'sp', 'cp'].map((currency: string) => (
          <div key={currency}>
            <div className="p-1 flex flex-row items-start">
              <div className="mr-2">
                {getImageFromCurrency(currency as CurrencyType, false)}
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
      <div className="bg-red-400 flex-1">currency management goes here</div>
    </div>
  )

  return (
    <Modal
      trigger={display}
      body={manage}
      closeButtons={[
        {
          label: 'Close',
          onClick: () => {},
        },
      ]}
      size="fit"
    ></Modal>
  )
}

function getImageFromCurrency(type: CurrencyType, hoverable: boolean) {
  const currency: CurrencyMetadata | undefined = getCurrencyMetadata(type)

  // what i really want to do is make the alt text hoverable...
  if (currency) {
    if (hoverable) {
      return (
        <HoverableImage
          src={`/${currency.file}.png`}
          width={20}
          height={20}
          alt={currency.name}
          className="inline"
        ></HoverableImage>
      )
    } else {
      return (
        <Image
          src={`/${currency.file}.png`}
          width={20}
          height={20}
          alt={currency.name}
          className="inline"
        ></Image>
      )
    }
  }
  return undefined
}

function getCurrencyMetadata(type: CurrencyType): CurrencyMetadata | undefined {
  switch (type) {
    case 'cp':
      return {
        file: 'copper-coin',
        name: 'Copper',
        additional: ['1 sp = 10 cp', '1 gp = 100 cp', '1 pp = 1000 cp'],
      }
    case 'sp':
      return {
        file: 'silver-coin',
        name: 'Silver',
        additional: ['1 gp = 10 sp', '1 pp = 100 sp'],
      }
    case 'gp':
      return { file: 'gold-coin', name: 'Gold', additional: [] }
    case 'pp':
      return {
        file: 'platinum-coin',
        name: 'Platinum',
        additional: ['1 pp = 10 gp'],
      }
    default:
      return undefined
  }
}
