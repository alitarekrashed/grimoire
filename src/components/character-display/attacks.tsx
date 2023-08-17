import { PlayerCharacter } from '@/models/player-character'
import CalculatedDisplay from '../calculated-display/calculated-display'
import { CharacterSheetBox } from './character-sheet-box'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFistRaised,
  faHandBackFist,
  faHandFist,
} from '@fortawesome/free-solid-svg-icons'

export function Attacks({ character }: { character: PlayerCharacter }) {
  const fistAttack = character.getAttack()
  return (
    <CharacterSheetBox>
      <div className="flex flex-col gap-1 h-fit">
        <div className="mb-1 text-base font-semibold">Attacks</div>
        <div className="flex gap-2 flex-row h-full">
          <div className="flex gap-2">
            <FontAwesomeIcon
              icon={faHandBackFist}
              rotation={90}
            ></FontAwesomeIcon>
            <span>{fistAttack.name}</span>
            <span>
              {fistAttack.attackBonus.map((bonus, index) => (
                <span key={index}>
                  <CalculatedDisplay
                    values={bonus}
                    includeOperator={true}
                  ></CalculatedDisplay>
                  {index < fistAttack.attackBonus.length - 1 && '/'}
                </span>
              ))}
            </span>

            <span></span>
            <span>
              {fistAttack.damage.map((value, index) => (
                <span key={`${value.type}-${index}`}>
                  {value.dice}
                  {index === 0 &&
                    fistAttack.damageBonus !== 0 &&
                    ' + ' + fistAttack.damageBonus}
                  {` ${value.type}`}
                </span>
              ))}
            </span>
          </div>
        </div>
      </div>
    </CharacterSheetBox>
  )
}
