import {
  faHeart,
  faHeartBroken,
  faShield,
  faShieldHalved,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useContext } from 'react'
import { LabelsList } from '../labels-list/labels-list'
import { CharacterSheetBox } from './character-sheet-box'
import { PlayerCharacterContext } from './player-character-context'
import CalculatedDisplay from '../calculated-display/calculated-display'

export function Defenses() {
  const { playerCharacter } = useContext(PlayerCharacterContext)

  const armorClass = playerCharacter.getArmorClass()
  return (
    playerCharacter && (
      <CharacterSheetBox>
        <div className="flex flex-col gap-1 h-fit">
          <div className="mb-1 text-base font-semibold">Defenses</div>
          <div className="flex gap-2 flex-row h-full">
            <div className="w-fit min-h-full text-sm text-center p-2">
              <div>
                <span>
                  <FontAwesomeIcon
                    icon={faShield}
                    className="mr-1"
                  ></FontAwesomeIcon>
                </span>
                <CalculatedDisplay
                  values={armorClass.value}
                ></CalculatedDisplay>
              </div>
              <div className="text-[9px] font-thin">
                <span>{armorClass.name}</span>
              </div>
              <div className="text-sm font-medium">Armor Class</div>
            </div>
            <div className="w-fit min-h-full text-center p-2">
              <div className="text-sm">
                <span>
                  <FontAwesomeIcon
                    icon={faHeart}
                    className="mr-1"
                  ></FontAwesomeIcon>
                </span>
                <span>
                  {playerCharacter
                    .getMaxHitpoints()
                    .reduce((sum, value) => sum + value.value, 0)}
                </span>
                <span className="mx-1">/</span>
                <CalculatedDisplay
                  values={playerCharacter.getMaxHitpoints()}
                ></CalculatedDisplay>
              </div>
              <div className="text-sm font-medium">Hitpoints</div>
            </div>
            {(playerCharacter.getVulnerabilities().length > 0 ||
              playerCharacter.getResistances().length > 0) && (
              <div className="grid grid-cols-1 items-center p-2">
                {playerCharacter.getResistances().length > 0 && (
                  <div className="flex">
                    <span>
                      <FontAwesomeIcon
                        icon={faShieldHalved}
                        className="mr-1"
                      ></FontAwesomeIcon>
                    </span>
                    <div className="pr-2 mr-auto font-medium">Resistances</div>
                    <div>
                      {playerCharacter
                        .getResistances()
                        .map((resistance, index) => {
                          return (
                            <LabelsList
                              key={`${resistance}-${index}`}
                              fieldDefinitions={[
                                {
                                  label: resistance.feature.value.damage_type,
                                  value: resistance.feature.value.value,
                                },
                              ]}
                            ></LabelsList>
                          )
                        })}
                    </div>
                  </div>
                )}
                {playerCharacter.getVulnerabilities().length > 0 && (
                  <div className="flex">
                    <span>
                      <FontAwesomeIcon
                        icon={faHeartBroken}
                        className="mr-1"
                      ></FontAwesomeIcon>
                    </span>
                    <div className="pr-2 mr-auto font-medium">
                      Vulnerabilities
                    </div>
                    <div>
                      {playerCharacter
                        .getVulnerabilities()
                        .map((vulnerability, index) => {
                          return (
                            <LabelsList
                              key={`${vulnerability}-${index}`}
                              fieldDefinitions={[
                                {
                                  label:
                                    vulnerability.feature.value.damage_type,
                                  value: vulnerability.feature.value.value,
                                },
                              ]}
                            ></LabelsList>
                          )
                        })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CharacterSheetBox>
    )
  )
}
