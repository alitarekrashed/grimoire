import { WeaponGroup } from '@/models/db/character-entity'
import { useContext } from 'react'
import { GiBroadsword, GiMailedFist, GiPistolGun } from 'react-icons/gi'
import CalculatedDisplay from '../calculated-display/calculated-display'
import { TraitsList } from '../card/traits-list'
import { CharacterSheetBox } from './character-sheet-box'
import { PlayerCharacterContext } from './player-character-context'

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
                key={attack.weapon.name + index}
                className="flex flex-col gap-1 "
              >
                <div className="grid grid-cols-12 hover:text-rose-400">
                  {getIcon(attack.weapon.definition.group)}
                  <span className="col-span-2">{attack.weapon.name}</span>
                  <span className="col-span-1">
                    {attack.weapon.definition.type === 'melee'
                      ? '5 ft.'
                      : `${attack.weapon.definition.range} ft.`}
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
                    <span>
                      {attack.weapon.definition.damage.dice}
                      {attack.damageBonus !== 0 && ' + ' + attack.damageBonus}
                      {` ${attack.weapon.definition.damage.type}`}
                    </span>
                  </span>
                  <span className="col-span-2">
                    {attack.weapon.definition.type === 'ranged' &&
                      `Reload: ${attack.weapon.definition.reload}`}
                  </span>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="italic">{attack.weapon.item_name}</span>
                  <TraitsList traits={attack.weapon.traits}></TraitsList>
                </div>
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
