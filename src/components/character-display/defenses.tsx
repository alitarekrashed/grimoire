import { PlayerCharacter } from '@/models/player-character'
import {
  faHeart,
  faHeartBroken,
  faShield,
  faShieldHalved,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CalculatedDisplay from '../calculated-display/calculated-display'
import { LabelsList } from '../labels-list/labels-list'
import { CharacterSheetBox } from './character-sheet-box'

export function Defenses({ character }: { character: PlayerCharacter }) {
  return (
    <CharacterSheetBox>
      <div className="flex flex-col gap-1 h-fit">
        <div className="mb-1 text-base font-semibold">Defenses</div>
        <div className="flex gap-2 flex-row h-full">
          <div className="w-fit min-h-full text-sm text-center p-2">
            <div>
              <span className="text-rose-500">
                <FontAwesomeIcon
                  icon={faShield}
                  className="mr-1"
                ></FontAwesomeIcon>
              </span>
              <CalculatedDisplay
                values={character.getArmorClass()}
              ></CalculatedDisplay>
            </div>
            <div className="text-sm font-medium">Armor Class</div>
          </div>
          <div className="w-fit min-h-full text-center p-2">
            <div className="text-sm">
              <span className="text-rose-500">
                <FontAwesomeIcon
                  icon={faHeart}
                  className="mr-1"
                ></FontAwesomeIcon>
              </span>
              <span>
                {character
                  .getMaxHitpoints()
                  .reduce((sum, value) => sum + value.value, 0)}
              </span>
              <span className="mx-1">/</span>
              <CalculatedDisplay
                values={character.getMaxHitpoints()}
              ></CalculatedDisplay>
            </div>
            <div className="text-sm font-medium">Hitpoints</div>
          </div>
          {(character.getVulnerabilities().length > 0 ||
            character.getResistances().length > 0) && (
            <div className="grid grid-cols-1 items-center p-2">
              {character.getResistances().length > 0 && (
                <div className="flex">
                  <span className="text-rose-500">
                    <FontAwesomeIcon
                      icon={faShieldHalved}
                      className="mr-1"
                    ></FontAwesomeIcon>
                  </span>
                  <div className="pr-2 mr-auto font-medium">Resistances</div>
                  <div>
                    {character.getResistances().map((resistance, index) => {
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
              {character.getVulnerabilities().length > 0 && (
                <div className="flex">
                  <span className="text-rose-500">
                    <FontAwesomeIcon
                      icon={faHeartBroken}
                      className="mr-1"
                    ></FontAwesomeIcon>
                  </span>
                  <div className="pr-2 mr-auto font-medium">
                    Vulnerabilities
                  </div>
                  <div>
                    {character
                      .getVulnerabilities()
                      .map((vulnerability, index) => {
                        return (
                          <LabelsList
                            key={`${vulnerability}-${index}`}
                            fieldDefinitions={[
                              {
                                label: vulnerability.feature.value.damage_type,
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
}
