import { Attribute } from '@/models/db/ancestry'
import { CharacterEntity } from '@/models/db/character-entity'
import { roboto_condensed } from '@/utils/fonts'
import React, { useContext } from 'react'
import { TraitsList } from '../card/traits-list'
import CharacterBuilderModal from '../character-builder/character-builder'
import { ParsedDescription } from '../parsed-description/parsed-description'
import { CharacterSheetBox } from './character-sheet-box'
import {
  PlayerCharacterContext,
  PlayerCharacterProvider,
} from './player-character-context'
import CalculatedDisplay from '../calculated-display/calculated-display'
import { Button } from '../base/button'

export function CharacterHeader({
  onBuilderClose,
}: {
  onBuilderClose: (character: CharacterEntity) => void
}) {
  const { playerCharacter } = useContext(PlayerCharacterContext)

  return (
    playerCharacter && (
      <div
        className={`flex flex-row gap-2 pb-1 pl-2 w-full ${roboto_condensed.className} border-b border-b-stone-300/40`}
      >
        <div className="flex flex-col">
          <div className="text-base flex items-center gap-2">
            <div>{playerCharacter.getCharacter().name}</div>
            <div className="text-xs capitalize">{`${playerCharacter.getLineageName()} ${
              playerCharacter.getClassEntity().name
            } Level ${playerCharacter.getCharacter().level}`}</div>
            <div>
              <span className="align-bottom">
                <PlayerCharacterProvider>
                  <CharacterBuilderModal
                    trigger={<Button label="MANAGE" />}
                    initialValue={playerCharacter}
                    onClose={onBuilderClose}
                  ></CharacterBuilderModal>
                </PlayerCharacterProvider>
              </span>
            </div>
          </div>
          <div className="flex items-end text-xs lowercase mb-2">
            <TraitsList traits={playerCharacter.getTraits()}></TraitsList>
          </div>
        </div>
        <div className="w-fit">
          <CharacterSheetBox>
            <div className="grid gap-x-6 grid-flow-col grid-cols-2 grid-rows-3">
              {Object.keys(playerCharacter.getAttributes()).map((attribute) => (
                <div className="flex" key={attribute}>
                  <span className="pr-1 mr-auto uppercase font-thin">
                    {attribute}
                  </span>
                  <span>
                    {playerCharacter.getAttributes()[attribute as Attribute] >
                      0 && `+`}
                    {playerCharacter.getAttributes()[attribute as Attribute]}
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
                <span className="mr-auto uppercase font-thin">Size</span>
                <span>{playerCharacter.getSize()}</span>
              </div>
            </div>
          </CharacterSheetBox>
        </div>
        <div className="w-fit">
          <CharacterSheetBox>
            <div className="flex flex-col h-full">
              <span className="self-center uppercase font-thin">Speed</span>
              <div className="flex">
                <span className="mr-auto lowercase font-thin">Land</span>
                <CalculatedDisplay
                  values={playerCharacter.getSpeed().regular}
                ></CalculatedDisplay>
              </div>
              {playerCharacter.getSpeed().climb.length > 0 && (
                <div className="flex">
                  <span className="mr-auto lowercase font-thin">Climb</span>
                  <CalculatedDisplay
                    values={playerCharacter.getSpeed().climb}
                  ></CalculatedDisplay>
                </div>
              )}
              {playerCharacter.getSpeed().swim.length > 0 && (
                <div className="flex">
                  <span className="mr-auto lowercase font-thin">Swim</span>
                  <CalculatedDisplay
                    values={playerCharacter.getSpeed().swim}
                  ></CalculatedDisplay>
                </div>
              )}
            </div>
          </CharacterSheetBox>
        </div>
        <div className="w-fit">
          <CharacterSheetBox>
            <div className="h-full grid grid-flow-col grid-cols-1 grid-rows-2">
              <div className="flex">
                <span className="mr-2 uppercase font-thin">Languages</span>
                <span className="mr-auto">
                  {playerCharacter.getLanguages().map((language, index) => (
                    <span key={`${language.feature.value}-${index}`}>{`${
                      language.feature.value
                    }${
                      index < playerCharacter.getLanguages().length - 1
                        ? ', '
                        : ''
                    }`}</span>
                  ))}
                </span>
              </div>
              <div className="flex">
                <span className="mr-2 uppercase font-thin">Senses</span>
                <span className="mr-auto">
                  {playerCharacter.getSenses().map((sense, index) => {
                    return (
                      <React.Fragment key={`${sense}-${index}`}>
                        <ParsedDescription
                          description={sense.feature.value.sense}
                        ></ParsedDescription>
                        {sense.feature.value.context && (
                          <span className="ml-1">
                            ({sense.feature.value.context})
                          </span>
                        )}
                        {index < playerCharacter.getSenses().length - 1
                          ? ', '
                          : ''}
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
  )
}
