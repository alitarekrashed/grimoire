import { faHandBackFist } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useContext } from 'react'
import CalculatedDisplay from '../calculated-display/calculated-display'
import { CharacterSheetBox } from './character-sheet-box'
import { PlayerCharacterContext } from './player-character-context'

export function Attacks() {
  const { playerCharacter } = useContext(PlayerCharacterContext)

  const getAttacks = () => {
    return {
      fist: playerCharacter!.getAttack(),
    }
  }

  return (
    playerCharacter && (
      <CharacterSheetBox>
        <div className="flex flex-col gap-1 h-fit">
          <div className="mb-1 text-base font-semibold">Attacks</div>
          <div className="flex gap-2 flex-row h-full">
            <div className="flex gap-2">
              <FontAwesomeIcon
                icon={faHandBackFist}
                rotation={90}
              ></FontAwesomeIcon>
              <span>{getAttacks().fist.name}</span>
              <span>
                {getAttacks().fist.attackBonus.map((bonus, index) => (
                  <span key={index}>
                    <CalculatedDisplay
                      values={bonus}
                      includeOperator={true}
                    ></CalculatedDisplay>
                    {index < getAttacks().fist.attackBonus.length - 1 && '/'}
                  </span>
                ))}
              </span>

              <span></span>
              <span>
                {getAttacks().fist.damage.map((value, index) => (
                  <span key={`${value.type}-${index}`}>
                    {value.dice}
                    {index === 0 &&
                      getAttacks().fist.damageBonus !== 0 &&
                      ' + ' + getAttacks().fist.damageBonus}
                    {` ${value.type}`}
                  </span>
                ))}
              </span>
            </div>
          </div>
        </div>
      </CharacterSheetBox>
    )
  )
}
