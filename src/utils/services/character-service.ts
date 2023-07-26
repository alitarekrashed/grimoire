import { Ancestry, Attribute } from '@/models/ancestry'
import { Character } from '@/models/character'

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
  private languages!: string[]

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

  public getAncestryChoices() {
    const freeAttributes = this.ancestry.attribute_boosts.filter(
      (attribute) => attribute === 'Free'
    ).length

    const additionalLanguages =
      this.ancestry.languages.additional === '+Intelligence'
        ? this.attributes.Intelligence
        : 0

    const freeAttributeSelections = []
    for (let i = 0; i < freeAttributes; i++) {
      if (i < this.character.ancestry.attribute_boost_selections.length) {
        freeAttributeSelections.push(
          this.character.ancestry.attribute_boost_selections[i]
        )
      } else {
        freeAttributeSelections.push(undefined)
      }
    }

    const languageSelections = []
    for (let i = 0; i < additionalLanguages; i++) {
      if (i < this.character.ancestry.language_selections.length) {
        languageSelections.push(this.character.ancestry.language_selections[i])
      } else {
        languageSelections.push(undefined)
      }
    }

    const ancestryFormValues = {
      freeAttributes: freeAttributeSelections,
      languageSelections: languageSelections,
    }
    return ancestryFormValues
  }

  public getSpeed(): number {
    return this.ancestry.speed
  }

  public getAttributes(): Attributes {
    return this.attributes
  }

  public getLanguages(): string[] {
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
      .forEach((freeBoost, index) => {
        if (
          index < this.character.ancestry.attribute_boost_selections?.length
        ) {
          attributes[
            this.character.ancestry.attribute_boost_selections[index]
          ] += 1
        }
      })
    this.attributes = attributes
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
    pc.calculateAttributes()
    pc.calculateLanguages()
    return pc
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
