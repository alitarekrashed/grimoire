import { Ancestry, Attribute } from '@/models/ancestry'
import { Character, CharacterAncestry } from '@/models/character'
import { ObjectId } from 'mongodb'

export interface Attributes {
  Strength: number
  Dexterity: number
  Constitution: number
  Intelligence: number
  Wisdom: number
  Charisma: number
}

export class PlayerCharacter {
  private attributes!: Attributes
  private languages!: (string | undefined)[]

  private constructor(
    private character: Character,
    private ancestry: Ancestry
  ) {
    this.attributes = {
      Strength: 0,
      Dexterity: 0,
      Constitution: 0,
      Intelligence: 0,
      Wisdom: 0,
      Charisma: 0,
    }
    this.languages = []
  }

  public getCharacter(): Character {
    return this.character
  }

  public getAncestry(): Ancestry {
    return this.ancestry
  }

  public updateCharacter(character: Character): PlayerCharacter {
    const pc = new PlayerCharacter(character, { ...this.ancestry })
    pc.initialize()
    return pc
  }

  // TODO need to eventually handle changing TYPE of ancestry
  public updateAncestry(ancestry: CharacterAncestry): PlayerCharacter {
    let newCharacter = { ...this.character }

    newCharacter.ancestry = ancestry
    const pc = new PlayerCharacter(newCharacter, { ...this.ancestry })
    pc.initialize()
    return pc
  }

  public calculateAncestry() {
    const freeAttributes = this.ancestry.attribute_boosts.filter(
      (attribute) => attribute === 'Free'
    ).length

    const additionalLanguages =
      this.ancestry.languages.additional === '+Intelligence'
        ? this.attributes.Intelligence
        : 0

    const getExistingValue = (count: number, persisted: any[]) => {
      const values = []
      for (let i = 0; i < count; i++) {
        if (i < persisted.length) {
          values.push(persisted[i])
        } else {
          values.push(undefined)
        }
      }
      return values
    }

    const freeAttributeSelections = getExistingValue(
      freeAttributes,
      this.character.ancestry.attribute_boost_selections
    )
    const languageSelections = getExistingValue(
      additionalLanguages,
      this.character.ancestry.language_selections
    )

    this.character.ancestry.attribute_boost_selections = freeAttributeSelections
    this.character.ancestry.language_selections = languageSelections
  }

  public getSpeed(): number {
    return this.ancestry.speed
  }

  public getAttributes(): Attributes {
    return this.attributes
  }

  public getLanguages(): (string | undefined)[] {
    return this.languages
  }

  private calculateLanguages() {
    let languages = []

    languages.push(...this.ancestry.languages.given)
    languages.push(...this.character.ancestry.language_selections)
    this.languages = languages
  }

  private calculateAttributes() {
    let attributes = {
      Strength: 0,
      Dexterity: 0,
      Constitution: 0,
      Intelligence: 0,
      Wisdom: 0,
      Charisma: 0,
    }

    this.ancestry.attribute_boosts
      .filter((attribute) => attribute !== 'Free')
      .forEach((attribute) => {
        attributes[attribute as Attribute] += 1
      })
    this.ancestry.attribute_flaws.forEach((attribute) => {
      attributes[attribute as Attribute] -= 1
    })

    this.ancestry.attribute_boosts
      .filter((attribute) => attribute === 'Free')
      .forEach((freeBoost, index: number) => {
        if (
          index < this.character.ancestry.attribute_boost_selections?.length &&
          this.character.ancestry.attribute_boost_selections[index]
        ) {
          attributes[
            this.character.ancestry.attribute_boost_selections[index]!
          ] += 1
        }
      })
    this.attributes = attributes
  }

  public initialize() {
    this.calculateAttributes()
    this.calculateAncestry()
    this.calculateLanguages()
  }

  static async build(character: Character): Promise<PlayerCharacter> {
    const ancestry = await (
      await fetch(
        `http://localhost:3000/api/ancestries/${character.ancestry.id}`,
        {
          cache: 'no-store',
        }
      )
    ).json()
    const pc = new PlayerCharacter(character, ancestry)
    pc.initialize()
    return pc
  }
}

export async function getCharacter(
  id: string | ObjectId
): Promise<PlayerCharacter> {
  const character: Character = await (
    await fetch(`http://localhost:3000/api/characters/${id}`, {
      cache: 'no-store',
    })
  ).json()

  return await PlayerCharacter.build(character)
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
