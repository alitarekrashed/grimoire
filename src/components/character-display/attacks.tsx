import { useContext } from 'react'
import { GiBroadsword, GiMailedFist, GiPistolGun } from 'react-icons/gi'
import CalculatedDisplay from '../calculated-display/calculated-display'
import { CharacterSheetBox } from './character-sheet-box'
import { PlayerCharacterContext } from './player-character-context'
import { WeaponCategory, WeaponGroup } from '@/models/db/character-entity'

export function Attacks() {
  const { playerCharacter } = useContext(PlayerCharacterContext)

  return (
    playerCharacter && (
      <CharacterSheetBox>
        <div className="flex flex-col gap-1 h-fit">
          <div className="mb-1 text-base font-semibold">Attacks</div>
          <div className="flex gap-2 flex-col h-full">
            {playerCharacter.getAttacks().map((attack, index) => (
              <div
                key={attack.name + index}
                className="grid grid-cols-12 hover:text-rose-400"
              >
                {getIcon(attack.group)}
                <span className="col-span-2">{attack.name}</span>
                <span className="col-span-1">
                  {attack.type === 'melee' ? '5 ft.' : `${attack.range} ft.`}
                </span>
                <span className="col-span-2">
                  {attack.attackBonus.map((bonus, index) => (
                    <span key={index}>
                      <CalculatedDisplay
                        values={bonus}
                        includeOperator={true}
                      ></CalculatedDisplay>
                      {index < attack.attackBonus.length - 1 && '/'}
                    </span>
                  ))}
                </span>
                <span className="col-span-4">
                  <span key={`${attack.damage.type}-${index}`}>
                    {attack.damage.dice}
                    {index === 0 &&
                      attack.damageBonus !== 0 &&
                      ' + ' + attack.damageBonus}
                    {` ${attack.damage.type}`}
                  </span>
                </span>
                <span className="col-span-2">
                  {attack.type === 'ranged' && `Reload: ${attack.reload}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CharacterSheetBox>
    )
  )
}

function getIcon(group: WeaponGroup) {
  switch (group) {
    case 'brawling':
      return <GiMailedFist size={'15px'} />
    case 'sword':
      return <GiBroadsword size={'15px'} />
    case 'firearm':
      return <GiPistolGun size={'15px'} />
  }
}
