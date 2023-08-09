import { ModifierValue } from '@/components/calculated-display/calculated-display'
import { cloneDeep } from 'lodash'
import { Ancestry, Attribute } from './db/ancestry'
import {
  Background,
  ProficiencyFeatureValue,
  ProficiencyRank,
  RankModifierMap,
} from './db/background'
import { CharacterEntity } from './db/character-entity'
import { ClassEntity } from './db/class_entity'
import { Feat } from './db/feat'
import {
  ConditionalFeatureValue,
  Feature,
  FeatureType,
  ModifierFeatureValue,
  ResistanceFeatureValue,
  SkillSelectionFeatureValue,
  featureMatcher,
} from './db/feature'
import { Heritage } from './db/heritage'
import {
  CalculatedProficiency,
  SavingThrowAttributes,
  SavingThrowType,
  SkillType,
} from './statistic'

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
  class: Attribute[]
}

const ATTRIBUTES: Attribute[] = [
  'Strength',
  'Dexterity',
  'Constitution',
  'Intelligence',
  'Wisdom',
  'Charisma',
]

async function resolveFeats(feats: string[]): Promise<SourcedFeature[]> {
  let resolvedFeatures: SourcedFeature[] = []
  const resolvedFeats: Feat[][] = await Promise.all(
    feats.map((feat) => PlayerCharacter.getFeat(feat))
  )

  let additionalFeats: string[] = []
  resolvedFeats
    .map((feat: Feat[]) => feat[0])
    .forEach((feat: Feat) => {
      resolvedFeatures.push(
        ...feat.features
          .filter((feature) => feature.type !== 'FEAT')
          .map((feature: Feature) => {
            return { source: feat.name, feature: feature }
          })
      )
      additionalFeats.push(
        ...feat.features
          .filter((feature) => feature.type === 'FEAT')
          .map((feature) => feature.value)
      )
    })

  if (additionalFeats.length > 0) {
    resolvedFeatures.push(...(await resolveFeats(additionalFeats)))
  }
  return resolvedFeatures
}

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
  character: CharacterEntity,
  ancestry: Ancestry
) {
  if (character.attributes.free_ancestry_attribute_selection === false) {
    return calculateAncestryDefaultAttributeModifications(character, ancestry)
  } else {
    return calculateAncestryFreeAttributeModifications(character)
  }
}

function calculateAncestryDefaultAttributeModifications(
  character: CharacterEntity,
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

  character.attributes.ancestry = buildChoiceSelectionArray(
    choiceCount,
    character.attributes.ancestry,
    staticBoosts,
    undefined
  )

  character.attributes.ancestry
    .filter((val) => val)
    .forEach((val) => (attributes[val!] += 1))

  return attributes
}

function calculateAncestryFreeAttributeModifications(
  character: CharacterEntity
) {
  let attributes: any = {}
  ATTRIBUTES.forEach((attribute) => (attributes[attribute] = 0))

  const choiceCount = [['Free'], ['Free']].length

  character.attributes.ancestry = buildChoiceSelectionArray(
    choiceCount,
    character.attributes.ancestry,
    [],
    undefined
  )

  character.attributes.ancestry
    .filter((val) => val)
    .forEach((val) => (attributes[val!] += 1))

  return attributes
}

function calculateBackgroundAttributeModifications(
  character: CharacterEntity,
  background: Background
) {
  let attributes: any = {}
  ATTRIBUTES.forEach((attribute) => (attributes[attribute] = 0))

  character.attributes.background = buildChoiceSelectionArray(
    background.attributes.length,
    character.attributes.background,
    [],
    undefined
  )

  character.attributes.background
    .filter((val) => val)
    .forEach((val) => (attributes[val!] += 1))

  return attributes
}

