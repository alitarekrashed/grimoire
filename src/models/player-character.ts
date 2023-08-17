import { ModifierValue } from '@/components/calculated-display/calculated-display'
import { cloneDeep, eq } from 'lodash'
import { Ancestry, Attribute } from './db/ancestry'
import {
  Background,
  ProficiencyFeatureValue,
  ProficiencyRank,
  RankModifierMap,
} from './db/background'
import {
  ArmorDefinition,
  CharacterArmor,
  CharacterEntity,
  CharacterWeapon,
  WeaponDamageDefinition,
} from './db/character-entity'
import { ClassEntity } from './db/class-entity'
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
  SkillAttributes,
  SkillType,
  generateUntrainedSkillMap,
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
    .filter((val) => val)
    .map((feat: Feat[]) => feat[0])
    .forEach((feat: Feat) => {
      resolvedFeatures.push(
        ...feat.features
          .filter((feature) => !feature.value.action)
          .filter((feature) => feature.type !== 'FEAT')
          .map((feature: Feature) => {
            return { source: feat.name, feature: feature }
          })
      )
      if (feat.activation) {
        resolvedFeatures.push({
          source: feat.name,
          feature: { type: 'ACTION', value: feat },
        })
      }
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
  private hitpoints!: ModifierValue[]
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

    this.initializeSpeed(ancestry)
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
    this.initializeHitpoints(ancestry)

    if (classEntity) {
      classEntity.features['1']
        .filter((feature: Feature) => feature.type === 'SKILL_SELECTION')
        .forEach((feature: Feature) => {
          this.reconcileSkillOptionsWithClass(character, feature)
        })

      this.clearOutSkillsAlreadyPresentOnClass(character)

      this.convertSkillSelectionsIntoProficiencyFeaturesAndAddToCharacter(
        character
      )
    }

    this.allFeatures.forEach((feature) => this.addFeatureToCharacter(feature))
  }

  private convertSkillSelectionsIntoProficiencyFeaturesAndAddToCharacter(
    character: CharacterEntity
  ) {
    character.features['1']
      .filter((sourced: SourcedFeature) => sourced.source === 'CLASS')
      .filter(
        (sourced: SourcedFeature) => sourced.feature.type === 'SKILL_SELECTION'
      )
      .filter((sourced: SourcedFeature) => sourced.feature.value.value)
      .forEach((sourced: SourcedFeature) => {
        const values = sourced.feature.value.value.map((skill: string) => {
          return {
            source: sourced.source,
            feature: {
              type: 'PROFICIENCY',
              value: {
                // TODO this shouldn't be 'max rank' ... we should be storing the actual rank in the selection entity on the character
                rank: sourced.feature.value.configuration.max_rank,
                type: 'Skill',
                value: skill,
              },
            },
          }
        })
        this.allFeatures.push(...values)
      })
  }

  private clearOutSkillsAlreadyPresentOnClass(character: CharacterEntity) {
    character.features['1']
      .filter(
        (sourced) =>
          sourced.source === 'CLASS' &&
          sourced.feature.type === 'SKILL_SELECTION'
      )
      .forEach((sourced) => {
        sourced.feature.value.value.forEach((skill: string, index: number) => {
          const value =
            this.allFeatures.filter(
              (val) =>
                val.feature.type === 'PROFICIENCY' &&
                val.feature.value.type === 'Skill' &&
                val.feature.value.value === skill
            ).length === 0
              ? skill
              : null
          sourced.feature.value.value[index] = value
        })
      })
  }

  private reconcileSkillOptionsWithClass(
    character: CharacterEntity,
    feature: Feature
  ) {
    const classSkillSelections: SourcedFeature[] = character.features[
      '1'
    ].filter(
      (sourced: SourcedFeature) =>
        sourced.source === 'CLASS' && sourced.feature.type === 'SKILL_SELECTION'
    )

    const skillSelection = feature.value as SkillSelectionFeatureValue
    if (!skillSelection.configuration.formula) {
      if (
        !classSkillSelections.find(
          (sourced) => !sourced.feature.value.configuration.formula
        )
      ) {
        const value: SourcedFeature = {
          source: 'CLASS',
          feature: {
            type: 'SKILL_SELECTION',
            value: {
              ...skillSelection,
              value: [null],
            },
          },
        }
        character.features['1'].push(value)
      }
    } else {
      const expectedNumber: number =
        skillSelection.configuration.formula.reduce((prev, curr) => {
          if (typeof curr === 'number') {
            return (prev as number) + curr
          } else {
            return (prev as number) + this.attributes[curr]
          }
        }, 0) as number

      let classSkillSelection = classSkillSelections.find(
        (sourced) => sourced.feature.value.configuration.formula
      )
      if (!classSkillSelection) {
        const values = []
        for (let i = 0; i < expectedNumber; i++) {
          values.push(null)
        }
        let classSkillSelection: SourcedFeature = {
          source: 'CLASS',
          feature: {
            type: 'SKILL_SELECTION',
            value: {
              ...skillSelection,
              value: [values],
            },
          },
        }
        character.features['1'].push(classSkillSelection)
      }

      const currentNumber = classSkillSelection!.feature.value.value.length

      // TODO ALI instead of creating MULTIPLE skill_selection entities when we hit this point, maybe it's value should just be a list
      // then we can just .push or .splice in order to increase or reduce the size of the list in the consolidation step...
      if (currentNumber < expectedNumber) {
        const toAdd = expectedNumber - currentNumber
        for (let i = 0; i < toAdd; i++) {
          classSkillSelection?.feature.value.value.push(null)
        }
      } else if (currentNumber > expectedNumber) {
        let removalCounter = currentNumber - expectedNumber
        classSkillSelection!.feature.value.value.splice(
          classSkillSelection!.feature.value.value.length - removalCounter,
          removalCounter
        )
      }
    }
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
    updated.features['1'].filter(
      (val) => val.source === 'ANCESTRY' && val.feature.type === 'FEAT'
    )[0].feature.value = null
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

  public async updateClass(classEntity: ClassEntity): Promise<PlayerCharacter> {
    let updated = cloneDeep(this.character)
    updated.class_id = classEntity._id.toString()
    updated.attributes.class = []
    updated.features['1'] = updated.features['1'].filter(
      (value) => value.source !== 'CLASS'
    )
    updated.features['1'].push(
      ...classEntity.features['1'].map((feature: Feature) => {
        if (feature.type === 'SKILL_SELECTION') {
          feature.value.value = [null]
        }
        return { source: 'CLASS', feature: feature }
      })
    )
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

  public getMaxHitpoints(): ModifierValue[] {
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

  public getVulnerabilities(): SourcedFeature[] {
    return this.features
      .filter((feature) => feature.feature.type === 'VULNERABILITY')
      .map((feature) => {
        let vulnerability = feature.feature.value as ResistanceFeatureValue
        let formulaValue =
          vulnerability.formula === 'half-level'
            ? Math.floor(this.level / 2)
            : 0
        return {
          source: feature.source,
          feature: {
            type: 'VULNERABILITY',
            value: {
              damage_type: vulnerability.damage_type,
              value:
                formulaValue > vulnerability.minimum
                  ? formulaValue
                  : vulnerability.minimum,
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

  public getProficiencies(level?: string): {
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
      Skill: generateUntrainedSkillMap(),
      Lore: new Map<string, ProficiencyRank>(),
      SavingThrow: new Map<SavingThrowType, ProficiencyRank>(),
      Weapon: new Map<string, ProficiencyRank>(),
      Defense: new Map<string, ProficiencyRank>(),
      DifficultyClass: new Map<string, ProficiencyRank>(),
    }

    this.features
      .filter((feature) => {
        if (level) {
          return (
            feature.feature.type === 'PROFICIENCY' && feature.source !== 'CLASS'
          )
        } else {
          return feature.feature.type === 'PROFICIENCY'
        }
      })
      .forEach((sourced: SourcedFeature) => {
        const proficency = sourced.feature.value as ProficiencyFeatureValue
        if (
          proficency.value &&
          proficiencyMap[proficency.type].has(proficency.value) == false
        ) {
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
          this.level +
          this.attributes[SavingThrowAttributes.get(type) as Attribute],
      })
    })
    return result
  }

  public getSkills(level?: string): Map<SkillType, CalculatedProficiency> {
    const skills = this.getProficiencies(level).Skill
    const result = new Map()
    skills.forEach((rank, type) => {
      result.set(type, {
        rank: rank,
        modifier:
          RankModifierMap[rank] +
          this.level +
          this.attributes[SkillAttributes.get(type) as Attribute],
      })
    })
    return result
  }

  public getLores(level?: string): Map<string, CalculatedProficiency> {
    const skills = this.getProficiencies(level).Lore
    const result = new Map()
    skills.forEach((rank, type) => {
      result.set(type, {
        rank: rank,
        modifier:
          RankModifierMap[rank] + this.level + this.attributes['Intelligence'],
      })
    })
    return result
  }

  public getClassDC(): CalculatedProficiency {
    const classDC = this.getProficiencies().DifficultyClass
    return {
      rank: classDC.get('class DC')!,
      modifier:
        RankModifierMap[classDC.get('class DC')!] +
        this.level +
        this.attributes[this.character.attributes.class[0]],
    }
  }

  public getPerception(): CalculatedProficiency {
    const perception = this.getProficiencies().Perception
    return {
      rank: perception.get('Perception')!,
      modifier:
        RankModifierMap[perception.get('Perception')!] +
        this.level +
        this.attributes.Wisdom,
    }
  }

  // TODO this needs some love/cleanup
  public getArmorClass(): ModifierValue[] {
    const result: ModifierValue[] = []
    result.push({
      value: 10,
      source: 'Base',
    })

    const equippedArmor: CharacterArmor = {
      name: 'unarmored',
      traits: [],
      definition: {
        category: 'unarmored',
        group: 'cloth',
        ac_bonus: 0,
      },
    }

    if (
      equippedArmor.definition.dex_cap === undefined ||
      this.attributes.Dexterity <= equippedArmor.definition.dex_cap
    ) {
      result.push({
        value: this.attributes.Dexterity,
        source: 'Dexterity',
      })
    } else {
      result.push({
        value: equippedArmor.definition.dex_cap,
        source: `Dexterity (capped from ${equippedArmor.name})`,
      })
    }

    const defenseProfs = this.getProficiencies().Defense
    let minimumRank: ProficiencyRank = 'untrained'
    if (defenseProfs.has('all armor')) {
      if (this.greaterThan(defenseProfs.get('all armor')!, minimumRank)) {
        minimumRank = defenseProfs.get('all armor')!
      }
    }

    const category =
      equippedArmor.definition.category === 'unarmored'
        ? 'unarmored defense'
        : equippedArmor.definition.category
    if (defenseProfs.has(category)) {
      if (this.greaterThan(defenseProfs.get(category)!, minimumRank)) {
        minimumRank = defenseProfs.get(category)!
      }
    }

    if (defenseProfs.has(equippedArmor.name)) {
      if (
        this.greaterThan(defenseProfs.get(equippedArmor.name)!, minimumRank)
      ) {
        minimumRank = defenseProfs.get(equippedArmor.name)!
      }
    }

    if (minimumRank && minimumRank !== 'untrained') {
      result.push({
        value: RankModifierMap[minimumRank] + this.level,
        // TODO use the actual set one, not always the category
        source: `Proficiency (${equippedArmor.definition.category})`,
      })
    }

    if (equippedArmor.definition.ac_bonus) {
      result.push({
        value: equippedArmor.definition.ac_bonus,
        source: `AC Bonus (${equippedArmor.name})`,
      })
    }
    return result
  }

  // TODO this needs some love/cleanup
  public getAttack(): {
    name: string
    damage: WeaponDamageDefinition[]
    attackBonus: ModifierValue[][]
    damageBonus: number
  } {
    const attackBonus: ModifierValue[] = []

    const fist: CharacterWeapon = {
      name: 'fist',
      traits: ['agile', 'finesse', 'nonlethal', 'unarmed'],
      definition: {
        category: 'unarmed',
        group: 'brawling',
        type: 'melee',
        damage: [
          {
            type: 'bludgeoning',
            dice: '1d4',
          },
        ],
      },
    }

    if (
      fist.traits.includes('finesse') &&
      this.attributes.Dexterity > this.attributes.Strength
    ) {
      attackBonus.push({
        value: this.attributes.Dexterity,
        source: 'Dexterity',
      })
    } else {
      attackBonus.push({
        value: this.attributes.Strength,
        source: 'Strength',
      })
    }

    const weaponProfs = this.getProficiencies().Weapon
    let minimumRank: ProficiencyRank = 'untrained'
    if (weaponProfs.has('all weapons')) {
      if (this.greaterThan(weaponProfs.get('all weapons')!, minimumRank)) {
        minimumRank = weaponProfs.get('all weapons')!
      }
    }

    if (weaponProfs.has(fist.definition.category)) {
      if (
        this.greaterThan(
          weaponProfs.get(fist.definition.category)!,
          minimumRank
        )
      ) {
        minimumRank = weaponProfs.get(fist.definition.category)!
      }
    }

    if (weaponProfs.has(fist.name)) {
      if (this.greaterThan(weaponProfs.get(fist.name)!, minimumRank)) {
        minimumRank = weaponProfs.get(fist.name)!
      }
    }

    if (minimumRank && minimumRank !== 'untrained') {
      attackBonus.push({
        value: RankModifierMap[minimumRank] + this.level,
        // TODO use the actual set one, not always the category
        source: `Proficiency (${fist.definition.category})`,
      })
    }

    return {
      name: fist.name,
      attackBonus: [
        attackBonus,
        [...attackBonus, { value: -4, source: 'MAP' }],
        [...attackBonus, { value: -8, source: 'MAP' }],
      ],
      damage: fist.definition.damage,
      damageBonus: this.attributes.Strength,
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

  private initializeHitpoints(ancestry: Ancestry) {
    this.hitpoints = [
      {
        value: this.ancestry.hitpoints,
        source: `Ancestry (${ancestry.name})`,
      },
    ]
    if (this.classEntity) {
      this.hitpoints.push({
        value: this.classEntity.hitpoints + this.attributes.Constitution,
        source: `Class Level 1 (${this.classEntity.name})`,
      })
    }
  }

  private initializeSpeed(ancestry: Ancestry) {
    this.speed = [
      { value: this.ancestry.speed, source: `Ancestry (${ancestry.name})` },
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
      if (
        sourced.feature.type === 'FEAT' ||
        sourced.feature.type === 'CLASS_FEAT_SELECTION'
      ) {
        feats.push(sourced.feature.value)
      } else if (
        sourced.feature.type === 'PROFICIENCY' ||
        sourced.feature.type === 'ACTION' ||
        sourced.feature.type === 'MISC'
      ) {
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
