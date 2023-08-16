import { roboto_condensed } from '@/utils/fonts'
import CharacterBuilderModal from '../character-builder/character-builder'
import { CharacterEntity } from '@/models/db/character-entity'
import { TraitsList } from '../card/traits-list'
import CalculatedDisplay from '../calculated-display/calculated-display'
import { CharacterSheetBox } from './character-sheet-box'
import { Attribute } from '@/models/db/ancestry'
import { PlayerCharacter } from '@/models/player-character'

export function CharacterHeader({
  character,
  onBuilderClose,
}: {
  character: PlayerCharacter
  onBuilderClose: (character: CharacterEntity) => void
}) {
  return (
    <div
      className={`flex flex-row gap-10 pl-2 w-full ${roboto_condensed.className} border-b border-b-stone-300/40`}
    >
      <div className="flex flex-col">
        <div className="text-base flex items-center gap-2">
          <div>{character.getCharacter().name}</div>
          <div className="text-xs capitalize">{`${character.getLineageName()} ${
            character.getClassEntity().name
          } Level ${character.getCharacter().level}`}</div>
          <div>
            <span className="align-bottom">
              <CharacterBuilderModal
                trigger={
                  <button
                    className="text-[9px] px-2 border rounded-md hover:bg-stone-600"
                    tabIndex={0}
                  >
                    MANAGE
                  </button>
                }
                playerCharacter={character}
                onClose={onBuilderClose}
              ></CharacterBuilderModal>
            </span>
          </div>
        </div>
        <div className="flex items-end text-xs lowercase mb-2">
          <TraitsList traits={character.getTraits()}></TraitsList>
        </div>
      </div>
      <div className="w-fit align-top">
        <CharacterSheetBox>
          <div className="grid gap-x-6 grid-flow-col grid-cols-2 grid-rows-3">
            {Object.keys(character.getAttributes()).map((attribute) => (
              <div className="flex" key={attribute}>
                <span className="mr-auto uppercase font-thin">{attribute}</span>
                <span>
                  {character.getAttributes()[attribute as Attribute] > 0 && `+`}
                  {character.getAttributes()[attribute as Attribute]}
                </span>
              </div>
            ))}
          </div>
        </CharacterSheetBox>
      </div>
      <div className="text-sm self-center">
        <div className="flex flex-row gap-8">
          <div className="flex flex-col items-center gap-1">
            <span className="font-bold">Speed</span>
            <CalculatedDisplay
              values={character.getSpeed()}
            ></CalculatedDisplay>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="font-bold">Size</span>
            <span>{character.getSize()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
