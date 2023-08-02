import { Ancestry, Attribute, AttributeModifier } from './db/ancestry'
import { Background, ProficiencyFeatureValue } from './db/background'
import {
  CharacterAncestry,
  CharacterBackground,
  CharacterEntity,
} from './db/character-entity'
import {
  ConditionalFeatureValue,
  Feature,
  ResistanceFeatureValue,
  featureMatcher,
} from './db/feature'
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
  if (characterAncestry.free_attribute === false) {
    return getAncestryDefaultAttributeChoices(characterAncestry, ancestry)
  } else {
    return getAncestryFreeAttributeChoices(characterAncestry, ancestry)
  }
}

function getAncestryDefaultAttributeChoices(
  characterAncestry: CharacterAncestry,
  ancestry: Ancestry
) {
  let options: Attribute[][] = ancestry.attribute_boosts
    .filter((choices) => choices.length)
    .filter((choices) => choices[0] === 'Free')
    .map(() => [...ATTRIBUTES])

  for (let i = 0; i < options.length; i++) {
    options[i] = options[i].filter(
      (option: any) =>
        ancestry.attribute_boosts
          .filter((attribute) => attribute.length === 1)
          .map((attribute: AttributeModifier[]) => attribute[0])
          .indexOf(option) === -1 &&
        characterAncestry.attribute_boost_selections.indexOf(option) === -1
    )
  }
  return options
}

function getAncestryFreeAttributeChoices(
  characterAncestry: CharacterAncestry,
  ancestries: Ancestry
) {
  let options: Attribute[][] = [[...ATTRIBUTES], [...ATTRIBUTES]]

  for (let i = 0; i < options.length; i++) {
    options[i] = options[i].filter((option: any) => {
      return characterAncestry.attribute_boost_selections.indexOf(option) === -1
    })
  }
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
  if (characterAncestry.free_attribute === false) {
    return calculateAncestryDefaultAttributeModifications(
      characterAncestry,
      ancestry
    )
  } else {
    return calculateAncestryFreeAttributeModifications(
      characterAncestry,
      ancestry
    )
  }
}

function calculateAncestryDefaultAttributeModifications(
  characterAncestry: CharacterAncestry,
  ancestry: Ancestry
) {
  let attributes: any = {}
  ATTRIBUTES.forEach((attribute) => (attributes[attribute] = 0))

  const staticBoosts = ancestry.attribute_boosts
    .filter((attribute) => attribute.length === 1)
    .filter((attribute) => attribute[0] !== 'Free')
    .map((attribute) => attribute[0])

  const choiceCount = ancestry.attribute_boosts
    .filter((attribute) => attribute.length === 1)
    .filter((attribute) => attribute[0] === 'Free').length

  staticBoosts.forEach((attribute) => {
    attributes[attribute as Attribute] += 1
  })
  ancestry.attribute_flaws.forEach((attribute) => {
    attributes[attribute as Attribute] -= 1
  })

  characterAncestry.attribute_boost_selections = buildChoiceSelectionArray(
    choiceCount,
    characterAncestry.attribute_boost_selections,
    staticBoosts,
    undefined
  )

  characterAncestry.attribute_boost_selections
    .filter((val) => val)
    .forEach((val) => (attributes[val!] += 1))

  return attributes
}

function calculateAncestryFreeAttributeModifications(
  characterAncestry: CharacterAncestry,
  ancestry: Ancestry
) {
  let attributes: any = {}
  ATTRIBUTES.forEach((attribute) => (attributes[attribute] = 0))

  const choiceCount = [['Free'], ['Free']].length

  characterAncestry.attribute_boost_selections = buildChoiceSelectionArray(
    choiceCount,
    characterAncestry.attribute_boost_selections,
    [],
    undefined
  )

  characterAncestry.attribute_boost_selections
    .filter((val) => val)
    .forEach((val) => (attributes[val!] += 1))

  return attributes
}

function getBackgroundAttributeChoices(
  characterBackground: CharacterBackground,
  background: Background
) {
  let options: Attribute[][] = background.attributes.map(
    (choices: AttributeModifier[]) => {
      if (choices.length === 1 && choices[0] === 'Free') {
        return [...ATTRIBUTES]
      } else {
        return choices as Attribute[]
      }
    }
  )

  for (let i = 0; i < options.length; i++) {
    options[i] = options[i].filter(
      (option: Attribute) =>
        characterBackground.attribute_boost_selections.indexOf(option) === -1
    )
  }

  return options
}

function calculateBackgroundAttributeModifications(
  characterBackground: CharacterBackground,
  background: Background
) {
  let attributes: any = {}
  ATTRIBUTES.forEach((attribute) => (attributes[attribute] = 0))

  characterBackground.attribute_boost_selections = buildChoiceSelectionArray(
    background.attributes.length,
    characterBackground.attribute_boost_selections,
    [],
    undefined
  )

  characterBackground.attribute_boost_selections
    .filter((val) => val)
    .forEach((val) => (attributes[val!] += 1))

  return attributes
}

