import { resolve } from 'path'
import { Ancestry, Attribute } from './db/ancestry'
import { Background, ProficiencyFeatureValue } from './db/background'
import {
  CharacterAncestry,
  CharacterBackground,
  CharacterEntity,
} from './db/character-entity'
import { Feat } from './db/feat'
import {
  ConditionalFeatureValue,
  Feature,
  FeatureType,
  ModifierFeatureValue,
  ResistanceFeatureValue,
  featureMatcher,
} from './db/feature'
import { Heritage } from './db/heritage'

export interface Attributes {
  Strength: number
  Dexterity: number
  Constitution: number
  Intelligence: number
  Wisdom: number
  Charisma: number
}

export interface SourcedFeature {
  source: string
  feature: Feature
}

export interface AttributeSelections {
  ancestry: Attribute[]
  background: Attribute[]
}

export interface AttributeOptions {
  ancestry: Attribute[][]
  background: Attribute[][]
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
  private traits: string[] = []
  private hitpoints: number = 0
  private features: SourcedFeature[] = []

  private constructor(
    private character: CharacterEntity,
    private ancestry: Ancestry,
    private allFeatures: SourcedFeature[],
    private heritage?: Heritage,
    private background?: Background
  ) {
    this.level = character.level

    // TODO ALI need a better way to handle this, also need to check the type of modifier to ensure we aren't double counting circumtance bonuses etc.
    this.speed =
      this.ancestry.speed +
      this.allFeatures
        .filter(
          (value) =>
            value.feature.type === 'MODIFIER' &&
            (value.feature.value as ModifierFeatureValue).type === 'Speed'
        )
        .map((value) => value.feature.value.modifier.value)
        .reduce((sum, val) => sum + val, 0)
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

    this.allFeatures.forEach((feature) => this.addFeatureToCharacter(feature))
  }

  public getCharacter(): CharacterEntity {
    return this.character
  }

