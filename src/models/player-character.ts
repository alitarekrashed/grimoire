import { AdditionalFeature, Ancestry, Attribute } from './db/ancestry'
import { CharacterAncestry, CharacterEntity } from './db/character-entity'

export interface Attributes {
  Strength: number
  Dexterity: number
  Constitution: number
  Intelligence: number
  Wisdom: number
  Charisma: number
}

const ATTRIBUTES: Attribute[] = [
  'Strength',
  'Dexterity',
  'Constitution',
  'Intelligence',
  'Wisdom',
  'Charisma',
]

function getAncestryAttributeChoices(
  characterAncestry: CharacterAncestry,
  ancestry: Ancestry
) {
  let options = [...ATTRIBUTES]
  if (characterAncestry.free_attribute == false) {
    options = options.filter(
      (option) => ancestry.attribute_boosts.indexOf(option) === -1
    )
  }

  options = options.filter(
    (option) =>
      characterAncestry.attribute_boost_selections.indexOf(option) === -1
  )

  return options
}

function getAncestryLanguageChoices(
  characterAncestry: CharacterAncestry,
  ancestry: Ancestry
): string[] {
  let options = ancestry.languages.options
  options = options.filter(
    (option) => characterAncestry.language_selections.indexOf(option) === -1
  )

  return options
}

function getAncestryAttributeModifications(
  characterAncestry: CharacterAncestry,
  ancestry: Ancestry
) {
  let attributes: any = {}
  ATTRIBUTES.forEach((attribute) => (attributes[attribute] = 0))

  const freeAttributes = characterAncestry.free_attribute
    ? ['Free', 'Free']
    : ancestry.attribute_boosts.filter((attribute) => attribute === 'Free')

  if (characterAncestry.free_attribute === false) {
    ancestry.attribute_boosts
      .filter((attribute) => attribute !== 'Free')
      .forEach((attribute) => {
        attributes[attribute as Attribute] += 1
      })
    ancestry.attribute_flaws.forEach((attribute) => {
      attributes[attribute as Attribute] -= 1
    })
  }

  freeAttributes.forEach((freeBoost, index: number) => {
    if (
      index < characterAncestry.attribute_boost_selections?.length &&
      characterAncestry.attribute_boost_selections[index]
    ) {
      attributes[characterAncestry.attribute_boost_selections[index]!] += 1
    }
  })

  return attributes
}

// TODO can some of these be simplified and folded into the calculate attributes for ancestry?
function setCharacterAncestry(
  characterAncestry: CharacterAncestry,
  ancestry: Ancestry,
  intelligenceModifier: number
) {
  const freeAttributes = (
    characterAncestry.free_attribute
      ? ['Free', 'Free']
      : ancestry.attribute_boosts.filter((attribute) => attribute === 'Free')
  ).length

  const additionalLanguages = intelligenceModifier

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
    characterAncestry.attribute_boost_selections
  )
  const languageSelections = getExistingValue(
    additionalLanguages,
    characterAncestry.language_selections
  )

  characterAncestry.attribute_boost_selections = freeAttributeSelections
  characterAncestry.language_selections = languageSelections
}

export class PlayerCharacter {
  private attributes!: Attributes
  private languages!: string[]
  private traits!: string[]
  private speed!: number
  private hitpoints!: number
  private size!: string
  private senses!: string[]

  private constructor(
    private character: CharacterEntity,
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
    this.calculateAttributes()
    setCharacterAncestry(
      character.ancestry,
      ancestry,
      this.attributes.Intelligence
    )
    this.calculateLanguages()

    // TODO clean this up?
    this.traits = this.ancestry.traits
    this.speed = this.ancestry.speed
    this.size = this.ancestry.size
    this.hitpoints = this.ancestry.hitpoints
    this.senses = this.ancestry.additional
      .filter((feature: AdditionalFeature) => feature.type === 'Sense')
      .map((feature) => feature.value)
  }

  public getCharacter(): CharacterEntity {
    return this.character
  }

  public async updateAncestry(ancestryId: string): Promise<PlayerCharacter> {
    let newCharacter = { ...this.character }
    newCharacter.ancestry.id = ancestryId
    newCharacter.ancestry.attribute_boost_selections = []
    newCharacter.ancestry.language_selections = []
    return await PlayerCharacter.build(this.character)
  }

  public getTraits(): string[] {
    return this.traits
  }

  public getAncestryId(): string {
    return this.ancestry._id.toString()
  }

  public getAncestryName(): string {
    return this.ancestry.name
  }

  public getSpeed(): number {
    return this.speed
  }

  public getSize(): string {
    return this.size
  }

  public getMaxHitpoints(): number {
    return this.hitpoints
  }

  public getAttributes(): Attributes {
    return this.attributes
  }

  public getLanguages(): (string | undefined)[] {
    return this.languages
  }

  public getSenses(): string[] {
    return this.senses
  }

  public getAttributeChoices(): { ancestry: Attribute[] } {
    return {
      ancestry: getAncestryAttributeChoices(
        this.character.ancestry,
        this.ancestry
      ),
    }
  }

  public getLanguageChoices(): { ancestry: string[] } {
    return {
      ancestry: getAncestryLanguageChoices(
        this.character.ancestry,
        this.ancestry
      ),
    }
  }

  private calculateLanguages() {
    let languages = []

    languages.push(...this.ancestry.languages.given)
    languages.push(
      ...this.character.ancestry.language_selections.map((val) => val ?? '')
    )
    this.languages = languages
  }

  private calculateAttributes() {
    let attributes: any = {
      Strength: 0,
      Dexterity: 0,
      Constitution: 0,
      Intelligence: 0,
      Wisdom: 0,
      Charisma: 0,
    }

    const ancestryMods: any = getAncestryAttributeModifications(
      this.character.ancestry,
      this.ancestry
    )

    Object.keys(ancestryMods).forEach(
      (attribute: string) => (attributes[attribute] += ancestryMods[attribute])
    )

    this.attributes = attributes
  }

  static async build(character: CharacterEntity): Promise<PlayerCharacter> {
    const ancestry = await (
      await fetch(
        `http://localhost:3000/api/ancestries/${character.ancestry.id}`,
        {
          cache: 'no-store',
        }
      )
    ).json()
    const pc = new PlayerCharacter(character, ancestry)
    return pc
  }
}
