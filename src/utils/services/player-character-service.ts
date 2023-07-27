import { CharacterEntity } from '@/models/db/character-entity'
import { PlayerCharacter } from '@/models/player-character'
import { ObjectId } from 'mongodb'

export async function getPlayerCharacter(
  id: string | ObjectId
): Promise<PlayerCharacter> {
  const character: CharacterEntity = await (
    await fetch(`http://localhost:3000/api/characters/${id}`, {
      cache: 'no-store',
    })
  ).json()

  return await PlayerCharacter.build(character)
}

export async function getPlayerCharacters(): Promise<PlayerCharacter[]> {
  const characters: CharacterEntity[] = await (
    await fetch('http://localhost:3000/api/characters', {
      cache: 'no-store',
    })
  ).json()

  let result = []

  for (let i = 0; i < characters.length; i++) {
    result.push(await PlayerCharacter.build(characters[i]))
  }

  return result
}
