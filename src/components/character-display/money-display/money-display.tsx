import HoverableImage from '@/components/base/hoverable-image'
import { CurrencyType } from '@/models/db/equipment'
import { useContext } from 'react'
import { PlayerCharacterContext } from '../player-character-context'

export default function MoneyDisplay() {
  const { playerCharacter } = useContext(PlayerCharacterContext)

  return (
    <div className="p-2 border border-stone-500 rounded mx-auto w-fit flex flex-row gap-2 hover:bg-stone-500 hover:cursor-pointer">
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

  // what i really want to do is make the alt text hoverable...
  if (currency) {
    return (
      <HoverableImage
        src={`/${currency.file}.png`}
        width={20}
        height={20}
        alt={currency.alt}
        className="inline"
      ></HoverableImage>
    )
  }
  return undefined
}
