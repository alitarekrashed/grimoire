import { roboto_condensed } from '@/utils/fonts'
import CharacterBuilderModal from '../character-builder/character-builder'
import { CharacterEntity } from '@/models/db/character-entity'
import { TraitsList } from '../card/traits-list'
import CalculatedDisplay from '../calculated-display/calculated-display'
import { CharacterSheetBox } from './character-sheet-box'
import { Attribute } from '@/models/db/ancestry'
import { PlayerCharacter } from '@/models/player-character'
import { ParsedDescription } from '../parsed-description/parsed-description'
import React from 'react'

export function CharacterHeader({
  character,
  onBuilderClose,
}: {
  character: PlayerCharacter
  onBuilderClose: (character: CharacterEntity) => void
}) {
  return (
    <div
      className={`flex flex-row gap-2 pb-1 pl-2 w-full ${roboto_condensed.className} border-b border-b-stone-300/40`}
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
                    className="text-[9px] px-2 border rounded-md bg-stone-800 hover:bg-stone-600"
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
      <div className="w-fit">
        <CharacterSheetBox>
          <div className="grid gap-x-6 grid-flow-col grid-cols-2 grid-rows-3">
            {Object.keys(character.getAttributes()).map((attribute) => (
              <div className="flex" key={attribute}>
                <span className="pr-1 mr-auto uppercase font-thin">
                  {attribute}
                </span>
                <span>
                  {character.getAttributes()[attribute as Attribute] > 0 && `+`}
                  {character.getAttributes()[attribute as Attribute]}
                </span>
              </div>
            ))}
          </div>
        </CharacterSheetBox>
      </div>
      <div className="w-fit">
        <CharacterSheetBox>
          <div className="h-full grid grid-flow-col grid-cols-1 grid-rows-2">
            <div className="flex">
              <span className="mr-auto uppercase font-thin">Speed</span>
              <CalculatedDisplay
                values={character.getSpeed()}
              ></CalculatedDisplay>
            </div>
            <div className="flex">
              <span className="mr-auto uppercase font-thin">Size</span>
              <span>{character.getSize()}</span>
            </div>
          </div>
        </CharacterSheetBox>
      </div>
      <div className="w-fit">
        <CharacterSheetBox>
          <div className="h-full grid grid-flow-col grid-cols-1 grid-rows-2">
            <div className="flex">
              <span className="mr-2 uppercase font-thin">Languages</span>
              <span className="mr-auto">
                {character.getLanguages().map((language, index) => (
                  <span key={`${language.feature.value}-${index}`}>{`${
                    language.feature.value
                  }${
                    index < character.getLanguages().length - 1 ? ', ' : ''
                  }`}</span>
                ))}
              </span>
            </div>
            <div className="flex">
              <span className="mr-2 uppercase font-thin">Senses</span>
              <span className="mr-auto">
                {character.getSenses().map((sense, index) => {
                  return (
                    <React.Fragment key={`${sense}-${index}`}>
                      <ParsedDescription
                        description={sense.feature.value}
                      ></ParsedDescription>
                      {index < character.getSenses().length - 1 ? ', ' : ''}
                    </React.Fragment>
                  )
                })}
              </span>
            </div>
          </div>
        </CharacterSheetBox>
      </div>
    </div>
  )
}
