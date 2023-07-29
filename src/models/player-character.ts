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

export class PlayerAncestry {
  public constructor(
    private ancestry: Ancestry,
    private characterAncestry: CharacterAncestry
  ) {}

  public getId(): string {
    return this.ancestry._id.toString()
  }

  public getName(): string {
    return this.ancestry.name
  }

  public getSpeed(): number {
    return this.ancestry.speed
  }

  public getSize(): string {
    return this.ancestry.size
  }

  public getHitpoints(): number {
    return this.ancestry.hitpoints
  }

  public getTraits(): string[] {
    return this.ancestry.traits
  }

  public getSenses(): string[] {
    const ancestrySenses = this.ancestry.additional
      .filter((feature: AdditionalFeature) => feature.type === 'Sense')
      .map((feature) => feature.value)

    return ancestrySenses
  }

  public getGivenLanguages(): string[] {
    return this.ancestry.languages.given
  }

  public getChosenLanguages(): string[] {
    return this.characterAncestry.language_selections.map((val) => val ?? '')
  }

  // TODO ALI... maybe we need a player ancestry separate from the actual ancestry that encapsulates all this logic
  public getAttributeChoices() {
    let options = [...ATTRIBUTES]
    if (this.characterAncestry.free_attribute == false) {
      options = options.filter(
        (option) => this.ancestry.attribute_boosts.indexOf(option) === -1
      )
    }

    options = options.filter(
      (option) =>
        this.characterAncestry.attribute_boost_selections.indexOf(option) === -1
    )

    return options
  }

  // TODO ALI... maybe we need a player ancestry separate from the actual ancestry that encapsulates all this logic
  public getLanguageChoices(): string[] {
    let options = this.ancestry.languages.options
    options = options.filter(
      (option) =>
        this.characterAncestry.language_selections.indexOf(option) === -1
    )

    return options
  }

  public initialize(intelligenceModifier: number) {
    const freeAttributes = (
      this.characterAncestry.free_attribute
        ? ['Free', 'Free']
        : this.ancestry.attribute_boosts.filter(
            (attribute) => attribute === 'Free'
          )
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
      this.characterAncestry.attribute_boost_selections
    )
    const languageSelections = getExistingValue(
      additionalLanguages,
      this.characterAncestry.language_selections
    )

    this.characterAncestry.attribute_boost_selections = freeAttributeSelections
    this.characterAncestry.language_selections = languageSelections
  }

  public getAttributeModifications() {
    let attributes: any = {}
    ATTRIBUTES.forEach((attribute) => (attributes[attribute] = 0))

    const freeAttributes = this.characterAncestry.free_attribute
      ? ['Free', 'Free']
      : this.ancestry.attribute_boosts.filter(
          (attribute) => attribute === 'Free'
        )

    if (this.characterAncestry.free_attribute === false) {
      this.ancestry.attribute_boosts
        .filter((attribute) => attribute !== 'Free')
        .forEach((attribute) => {
          attributes[attribute as Attribute] += 1
        })
      this.ancestry.attribute_flaws.forEach((attribute) => {
        attributes[attribute as Attribute] -= 1
      })
    }

    freeAttributes.forEach((freeBoost, index: number) => {
      if (
        index < this.characterAncestry.attribute_boost_selections?.length &&
        this.characterAncestry.attribute_boost_selections[index]
      ) {
        attributes[
          this.characterAncestry.attribute_boost_selections[index]!
        ] += 1
      }
    })

    return attributes
  }
}

export class PlayerCharacter {
  private attributes!: Attributes
  private languages!: (string | undefined)[]

  private constructor(
    private character: CharacterEntity,
    private ancestry: PlayerAncestry
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
    this.ancestry.initialize(this.attributes.Intelligence)
    this.calculateLanguages()
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
    return this.ancestry.getTraits()
  }

  public getAncestryId(): string {
    return this.ancestry.getId()
  }

  public getAncestryName(): string {
    return this.ancestry.getName()
  }

  public getSpeed(): number {
    return this.ancestry.getSpeed()
  }

  public getSize(): string {
    return this.ancestry.getSize()
  }

  public getMaxHitpoints(): number {
    return this.ancestry.getHitpoints()
  }

  public getAttributes(): Attributes {
    return this.attributes
  }

  public getLanguages(): (string | undefined)[] {
    return this.languages
  }

  public getSenses(): string[] {
    return this.ancestry.getSenses()
  }

  public getAttributeChoices(): { ancestry: Attribute[] } {
    return {
      ancestry: this.ancestry.getAttributeChoices(),
    }
  }

  public getLanguageChoices(): { ancestry: string[] } {
    return {
      ancestry: this.ancestry.getLanguageChoices(),
    }
  }

  private calculateLanguages() {
    let languages = []

    languages.push(...this.ancestry.getGivenLanguages())
    languages.push(...this.ancestry.getChosenLanguages())
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

    const ancestryMods: any = this.ancestry.getAttributeModifications()

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
    const playerAncestry = new PlayerAncestry(ancestry, character.ancestry)
    const pc = new PlayerCharacter(character, playerAncestry)
    return pc
  }
}
