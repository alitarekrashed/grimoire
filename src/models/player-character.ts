import { ModifierValue } from '@/components/calculated-display/calculated-display'
import { FeatManager } from '@/utils/services/feat-manager'
import {
  FIST_WEAPON,
  GearProficiencyManager,
  getGreaterThan,
} from '@/utils/services/gear-proficiency-manager'
import {
  SkillProficiencyManager,
  createManagerFromFeatures,
} from '@/utils/services/skill-proficiency-manager'
import { cloneDeep } from 'lodash'
import { Ancestry, Attribute } from './db/ancestry'
import {
  Background,
  ProficiencyFeatureValue,
  ProficiencyRank,
  ProficiencyType,
  RankModifierMap,
} from './db/background'
import {
  ArmorDefinition,
  CharacterEntity,
  CharacterEquipment,
  WithNameAndId,
} from './db/character-entity'
import { ClassEntity } from './db/class-entity'
import { Armor } from './db/equipment'
import {
  ConditionalFeatureValue,
  Feature,
  FeatureType,
  ModifierFeatureValue,
  OverrideFeatureValue,
  ResistanceFeatureValue,
  SpecializationFeatureValue,
  featureMatcher,
} from './db/feature'
import { Heritage } from './db/heritage'
import {
  CalculatedProficiency,
  SavingThrowAttributes,
  SavingThrowType,
} from './statistic'
import { SpellcastingManager } from '@/utils/services/spellcasting-manager'
import { WeaponDefinition } from './weapon-models'

export interface CharacterAttack {
  attackBonus: ModifierValue[][]
  damageBonus: number
  weapon: CharacterWeapon
  additionalContent: string[]
}

export interface CharacterArmor {
  name: string
  item_name: string
  traits: string[]
  definition: ArmorDefinition
}

export interface CharacterWeapon {
  name: string
  item_name?: string
  traits: string[]
  definition: WeaponDefinition
}

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

export class PlayerCharacter {
  private level!: number
  private speed!: ModifierValue[]
  private size!: string
  private attributes!: Attributes
  private traits: string[] = []
  private hitpoints!: ModifierValue[]
  private features: SourcedFeature[] = []
  private gearProficienyManager!: GearProficiencyManager
  private skillProficiencyManager!: SkillProficiencyManager
  private spellcastingManager!: SpellcastingManager

  private constructor(
    private character: CharacterEntity,
    private ancestry: Ancestry,
    private allFeatures: SourcedFeature[],
    private featManager: FeatManager,
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

    this.allFeatures.forEach((feature) => this.addFeatureToCharacter(feature))
    this.gearProficienyManager = new GearProficiencyManager(
      this.features
        .filter((feature) => feature.feature.type === 'PROFICIENCY')
        .filter((feature) => feature.feature.value.type === 'Weapon')
        .map((val) => val.feature.value),
      this.features
        .filter((feature) => feature.feature.type === 'PROFICIENCY')
        .filter((feature) => feature.feature.value.type === 'Defense')
        .map((val) => val.feature.value),
      this.features
        .filter((feature) => feature.feature.type === 'PROFICIENCY_DOWNGRADE')
        .map((feature) => feature.feature.value.trait),
      this.features
        .filter(
          (feature) =>
            feature.feature.type === 'SPECIALIZATION' &&
            feature.feature.value.type === 'Weapon'
        )
        .map((feature) => feature.feature.value as SpecializationFeatureValue)
    )

    this.skillProficiencyManager = createManagerFromFeatures(
      this.level,
      this.attributes,
      this.features
    )

    this.spellcastingManager = new SpellcastingManager(
      this.attributes,
      this.level,
      this.character.spellcasting.map((val) => val.value)
    )
  }

  public getCharacter(): CharacterEntity {
    return this.character
  }

  public getSubclassIfAvailable(): Feature | undefined {
    return this.character.features
      .map((val) => val.feature)
      .find((val) => val.type === 'SUBCLASS')
  }