function calculateClassAttributeModifications(
  character: CharacterEntity,
  classEntity: ClassEntity
) {
  let attributes: any = {}
  ATTRIBUTES.forEach((attribute) => (attributes[attribute] = 0))

  character.attributes.class = buildChoiceSelectionArray(
    classEntity.key_ability.length,
    character.attributes.class,
    [],
    undefined
  )

  character.attributes.class
    .filter((val) => val)
    .forEach((val) => (attributes[val!] += 1))

  return attributes
}

function calculateLevelAttributeModifications(character: CharacterEntity) {
  let attributes: any = {}
  ATTRIBUTES.forEach((attribute) => (attributes[attribute] = 0))

  character.attributes.level_1
    .filter((val) => val)
    .forEach((val) => (attributes[val!] += 1))

  return attributes
}

export class PlayerCharacter {
  private level!: number
  private speed!: ModifierValue[]
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
    private background?: Background,
    private classEntity?: ClassEntity
  ) {
    this.level = character.level

    this.speed = [
      { value: this.ancestry.speed, source: `Base (${ancestry.name})` },
    ]
    this.speed.push(
      ...this.allFeatures
        .filter(
          (value) =>
            value.feature.type === 'MODIFIER' &&
            (value.feature.value as ModifierFeatureValue).type === 'Speed'
        )
        .map((value) => {
          return {
            ...value.feature.value.modifier,
            source: value.source,
          }
        })
    )
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

    if (classEntity) {
      classEntity.features['1']
        .filter((feature: Feature) => feature.type === 'SKILL_SELECTION')
        .forEach((feature: Feature) => {
          const classSkillSelections = character.features['1']
            .filter((sourced: SourcedFeature) => sourced.source === 'CLASS')
            .map((sourced: SourcedFeature) => sourced.feature)
            .filter((feature: Feature) => feature.type === 'SKILL_SELECTION')
            .map(
              (feature: Feature) => feature.value as SkillSelectionFeatureValue
            )

          const skillSelection = feature.value as SkillSelectionFeatureValue
          if (!skillSelection.configuration.formula) {
            if (
              classSkillSelections.filter(
                (selection) => !selection.configuration.formula
              ).length === 0
            ) {
              const value: SourcedFeature = {
                source: 'CLASS',
                feature: {
                  type: 'SKILL_SELECTION',
                  value: {
                    ...skillSelection,
                    value: null,
                  },
                },
              }
              character.features['1'].push(value)
            }
          } else {
            const currentNumber = classSkillSelections.filter(
              (selection) => selection.configuration.formula
            ).length

            const expectedNumber: number =
              skillSelection.configuration.formula.reduce((prev, curr) => {
                if (typeof curr === 'number') {
                  return (prev as number) + curr
                } else {
                  return (prev as number) + this.attributes[curr]
                }
              }, 0) as number

            if (currentNumber < expectedNumber) {
              const toAdd = expectedNumber - currentNumber
              const values: SourcedFeature[] = []
              for (let i = 0; i < toAdd; i++) {
                values.push({
                  source: 'CLASS',
                  feature: {
                    type: 'SKILL_SELECTION',
                    value: {
                      ...skillSelection,
                      value: null,
                    },
                  },
                })
              }
              character.features['1'].push(...values)
            } else if (currentNumber > expectedNumber) {
              let removalCounter = currentNumber - expectedNumber
              const toRemove = []
              for (
                let i = character.features['1'].length - 1;
                i >= 0 && removalCounter > 0;
                i--
              ) {
                const currentFeature = character.features['1'][i]
                if (
                  currentFeature.source === 'CLASS' &&
                  currentFeature.feature.type === 'SKILL_SELECTION' &&
                  currentFeature.feature.value.configuration.formula
                ) {
                  toRemove.push(currentFeature)
                  removalCounter -= 1
                }
              }
              toRemove.forEach((item) => {
                const index = character.features['1'].indexOf(item)
                character.features['1'].splice(index, 1)
              })
            }
          }
        })

      const skillSelections = character.features['1']
        .filter((sourced: SourcedFeature) => sourced.source === 'CLASS')
        .filter(
          (sourced: SourcedFeature) =>
            sourced.feature.type === 'SKILL_SELECTION'
        )
      this.allFeatures.push(...skillSelections)
      console.log(skillSelections)
    }

    this.allFeatures.forEach((feature) => this.addFeatureToCharacter(feature))
  }

  public getCharacter(): CharacterEntity {
    return this.character
  }

  public updateName(name: string): PlayerCharacter {
    let updated = cloneDeep(this.character)
    updated.name = name
    this.character = updated
    return this
  }

  public async updateAncestry(ancestryId: string): Promise<PlayerCharacter> {
    let updated = cloneDeep(this.character)
    updated.ancestry_id = ancestryId
    updated.attributes.ancestry = []
    updated.languages = []
    updated.heritage_id = ''
    return await PlayerCharacter.build(updated)
  }

  public async updateBackground(
    backgroundId: string
  ): Promise<PlayerCharacter> {
    let updated = cloneDeep(this.character)
    updated.background_id = backgroundId
    updated.attributes.background = []
    return await PlayerCharacter.build(updated)
  }

  public getTraits(): string[] {
    return this.traits
  }

  public getAncestryId(): string {
    return this.character.ancestry_id
  }

  public getBackgroundId(): string {
    return this.character.background_id
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

  public getClassEntity(): ClassEntity {
    return this.classEntity!
  }

  public getHeritageId(): string {
    return this.character.heritage_id
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

  public getSpeed(): ModifierValue[] {
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

  public getProficiencies(): {
    Perception: Map<string, ProficiencyRank>
    Skill: Map<SkillType, ProficiencyRank>
    Lore: Map<string, ProficiencyRank>
    SavingThrow: Map<SavingThrowType, ProficiencyRank>
    Weapon: Map<string, ProficiencyRank>
    Defense: Map<string, ProficiencyRank>
    DifficultyClass: Map<string, ProficiencyRank>
  } {
    const proficiencyMap: {
      Perception: Map<string, ProficiencyRank>
      Skill: Map<string, ProficiencyRank>
      Lore: Map<string, ProficiencyRank>
      SavingThrow: Map<string, ProficiencyRank>
      Weapon: Map<string, ProficiencyRank>
      Defense: Map<string, ProficiencyRank>
      DifficultyClass: Map<string, ProficiencyRank>
    } = {
      Perception: new Map<string, ProficiencyRank>(),
      Skill: new Map<string, ProficiencyRank>(),
      Lore: new Map<string, ProficiencyRank>(),
      SavingThrow: new Map<SavingThrowType, ProficiencyRank>(),
      Weapon: new Map<string, ProficiencyRank>(),
      Defense: new Map<string, ProficiencyRank>(),
      DifficultyClass: new Map<string, ProficiencyRank>(),
    }

    this.features
      .filter((feature) => feature.feature.type === 'PROFICIENCY')
      .forEach((sourced: SourcedFeature) => {
        const proficency = sourced.feature.value as ProficiencyFeatureValue
        if (proficiencyMap[proficency.type].has(proficency.value) == false) {
          proficiencyMap[proficency.type].set(proficency.value, proficency.rank)
        } else {
          const existingRank = proficiencyMap[proficency.type].get(
            proficency.value
          )
          if (this.greaterThan(proficency.rank, existingRank!)) {
            proficiencyMap[proficency.type].set(
              proficency.value,
              proficency.rank
            )
          }
        }
      })
    return proficiencyMap as {
      Perception: Map<string, ProficiencyRank>
      Skill: Map<SkillType, ProficiencyRank>
      Lore: Map<string, ProficiencyRank>
      SavingThrow: Map<SavingThrowType, ProficiencyRank>
      Weapon: Map<string, ProficiencyRank>
      Defense: Map<string, ProficiencyRank>
      DifficultyClass: Map<string, ProficiencyRank>
    }
  }

  private greaterThan(
    thisRank: ProficiencyRank,
    other: ProficiencyRank
  ): boolean {
    if (other === 'untrained') {
      return true
    } else if (other === 'trained') {
      return thisRank === 'trained' || thisRank === 'expert'
    }
    return false
  }

  public getSavingThrows(): Map<SavingThrowType, CalculatedProficiency> {
    const savingThrows = this.getProficiencies().SavingThrow
    const result = new Map()
    savingThrows.forEach((rank, type) => {
      result.set(type, {
        rank: rank,
        modifier:
          RankModifierMap[rank] +
          this.attributes[SavingThrowAttributes.get(type) as Attribute],
      })
    })
    return result
  }

  public getPerception(): CalculatedProficiency {
    const perception = this.getProficiencies().Perception
    return {
      rank: perception.get('Perception')!,
      modifier:
        RankModifierMap[perception.get('Perception')!] + this.attributes.Wisdom,
    }
  }

  public getAttributeSelections(): AttributeSelections {
    return {
      ancestry: this.character.attributes.ancestry,
      background: this.character.attributes.background,
      class: this.character.attributes.class,
    }
  }

  private calculateLanguages() {
    const additionalLanguages =
      this.attributes.Intelligence + (this.ancestry.languages.additional ?? 0)

    const languageSelections = buildChoiceSelectionArray(
      additionalLanguages,
      this.character.languages,
      [],
      ''
    )

    this.character.languages = languageSelections
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
      this.character,
      this.ancestry
    )

    const backgroundMods: any = this.background
      ? calculateBackgroundAttributeModifications(
          this.character,
          this.background
        )
      : undefined

    const classMods: any = this.classEntity
      ? calculateClassAttributeModifications(this.character, this.classEntity)
      : undefined

    const level1Mods: any = calculateLevelAttributeModifications(this.character)

    Object.keys(ancestryMods).forEach(
      (attribute: string) => (attributes[attribute] += ancestryMods[attribute])
    )

    Object.keys(backgroundMods).forEach(
      (attribute: string) =>
        (attributes[attribute] += backgroundMods[attribute])
    )

    Object.keys(classMods).forEach(
      (attribute: string) => (attributes[attribute] += classMods[attribute])
    )

    Object.keys(level1Mods).forEach(
      (attribute: string) => (attributes[attribute] += level1Mods[attribute])
    )

    this.attributes = attributes
  }

  private initializeTraits() {
    this.traits.push(...this.ancestry.traits)
    this.heritage?.traits && this.traits.push(...this.heritage.traits)
  }

  private initializeHitpoints() {
    this.hitpoints += this.ancestry.hitpoints
    if (this.classEntity) {
      this.hitpoints += this.classEntity.hitpoints +=
        this.attributes.Constitution
    }
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

  static async getClass(id: string) {
    return id
      ? await (
          await fetch(`http://localhost:3000/api/classes/${id}`, {
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
    const [ancestry, heritage, background, classEntity] = await Promise.all([
      PlayerCharacter.getAncestry(character.ancestry_id),
      PlayerCharacter.getHeritage(character.heritage_id),
      PlayerCharacter.getBackground(character.background_id),
      PlayerCharacter.getClass(character.class_id),
    ])

    let feats: string[] = []
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
      ...character.languages.map((language: string) => {
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

      feats.push(background.feat)
    }

    character.features['1'].forEach((sourced: SourcedFeature) => {
      if (sourced.feature.type === 'FEAT') {
        feats.push(sourced.feature.value)
      } else if (sourced.feature.type === 'PROFICIENCY') {
        allFeatures.push({
          source: classEntity.name,
          feature: sourced.feature,
        })
      }
    })

    allFeatures.push(...(await resolveFeats(feats)))

    const pc = new PlayerCharacter(
      character,
      ancestry,
      allFeatures,
      heritage,
      background,
      classEntity
    )
    return pc
  }
}
