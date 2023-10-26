'use client'

import { TraitsList } from '@/components/card/traits-list'
import { CharacterContextMenu } from '@/components/characters-list/character-context-menu'
import { NewCharacterButton } from '@/components/characters-list/new-character-button'
import { LoadingSpinner } from '@/components/loading-spinner/loading-spinner'
import { CharacterEntity } from '@/models/db/character-entity'
import { PlayerCharacter } from '@/models/player-character'
import { roboto } from '@/utils/fonts'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function CharactersPage() {
  const router = useRouter()
  const [playerCharacters, setPlayerCharacters] = useState<PlayerCharacter[]>(
    []
  )
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    setLoading(true)
    fetch('http://localhost:3000/api/characters', {
      cache: 'no-store',
    })
      .then((result) => result.json())
      .then((characters) => {
        Promise.all(
          characters.map((character: CharacterEntity) =>
            PlayerCharacter.build(character)
          )
        ).then((playerCharacters) => {
          setPlayerCharacters(playerCharacters)
          setLoading(false)
        })
      })
  }, [])

  const handleRefresh = () => {
    setLoading(true)
    fetch('http://localhost:3000/api/characters', {
      cache: 'no-store',
    })
      .then((result) => result.json())
      .then((characters) => {
        Promise.all(
          characters.map((character: CharacterEntity) =>
            PlayerCharacter.build(character)
          )
        ).then((playerCharacters) => {
          setPlayerCharacters(playerCharacters)
          setLoading(false)
        })
      })
  }

  return (
    <div className="w-full h-full">
      {loading && (
        <div className="fixed top-0 left-0 w-screen h-screen z-50">
          <LoadingSpinner loading={loading}></LoadingSpinner>
        </div>
      )}
      <div className={`${roboto.className} w-full h-full flex flex-col p-4`}>
        <div className="absolute top-0 left-0 -my-6 ml-4">
          <NewCharacterButton onSave={handleRefresh}></NewCharacterButton>
        </div>
        {playerCharacters && (
          <div className="inline-flex gap-2 bg-stone-900 h-full w-full rounded border border-stone-300 p-4">
            {playerCharacters.map((playerCharacter) => (
              <div
                key={playerCharacter.getCharacter()._id.toString()}
                className="w-1/5 h-1/4 overflow-scroll relative bg-stone-800 rounded border border-stone-300"
              >
                <CharacterContextMenu
                  character={playerCharacter.getCharacter()}
                  onActionComplete={handleRefresh}
                ></CharacterContextMenu>
                <div className="hover:bg-stone-600 p-2 scroll-p-10 min-h-full h-max w-full ">
                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      router.push(
                        `/characters/${playerCharacter.getCharacter()._id}`
                      )
                    }}
                  >
                    <div className="w-full h-full">
                      <div className="flex">
                        <div className="w-4/5 mb-4">
                          {playerCharacter.getCharacter().name}
                        </div>
                      </div>
                      <div>{playerCharacter.getLineageName()}</div>
                      <div className="capitalize">{`${
                        playerCharacter.getClassEntity().name
                      } Level ${playerCharacter.getCharacter().level}`}</div>
                      <div className="mt-2 lowercase">
                        <TraitsList
                          traits={playerCharacter.getTraits()}
                        ></TraitsList>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
