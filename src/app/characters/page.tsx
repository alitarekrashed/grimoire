'use client'

import { TraitsList } from '@/components/card/traits-list'
import { LoadingSpinner } from '@/components/loading-spinner/loading-spinner'
import { CharacterEntity } from '@/models/db/character-entity'
import { PlayerCharacter } from '@/models/player-character'
import { roboto } from '@/utils/fonts'
import { faEllipsis } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import router, { useRouter } from 'next/navigation'
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
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    router.push(
                      `/characters/${playerCharacter.getCharacter()._id}`
                    )
                  }}
                >
                  <div className="w-full h-full">
                    <button
                      className="bg-stone-700 fixed top-2 right-2 rounded-full px-[8px] border border-stone-300 hover:bg-stone-500"
                      onClick={(e) => {
                        e.stopPropagation()
                      }}
                      onClickCapture={(e) => {
                        e.stopPropagation()
                      }}
                    >
                      <FontAwesomeIcon size="2xs" icon={faEllipsis} />
                    </button>
                    <div className="flex">
                      <div className="border-b w-fit mb-4">
                        {playerCharacter.getCharacter().name}
                      </div>
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
