import { useContext } from 'react'
import { PlayerCharacterContext } from '../player-character-context'
import Image from 'next/image'
import { CurrencyType } from '@/models/db/equipment'

export default function MoneyDisplay() {
  const { playerCharacter } = useContext(PlayerCharacterContext)

  return (
    <div className="flex flex-row gap-2">
      {Object.entries(playerCharacter.getCharacter().player_state.money).map(
        (value: [string, any]) => (
          <div className="flex flex-row items-center" key={value[0]}>
            <span className="mr-1">
              {getImageFromCurrency(value[0] as CurrencyType)}
            </span>
            <span>{value[1]}</span>
          </div>
        )
      )}
    </div>
  )
}

function getImageFromCurrency(type: CurrencyType) {
  const currency: { file: string; alt: string } | undefined = (() => {
    switch (type) {
      case 'cp':
        return { file: 'copper-coin', alt: 'Copper' }
      case 'sp':
        return { file: 'silver-coin', alt: 'Silver' }
      case 'gp':
        return { file: 'gold-coin', alt: 'Gold' }
      case 'pp':
        return { file: 'platinum-coin', alt: 'Platinum' }
      default:
        return undefined
    }
  })()

  if (currency) {
    return (
      <Image
        src={`/${currency.file}.png`}
        width={25}
        height={25}
        alt={currency.alt}
        className="inline"
      ></Image>
    )
  }
  return undefined
}
