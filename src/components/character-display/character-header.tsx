import { roboto_condensed } from '@/utils/fonts'
import CharacterBuilderModal from '../character-builder/character-builder'
import { CharacterEntity } from '@/models/db/character-entity'
import { TraitsList } from '../card/traits-list'

export function CharacterHeader({
  character,
  onBuilderClose,
}: {
  character: PlayerCharacter
  onBuilderClose: (character: CharacterEntity) => void
}) {
  return (
    <div
      className={`pl-2 w-full ${roboto_condensed.className} border-b border-b-stone-300/40`}
    >
      <div className="text-base inline-flex items-center gap-2">
        <div>{character.getCharacter().name}</div>
        <div className="text-xs capitalize">{`${character.getLineageName()} ${
          character.getClassEntity().name
        } Level ${character.getCharacter().level}`}</div>
        <div>
          <span className="pl-2 align-bottom">
            <CharacterBuilderModal
              trigger={
                <button
                  className="text-[9px] border rounded-md hover:bg-stone-600 w-full"
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
      <div className="text-xs lowercase mb-2">
        <TraitsList traits={character.getTraits()}></TraitsList>
      </div>
    </div>
  )
}
