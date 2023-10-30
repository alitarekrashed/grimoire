import { Modal } from '@/components/base/modal'
import { CurrencyType } from '@/models/db/equipment'
import { useContext } from 'react'
import { PlayerCharacterContext } from '../player-character-context'
import MoneyUpdater from './money-updater'
import CurrencyImage from './currency-image'

export default function MoneyDisplay() {
  const { playerCharacter } = useContext(PlayerCharacterContext)

  const display = (
    <div className="p-2 border border-stone-500 rounded mx-auto w-fit flex flex-row gap-2 hover:bg-stone-500 hover:cursor-pointer">
      {Object.entries(playerCharacter.getCharacter().player_state.money).map(
        (value: [string, any]) => (
          <div className="flex flex-row items-center" key={value[0]}>
            <span className="mr-1">
              <CurrencyImage
                type={value[0] as CurrencyType}
                hoverable={true}
              ></CurrencyImage>
            </span>
            <span>{value[1]}</span>
          </div>
        )
      )}
    </div>
  )

  const manage = (
    <MoneyUpdater
      money={playerCharacter.getCharacter().player_state.money}
    ></MoneyUpdater>
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
