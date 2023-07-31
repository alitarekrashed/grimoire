import { Ancestry, Attribute } from './db/ancestry'
import { CharacterAncestry, CharacterEntity } from './db/character-entity'
import { Feature, ResistanceFeatureValue } from './db/feature'
import { Heritage } from './db/heritage'
import { Resistance } from './resistance'

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

function buildChoiceSelectionArray(
  count: number,
  choices: any[],
  invalidChoice: any[],
  unsetValue: any
) {
  const values = []
  for (let i = 0; i < count; i++) {
    if (i < choices.length && invalidChoice.includes(choices[i]) === false) {
      values.push(choices[i])
    } else {
      values.push(unsetValue)
    }
  }
  return values
}

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
  knownLanguages: string[],
  ancestry: Ancestry
): string[] {
  let options = ancestry.languages.options
  options = options.filter((option) => knownLanguages.indexOf(option) === -1)

  return options
}

function calculateAncestryAttributeModifications(
  characterAncestry: CharacterAncestry,
  ancestry: Ancestry
) {
  let attributes: any = {}
  ATTRIBUTES.forEach((attribute) => (attributes[attribute] = 0))

  const freeAttributeCount = (
    characterAncestry.free_attribute
      ? ['Free', 'Free']
      : ancestry.attribute_boosts.filter((attribute) => attribute === 'Free')
  ).length

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

  characterAncestry.attribute_boost_selections = buildChoiceSelectionArray(
    freeAttributeCount,
    characterAncestry.attribute_boost_selections,
    characterAncestry.free_attribute === false ? ancestry.attribute_boosts : [],
    undefined
  )

  characterAncestry.attribute_boost_selections
    .filter((val) => val)
    .forEach((val) => (attributes[val!] += 1))

  return attributes
}

export class PlayerCharacter {
  private level!: number
  private attributes!: Attributes
  private languages!: string[]
  private traits!: string[]
  private speed!: number
  private hitpoints!: number
  private size!: string
  private senses!: string[]
  private additionalFeatures!: string[]
  private resistances!: Resistance[]

  private constructor(
    private character: CharacterEntity,
    private ancestry: Ancestry,
    private heritage?: Heritage
  ) {
    this.level = character.level
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
    this.calculateLanguages()

    // TODO clean this up?
    this.traits = this.ancestry.traits
    this.speed = this.ancestry.speed
    this.size = this.ancestry.size
    this.hitpoints = this.ancestry.hitpoints
    this.senses = this.ancestry.features
      .filter((feature: Feature) => feature.type === 'SENSE')
      .map((feature) => feature.value)
    this.additionalFeatures =
      this.heritage?.features
        .filter((feature) => feature.type === 'MISC')
        .map((feature) => feature.value as string) ?? []
    this.resistances =
      this.heritage?.features
        .filter((feature) => feature.type === 'RESISTANCE')
        .map((feature) => {
          let resistance = feature.value as ResistanceFeatureValue
          let formulaValue =
            resistance.formula === 'half-level' ? Math.floor(this.level / 2) : 0
          return {
            damage_type: resistance.damage_type,
            value:
              formulaValue > resistance.minimum
                ? formulaValue
                : resistance.minimum,
          }
        }) ?? []
    this.senses = this.senses.concat(
      this.heritage?.features
        .filter((feature) => feature.type === 'SENSE')
        .map((feature) => feature.value as string) ?? []
    )
    this.traits = this.traits.concat(this.heritage?.traits ?? [])
  }

  public getCharacter(): CharacterEntity {
    return this.character
  }

  public async updateAncestry(ancestryId: string): Promise<PlayerCharacter> {
    let newCharacter = { ...this.character }
    newCharacter.ancestry.id = ancestryId
    newCharacter.ancestry.attribute_boost_selections = []
    newCharacter.ancestry.language_selections = []
    newCharacter.ancestry.heritage_id = ''
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

  public getAdditionalFeatures(): string[] {
    return this.additionalFeatures
  }

  public getResistances(): Resistance[] {
    return this.resistances
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
      ancestry: getAncestryLanguageChoices(this.languages, this.ancestry),
    }
  }

  private calculateLanguages() {
    let languages = []

    const additionalLanguages = this.attributes.Intelligence

    const languageSelections = buildChoiceSelectionArray(
      additionalLanguages,
      this.character.ancestry.language_selections,
      [],
      ''
    )

    this.character.ancestry.language_selections = languageSelections

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

    const ancestryMods: any = calculateAncestryAttributeModifications(
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
    let heritage
    if (character.ancestry.heritage_id) {
      heritage = await (
        await fetch(
          `http://localhost:3000/api/heritages/${character.ancestry.heritage_id}`,
          {
            cache: 'no-store',
          }
        )
      ).json()
    }
    const pc = new PlayerCharacter(character, ancestry, heritage)
    return pc
  }
}
