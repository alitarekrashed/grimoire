import { Character } from '@/models/character'
import { getEntityById } from './db.service'
import { Ancestry } from '@/models/ancestry'
import { ObjectId } from 'mongodb'

export async function getCharacters(): Promise<
  { character: Character; ancestry: Ancestry }[]
> {
  const characters: Character[] = await (
    await fetch('http://localhost:3000/api/characters', {
      cache: 'no-store',
    })
  ).json()

  let result = []

  for (let i = 0; i < characters.length; i++) {
    const character: Character = characters[i]
    console.log(character)
    const ancestry = await (
      await fetch(
        `http://localhost:3000/api/ancestries/${character.ancestry.id}`,
        {
          cache: 'no-store',
        }
      )
    ).json()

    result.push({ character, ancestry })
  }

  return result
}
