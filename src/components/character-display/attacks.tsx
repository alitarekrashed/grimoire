import { faHandBackFist } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useContext } from 'react'
import CalculatedDisplay from '../calculated-display/calculated-display'
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
            {playerCharacter.getAttacks().map((attack) => (
              <div className="grid grid-cols-12">
                <FontAwesomeIcon
                  icon={faHandBackFist}
                  rotation={90}
                ></FontAwesomeIcon>
                <span className="col-span-2">{attack.name}</span>
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
                  {attack.damage.map((value, index) => (
                    <span key={`${value.type}-${index}`}>
                      {value.dice}
                      {index === 0 &&
                        attack.damageBonus !== 0 &&
                        ' + ' + attack.damageBonus}
                      {` ${value.type}`}
                    </span>
                  ))}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CharacterSheetBox>
    )
  )
}