  public updateName(name: string): PlayerCharacter {
    let updated = cloneDeep(this.character)
    updated.name = name
    this.character = updated
    return this
  }

  public getFeatNames(): string[] {
    return this.featManager.getFeatNames()
  }

  public getResolvedFeats(): SourcedFeature[] {
    return this.featManager.getResolvedFeats()
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

  public getResolvedFeatures(): SourcedFeature[] {
    return this.features
  }

  public getLevelFeatures(): SourcedFeature[] {
    return this.character.features
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
    return this.features.filter((feature) => feature.feature.type === 'ACTION')
  }

  public getSpells(): SourcedFeature[] {
    return this.features.filter((feature) => feature.feature.type === 'SPELL')
  }

  public getSpellcastingManager(): SpellcastingManager {
    return this.spellcastingManager
  }

  public getProficiencies(exclude?: Feature[]): {
    Perception: Map<string, ProficiencyRank>
    Lore: Map<string, ProficiencyRank>
    SavingThrow: Map<SavingThrowType, ProficiencyRank>
    DifficultyClass: Map<string, ProficiencyRank>
  } {
    const proficiencyMap: {
      Perception: Map<string, ProficiencyRank>
      Lore: Map<string, ProficiencyRank>
      SavingThrow: Map<string, ProficiencyRank>
      DifficultyClass: Map<string, ProficiencyRank>
    } = {
      Perception: new Map<string, ProficiencyRank>(),
      Lore: new Map<string, ProficiencyRank>(),
      SavingThrow: new Map<SavingThrowType, ProficiencyRank>(),
      DifficultyClass: new Map<string, ProficiencyRank>(),
    }

    const excluded: string[] = []
    exclude?.map((feature) => {
      excluded.push(...feature.value.value)
    })

    this.features
      .filter((feature) => {
        return feature.feature.type === 'PROFICIENCY'
      })
      .filter((feature) => {
        if (excluded) {
          return excluded.includes(feature.feature.value.value) == false
        }
        return true
      })
      .filter(
        (feature) =>
          feature.feature.value.type !== 'Weapon' &&
          feature.feature.value.type !== 'Defense' &&
          feature.feature.value.type !== 'Skill'
      )
      .forEach((sourced: SourcedFeature) => {
        const proficency = sourced.feature.value as ProficiencyFeatureValue
        const type = proficency.type as Exclude<
          ProficiencyType,
          'Weapon' | 'Defense' | 'Skill'
        >
        if (
          proficency.value &&
          proficiencyMap[type].has(proficency.value) == false
        ) {
          proficiencyMap[type].set(proficency.value, proficency.rank)
        } else {
          let existingRank = proficiencyMap[type].get(proficency.value)
          proficiencyMap[type].set(
            proficency.value,
            getGreaterThan(proficency.rank, existingRank ?? 'untrained')
          )
        }
      })
    return proficiencyMap as {
      Perception: Map<string, ProficiencyRank>
      Lore: Map<string, ProficiencyRank>
      SavingThrow: Map<SavingThrowType, ProficiencyRank>
      DifficultyClass: Map<string, ProficiencyRank>
    }
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

  public getLores(): Map<string, CalculatedProficiency> {
    const skills = this.getProficiencies().Lore
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

  public getGearProficiencyManager(): GearProficiencyManager {
    return this.gearProficienyManager
  }

  public getSkillProfciencyManager(): SkillProficiencyManager {
    return this.skillProficiencyManager
  }

  // TODO this needs some love/cleanup
  public getArmorClass(): { name: string; value: ModifierValue[] } {
    const result: ModifierValue[] = []
    result.push({
      value: 10,
      source: 'Base',
    })

    const equipped: (WithNameAndId & { item: Armor }) | undefined =
      this.character.equipment
        .filter((val) => val.item.category === 'Armor')
        .find((val) => val.id === this.character.equipped_armor) as
        | (WithNameAndId & { item: Armor })
        | undefined

    const armor: CharacterArmor =
      GearProficiencyManager.resolveEquippedArmor(equipped)

    if (
      armor.definition.dex_cap === undefined ||
      this.attributes.Dexterity <= armor.definition.dex_cap
    ) {
      result.push({
        value: this.attributes.Dexterity,
        source: 'Dexterity',
      })
    } else {
      result.push({
        value: armor.definition.dex_cap,
        source: `Dexterity (capped from ${armor.name})`,
      })
    }

    const rank = this.gearProficienyManager.getArmorProficiency(armor)

    if (rank && rank !== 'untrained') {
      result.push({
        value: RankModifierMap[rank] + this.level,
        // TODO use the actual set one, not always the category
        source: `Proficiency (${armor.definition.category})`,
      })
    }

    if (armor.definition.ac_bonus) {
      result.push({
        value: armor.definition.ac_bonus,
        source: `AC Bonus (${armor.name})`,
      })
    }
    return {
      name: armor.name,
      value: result,
    }
  }

  public getAttacks(nonLethal: boolean): CharacterAttack[] {
    const weapons: CharacterWeapon[] = [cloneDeep(FIST_WEAPON)]

    weapons.push(
      ...this.character.equipment
        .filter((value) => value.item.category === 'Weapon')
        .map((value: CharacterEquipment) => {
          return GearProficiencyManager.createCharacterWeapon(value)
        })
    )

    weapons.push(
      ...this.features
        .filter((value) => value.feature.type === 'ATTACK')
        .map((value) => value.feature.value)
    )

    const overrideAttacks = this.features
      .filter(
        (val) =>
          val.feature.type === 'OVERRIDE' && val.feature.value.type === 'Attack'
      )
      .map((val) => val.feature.value as OverrideFeatureValue)

    weapons
      .filter(
        (weapon) =>
          overrideAttacks.findIndex(
            (override) => override.name === weapon.name
          ) > -1
      )
      .forEach((weapon) => {
        const override = overrideAttacks.find(
          (override) => override.name === weapon.name
        )!
        // probably need a better solution
        weapon.definition.damage[0].dice = override.die_value
      })

    return weapons.map((weapon) => this.buildAttack(weapon, nonLethal))
  }

  // TODO this could use some love
  private buildAttack(
    weapon: CharacterWeapon,
    nonLethal: boolean
  ): CharacterAttack {
    const attackBonus: ModifierValue[] = []

    if (weapon.definition.type === 'melee') {
      if (
        weapon.traits.includes('finesse') &&
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
    } else {
      attackBonus.push({
        value: this.attributes.Dexterity,
        source: 'Dexterity',
      })
    }

    const allowUnarmedLethality =
      this.features.findIndex(
        (sourced) => sourced.feature.value?.name === 'Powerful Fist'
      ) > -1 && weapon.traits.includes('unarmed')

    if (weapon.traits.includes('nonlethal')) {
      if (!nonLethal && !allowUnarmedLethality) {
        attackBonus.push({
          value: -2,
          type: 'circumstance',
          source: 'lethally attacking with a non-lethal weapon',
        })
      }
    } else {
      if (nonLethal) {
        attackBonus.push({
          value: -2,
          type: 'circumstance',
          source: 'non-lethally attacking with a lethal weapon',
        })
      }
    }

    const rank: ProficiencyRank =
      this.gearProficienyManager.getProficiency(weapon)
    if (rank !== 'untrained') {
      attackBonus.push({
        value: RankModifierMap[rank] + this.level,
        // TODO use the actual set one, not always the category
        source: `Proficiency (${weapon.definition.category})`,
      })
    }

    const damageModifiers = this.features
      .filter(
        (val) =>
          val.feature.type === 'MODIFIER' &&
          val.feature.value.type === 'AttackDamage'
      )
      .map((val) => val.feature.value as ModifierFeatureValue)
      .filter((val) => {
        if (val.context.category && val.context.group) {
          return (
            val.context.category === weapon.definition.category &&
            val.context.group === weapon.definition.group
          )
        }
        return (
          val.context.category === weapon.definition.category ||
          val.context.group === weapon.definition.group
        )
      })
      .map((val) => val.modifier.value)

    // TODO ALI -- this should be a list of modifiers so it's clear where bonuses and stuff come from
    const additionalBonus = damageModifiers.reduce((prev, sum) => prev + sum, 0)

    const extraContent: string[] = []
    weapon.definition.additional &&
      weapon.definition.additional.forEach((val) =>
        extraContent.push(val.value)
      )
    const specialization = this.gearProficienyManager.getSpecialization(weapon)
    if (specialization) {
      extraContent.push(specialization)
    }

    const multipleAttackPenalty = weapon.traits.includes('agile') ? -4 : -5
    return {
      attackBonus: [
        attackBonus,
        [
          ...attackBonus,
          { value: multipleAttackPenalty, source: 'Multiple attack penalty' },
        ],
        [
          ...attackBonus,
          {
            value: multipleAttackPenalty * 2,
            source: 'Multiple attack penalty',
          },
        ],
      ],
      damageBonus:
        (weapon.definition.type === 'melee' ? this.attributes.Strength : 0) +
        additionalBonus,
      weapon: weapon,
      additionalContent: extraContent,
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

    this.character.attributes.levels
      .filter((val) => val.level <= this.character.level)
      .forEach((levelled) =>
        levelled.attributes
          .filter((val) => val)
          .forEach((val) => {
            if (attributes[val] >= 4) {
              attributes[val] += 0.5
            } else {
              attributes[val] += 1
            }
          })
      )

    Object.keys(this.attributes).forEach(
      (attribute) => (attributes[attribute] = Math.floor(attributes[attribute]))
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
      for (let i = 1; i <= this.level; i++) {
        this.hitpoints.push({
          value: this.classEntity.hitpoints + this.attributes.Constitution,
          source: `Class Level ${i} (${this.classEntity.name})`,
        })
      }
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

  static async build(character: CharacterEntity): Promise<PlayerCharacter> {
    const [ancestry, heritage, background, classEntity] = await Promise.all([
      PlayerCharacter.getAncestry(character.ancestry_id),
      PlayerCharacter.getHeritage(character.heritage_id),
      PlayerCharacter.getBackground(character.background_id),
      PlayerCharacter.getClass(character.class_id),
    ])

    let feats: Feature[] = []
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

    character.features
      .filter((value: SourcedFeature) => {
        if (!value.feature.level) {
          return true
        }
        return value.feature.level <= character.level
      })
      .forEach((sourced: SourcedFeature) => {
        if (
          sourced.feature.type === 'FEAT' ||
          sourced.feature.type === 'ANCESTRY_FEAT_SELECTION' ||
          sourced.feature.type === 'CLASS_FEAT_SELECTION' ||
          sourced.feature.type === 'SKILL_FEAT_SELECTION' ||
          sourced.feature.type === 'GENERAL_FEAT_SELECTION'
        ) {
          feats.push(sourced.feature)
        } else if (
          sourced.feature.type === 'PROFICIENCY' ||
          sourced.feature.type === 'ACTION' ||
          sourced.feature.type === 'MISC' ||
          sourced.feature.type === 'MODIFIER' ||
          sourced.feature.type === 'OVERRIDE' ||
          sourced.feature.type === 'SKILL_SELECTION'
        ) {
          allFeatures.push({
            source: classEntity.name,
            feature: sourced.feature,
          })
        } else if (
          sourced.feature.type === 'SUBCLASS_FEATURE' &&
          sourced.feature.value
        ) {
          // TODO ALI make this the subclass name for source?
          allFeatures.push({
            source: classEntity.name,
            feature: sourced.feature.value,
          })
        }
      })

    const featManager: FeatManager = await FeatManager.build(feats)

    allFeatures.push(...featManager.getResolvedFeats())

    const pc = new PlayerCharacter(
      character,
      ancestry,
      allFeatures,
      featManager,
      heritage,
      background,
      classEntity
    )
    return pc
  }
}