export class PlayerCharacter {
  private level!: number
  private speed!: number
  private size!: string
  private attributes!: Attributes
  private languages: string[] = []
  private traits: string[] = []
  private hitpoints: number = 0
  private features: Feature[] = []

  private constructor(
    private character: CharacterEntity,
    private ancestry: Ancestry,
    private heritage?: Heritage,
    private background?: Background
  ) {
    this.level = character.level
    this.speed = this.ancestry.speed
    this.size = this.ancestry.size
    this.attributes = {
      Strength: 0,
      Dexterity: 0,
      Constitution: 0,
      Intelligence: 0,
      Wisdom: 0,
      Charisma: 0,
    }
    this.calculateAttributes()
    this.calculateLanguages()

    this.initializeTraits()
    this.initializeHitpoints()

    this.ancestry.features.forEach((feature) =>
      this.addFeatureToCharacter(feature)
    )
    if (this.heritage) {
      this.heritage?.features.forEach((feature) =>
        this.addFeatureToCharacter(feature)
      )
    }
    if (this.background) {
      this.background?.skills.forEach((skill) => {
        this.addFeatureToCharacter({ type: 'PROFICIENCY', value: skill })
      })
    }
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

  public async updateBackground(
    backgroundId: string
  ): Promise<PlayerCharacter> {
    let newCharacter = { ...this.character }
    newCharacter.background.id = backgroundId
    newCharacter.background.attribute_boost_selections = []
    return await PlayerCharacter.build(this.character)
  }

  public getTraits(): string[] {
    return this.traits
  }

  public getAncestryId(): string {
    return this.ancestry._id.toString()
  }

  public getBackgroundId(): string {
    return this.background?._id.toString() ?? ''
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
    return this.features
      .filter((feature) => feature.type === 'SENSE')
      .map((feature) => feature.value)
  }

  public getAdditionalFeatures(): string[] {
    return this.features
      .filter((feature) => feature.type === 'MISC')
      .map((feature) => feature.value)
  }

  public getResistances(): Resistance[] {
    return this.features
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
      })
  }

  public getActions(): string[] {
    return this.features
      .filter((feature) => feature.type === 'ACTION')
      .map((feature) => feature.value)
  }

  public getProficiencies(): ProficiencyFeatureValue[] {
    return this.features
      .filter((feature) => feature.type === 'PROFICIENCY')
      .map((feature) => feature.value)
  }

  public getAttributeChoices(): {
    ancestry: Attribute[][]
    background: Attribute[][]
  } {
    return {
      ancestry: getAncestryAttributeChoices(
        this.character.ancestry,
        this.ancestry
      ),
      background: this.background
        ? getBackgroundAttributeChoices(
            this.character.background,
            this.background
          )
        : [],
    }
  }

  public getLanguageChoices(): { ancestry: string[] } {
    return {
      ancestry: getAncestryLanguageChoices(this.languages, this.ancestry),
    }
  }

  // should languages get wrapped into the feature list?
  private calculateLanguages() {
    let languages = []

    const additionalLanguages =
      this.attributes.Intelligence + (this.ancestry.languages.additional ?? 0)

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

    const backgroundMods: any = this.background
      ? calculateBackgroundAttributeModifications(
          this.character.background,
          this.background
        )
      : undefined

    Object.keys(ancestryMods).forEach(
      (attribute: string) => (attributes[attribute] += ancestryMods[attribute])
    )

    Object.keys(backgroundMods).forEach(
      (attribute: string) =>
        (attributes[attribute] += backgroundMods[attribute])
    )

    this.attributes = attributes
  }

  private initializeTraits() {
    this.traits.push(...this.ancestry.traits)
    this.heritage?.traits && this.traits.push(...this.heritage.traits)
  }

  private initializeHitpoints() {
    this.hitpoints += this.ancestry.hitpoints
  }

  private addFeatureToCharacter(feature: Feature) {
    if (feature.type !== 'CONDITIONAL') {
      this.features.push(feature)
    } else {
      const resolvedFeature = this.resolveConditionalFeature(
        feature.value as ConditionalFeatureValue
      )
      this.addFeatureToCharacter(resolvedFeature)
    }
  }

  private resolveConditionalFeature(
    conditional: ConditionalFeatureValue
  ): Feature {
    let feature: Feature = conditional.default
    if (
      conditional.condition.operator === 'has' &&
      this.doesCharacterHaveFeature(conditional.condition.operand)
    ) {
      feature = conditional.matched
    }
    return feature
  }

  private doesCharacterHaveFeature(feature: Feature): boolean {
    return this.features.findIndex(featureMatcher(feature)) !== -1
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
    let background
    if (character.background.id) {
      background = await (
        await fetch(
          `http://localhost:3000/api/backgrounds/${character.background.id}`,
          {
            cache: 'no-store',
          }
        )
      ).json()
    }
    const pc = new PlayerCharacter(character, ancestry, heritage, background)
    return pc
  }
}
