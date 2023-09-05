import { useContext, useState } from 'react'
import { GiBroadsword, GiMailedFist, GiPistolGun } from 'react-icons/gi'
import { TraitsList } from '../card/traits-list'
import { CharacterSheetBox } from './character-sheet-box'
import { PlayerCharacterContext } from './player-character-context'
import CalculatedDisplay from '../calculated-display/calculated-display'
import { Switch } from '../base/switch'
import { IoSparklesSharp } from 'react-icons/io5'
import { HoverDisplay } from '../base/hover-display'
import { Separator } from '../base/separator'
import { WeaponGroup } from '@/models/weapon-models'
import { ParsedDescription } from '../parsed-description/parsed-description'

export function Attacks() {
  const { playerCharacter } = useContext(PlayerCharacterContext)
  const [nonLethalEnabled, setNonLethalEnabled] = useState<boolean>(false)

  const handleLethalityToggle = (checked: boolean) =>
    setNonLethalEnabled(checked)

  return (
    playerCharacter && (
      <CharacterSheetBox>
        <div className="flex flex-col gap-1 h-fit">
          <div className="mb-1 text-base font-semibold flex flex-row justify-between">
            <span>Attacks</span>
            <span className="text-xs font-light">
              <Switch
                label="non-lethal"
                id="lethality-mode"
                checked={nonLethalEnabled}
                onChecked={handleLethalityToggle}
              ></Switch>
            </span>
          </div>
          <div className="flex gap-2 flex-col h-full">
            {playerCharacter
              .getAttacks(nonLethalEnabled)
              .map((attack, index) => (
                <div
                  key={attack.weapon.name + index}
                  className="flex flex-col gap-1 "
                >
                  <div className="grid grid-cols-12">
                    {getIcon(attack.weapon.definition.group)}
                    <span className="col-span-3">
                      <span className="flex flex-row gap-1 items-center">
                        {attack.weapon.name}
                        {attack.additional.length > 0 && (
                          <HoverDisplay
                            title={
                              <IoSparklesSharp className="text-emerald-300" />
                            }
                            content={
                              <div className="flex gap-1">
                                {attack.additional.map((value, index) => (
                                  <div>
                                    {value.type ===
                                      'CRITICAL_SPECIALIZATION' && (
                                      <span className="font-semibold">
                                        On critical:{' '}
                                      </span>
                                    )}
                                    <ParsedDescription
                                      description={value.value}
                                      key={index}
                                    ></ParsedDescription>
                                  </div>
                                ))}
                              </div>
                            }
                          ></HoverDisplay>
                        )}
                      </span>
                    </span>
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
                      <span className="flex flex-row items-center gap-1">
                        {attack.weapon.definition.damage.map(
                          (damage, index) => (
                            <span key={index}>
                              {damage.dice}
                              {attack.damageBonus !== 0 &&
                                ' + ' + attack.damageBonus}
                              {` ${damage.type}`}
                            </span>
                          )
                        )}
                      </span>
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-row gap-2">
                      {attack.weapon.item_name && (
                        <span className="italic">
                          {attack.weapon.item_name}
                        </span>
                      )}
                      <span className="col-span-2">
                        {attack.weapon.definition.type === 'ranged' &&
                          `Reload: ${attack.weapon.definition.reload}`}
                      </span>
                    </div>

                    <TraitsList traits={attack.weapon.traits}></TraitsList>
                  </div>
                  <Separator className="my-2"></Separator>
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
