import { Modal } from '@/components/base/modal'
import { CurrencyType } from '@/models/db/equipment'
import { useContext, useState } from 'react'
import { PlayerCharacterContext } from '../player-character-context'
import MoneyUpdater from './money-updater'
import CurrencyImage from './currency-image'
import { CharacterMoney } from '@/models/db/character-entity'
import { LoadingSpinner } from '@/components/loading-spinner/loading-spinner'

export default function MoneyDisplay() {
  const { playerCharacter, updateAndSaveCharacterEntity } = useContext(
    PlayerCharacterContext
  )
  const [updatedMoney, setUpdatedMoney] = useState<CharacterMoney>(
    playerCharacter.getCharacter().player_state.money
  )
  const [loading, setLoading] = useState<boolean>(false)

  const display = (
    <div className="p-2 border border-stone-500 rounded mx-auto w-fit flex flex-row gap-2 hover:bg-stone-500 hover:cursor-pointer">
      {loading && (
        <div className="fixed top-0 left-0 w-screen h-screen z-50">
          <LoadingSpinner loading={loading}></LoadingSpinner>
        </div>
      )}
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
      onChange={(value: CharacterMoney) => setUpdatedMoney(value)}
    ></MoneyUpdater>
  )

  return (
    <Modal
      trigger={display}
      body={manage}
      closeButtons={[
        {
          label: 'Apply',
          onClick: () => {
            setLoading(true)
            const updated = playerCharacter.getCharacter()
            updated.player_state.money = updatedMoney
            updateAndSaveCharacterEntity(updated, () => setLoading(false))
          },
        },
        {
          label: 'Close',
          onClick: () => {},
        },
      ]}
      size="fit"
    ></Modal>
  )
}