  public updateName(name: string): PlayerCharacter {
    let newCharacter = { ...this.character }
    newCharacter.name = name
    this.character = newCharacter
    return this
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
    return await PlayerCharacter.build(newCharacter)
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

  public getAncestry(): Ancestry {
    return this.ancestry
  }

  public getBackground(): Background {
    return this.background!
  }

  public getHeritageId(): string {
    return this.heritage?._id.toString() ?? ''
  }

  public getHeritageName(): string {
    return this.heritage?.name ?? ''
  }

  public getLineageName(): string {
    const ancestry = this.ancestry.name
    let heritage: string = this.heritage?.name ?? ''
    return `${this.background?.name ?? ''} ${heritage.replace(
      ancestry,
      ''
    )} ${ancestry}`
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

  public getLanguages(): SourcedFeature[] {
    return this.features
      .filter((feature) => feature.feature.type === 'LANGUAGE')
      .map((feature) => feature)
  }

  public getSenses(): SourcedFeature[] {
    return this.features
      .filter((feature) => feature.feature.type === 'SENSE')
      .map((feature) => feature)
  }

  public getAdditionalFeatures(): SourcedFeature[] {
    return this.features
      .filter((feature) => feature.feature.type === 'MISC')
      .map((feature) => feature)
  }

  public getLevelFeatures(): SourcedFeature[] {
    return this.character.features['1']
  }

  public getResistances(): SourcedFeature[] {
    return this.features
      .filter((feature) => feature.feature.type === 'RESISTANCE')
      .map((feature) => {
        let resistance = feature.feature.value as ResistanceFeatureValue
        let formulaValue =
          resistance.formula === 'half-level' ? Math.floor(this.level / 2) : 0
        return {
          source: feature.source,
          feature: {
            type: 'RESISTANCE',
            value: {
              damage_type: resistance.damage_type,
              value:
                formulaValue > resistance.minimum
                  ? formulaValue
                  : resistance.minimum,
            },
          },
        }
      })
  }

  public getActions(): SourcedFeature[] {
    return this.features
      .filter((feature) => feature.feature.type === 'ACTION')
      .map((feature) => feature)
  }

  public getProficiencies(): SourcedFeature[] {
    return this.features
      .filter((feature) => feature.feature.type === 'PROFICIENCY')
      .map((feature) => feature)
  }

  public getAttributeSelections(): AttributeSelections {
    return {
      ancestry: this.character.ancestry.attribute_boost_selections,
      background: this.character.background.attribute_boost_selections,
    }
  }

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

  private addFeatureToCharacter(feature: SourcedFeature) {
    if (feature.feature.type !== 'CONDITIONAL') {
      this.features.push(feature)
    } else {
      const resolvedFeature = this.resolveConditionalFeature(
        feature.feature.value as ConditionalFeatureValue,
        feature.source
      )
      this.addFeatureToCharacter(resolvedFeature)
    }
  }

  private resolveConditionalFeature(
    conditional: ConditionalFeatureValue,
    source: string
  ): SourcedFeature {
    let feature: SourcedFeature = {
      source: source,
      feature: conditional.default,
    }
    if (
      conditional.condition.operator === 'has' &&
      this.doesCharacterHaveFeature({
        source: source,
        feature: conditional.condition.operand,
      })
    ) {
      feature = { source: source, feature: conditional.matched }
    }
    return feature
  }

  private doesCharacterHaveFeature(feature: SourcedFeature): boolean {
    return this.features.findIndex(featureMatcher(feature)) !== -1
  }

  static async getAncestry(id: string) {
    return await (
      await fetch(`http://localhost:3000/api/ancestries/${id}`, {
        cache: 'no-store',
      })
    ).json()
  }

  static async getHeritage(id: string) {
    return id
      ? await (
          await fetch(`http://localhost:3000/api/heritages/${id}`, {
            cache: 'no-store',
          })
        ).json()
      : undefined
  }

  static async getBackground(id: string) {
    return id
      ? await (
          await fetch(`http://localhost:3000/api/backgrounds/${id}`, {
            cache: 'no-store',
          })
        ).json()
      : undefined
  }

  static async getFeat(name: string) {
    return name
      ? await (
          await fetch(`http://localhost:3000/api/feats?name=${name}`, {
            cache: 'no-store',
          })
        ).json()
      : undefined
  }

  static async build(character: CharacterEntity): Promise<PlayerCharacter> {
    const [ancestry, heritage, background] = await Promise.all([
      PlayerCharacter.getAncestry(character.ancestry.id),
      PlayerCharacter.getHeritage(character.ancestry.heritage_id),
      PlayerCharacter.getBackground(character.background.id),
    ])

    const allFeatures: SourcedFeature[] = []
    allFeatures.push(
      ...ancestry.features.map((feature: Feature) => {
        return {
          source: ancestry.name,
          feature: feature,
        }
      })
    )
    allFeatures.push(
      ...ancestry.languages.given.map((language: string) => {
        return {
          source: ancestry.name,
          feature: { type: 'LANGUAGE', value: language },
        }
      })
    )
    allFeatures.push(
      ...character.ancestry.language_selections.map((language: string) => {
        return {
          source: ancestry.name,
          feature: { type: 'LANGUAGE' as FeatureType, value: language },
        }
      })
    )
    if (heritage) {
      allFeatures.push(
        ...heritage.features.map((feature: Feature) => {
          return {
            source: heritage.name,
            feature: feature,
          }
        })
      )
    }
    if (background) {
      allFeatures.push(
        ...background.skills.map((skill: ProficiencyFeatureValue) => {
          return {
            source: background.name,
            feature: { type: 'PROFICIENCY', value: skill },
          }
        })
      )

      let feats: string[] = []
      feats.push(background.feat)
      feats.push(
        ...character.features[1]
          .filter((value) => value.feature.type === 'FEAT')
          .map((value) => value.feature.value)
      )

      const resolvedFeats: Feat[][] = await Promise.all(
        feats.map((feat) => PlayerCharacter.getFeat(feat))
      )

      resolvedFeats
        .map((feat: Feat[]) => feat[0])
        .forEach((feat: Feat) => {
          allFeatures.push(
            ...feat.features.map((feature: Feature) => {
              return { source: feat.name, feature: feature }
            })
          )
        })
    }

    const pc = new PlayerCharacter(
      character,
      ancestry,
      allFeatures,
      heritage,
      background
    )
    return pc
  }
}
