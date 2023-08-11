'use client'

import { TraitsList } from '@/components/card/traits-list'
import { LoadingSpinner } from '@/components/loading-spinner/loading-spinner'
import { CharacterEntity } from '@/models/db/character-entity'
import { PlayerCharacter } from '@/models/player-character'
import { roboto } from '@/utils/fonts'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function CharactersPage() {
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

  return (
    <div className="w-full h-full">
      {loading && (
        <div className="fixed top-0 left-0 w-screen h-screen">
          <LoadingSpinner loading={loading}></LoadingSpinner>
        </div>
      )}
      <div className={`${roboto.className}  w-full h-full flex flex-col p-4`}>
        {playerCharacters && (
          <div className="inline-flex bg-stone-900 h-full w-full rounded border border-bg-stone-300 p-4">
            {playerCharacters.map((playerCharacter) => (
              <div
                className=" bg-stone-800 rounded border border-bg-stone-300 hover:bg-stone-600 p-2 w-fit h-fit drop-shadow-lg	"
                key={playerCharacter.getCharacter()._id.toString()}
              >
                <Link
                  href={`/characters/${playerCharacter.getCharacter()._id}`}
                >
                  <div className="w-full h-full">
                    <div className="border-b w-fit mb-1">
                      {playerCharacter.getCharacter().name}
                    </div>
                    <div>{playerCharacter.getLineageName()}</div>
                    <div>{`${playerCharacter.getClassEntity().name} Level ${
                      playerCharacter.getCharacter().level
                    }`}</div>
                    <div className="mt-2 lowercase">
                      <TraitsList
                        traits={playerCharacter.getTraits()}
                      ></TraitsList>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
