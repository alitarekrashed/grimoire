import { Ancestry } from '@/models/ancestry'
import { Character } from '@/models/character'

export class PlayerCharacter {
  private constructor(
    private character: Character,
    private ancestry: Ancestry
  ) {}

  public getCharacter(): Character {
    return this.character
  }

  public getSpeed(): number {
    return this.ancestry.speed
  }

  static async build(character: Character): PlayerCharacter {
    const ancestry = await (
      await fetch(
        `http://localhost:3000/api/ancestries/${character.ancestry.id}`,
        {
          cache: 'no-store',
        }
      )
    ).json()
    return new PlayerCharacter(character, ancestry)
  }
}

export async function getCharacters(): Promise<PlayerCharacter[]> {
  const characters: Character[] = await (
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
