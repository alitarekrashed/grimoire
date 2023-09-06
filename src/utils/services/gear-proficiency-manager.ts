import {
  ArmorProficiencyValue,
  ProficiencyType,
  WeaponProficiencyValue,
} from '@/models/db/background'
import { CharacterEquipment, WithNameAndId } from '@/models/db/character-entity'
import { Armor, Weapon } from '@/models/db/equipment'
import { SpecializationFeatureValue } from '@/models/db/feature'
import {
  CharacterArmor,
  CharacterWeapon,
  SourcedFeature,
} from '@/models/player-character'
import { WeaponCriticalSpecialization } from '@/models/weapon-critical-specialization'
import { WeaponCategory } from '@/models/weapon-models'
import { inter } from '../fonts'
import { ProficiencyRank } from '@/models/proficiency-rank'
import { caseInsensitiveMatch } from '../helpers'
import { cloneDeep } from 'lodash'

export const FIST_WEAPON: CharacterWeapon = {
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
    additional: [],
  },
}

export const UNARMORED_DEFENSE: CharacterArmor = {
  name: 'unarmored',
  item_name: 'unarmored',
  traits: [],
  definition: {
    category: 'unarmored',
    group: 'cloth',
    ac_bonus: 0,
  },
}

export class GearProficiencyManager {
  private attacks: {
    type: ProficiencyType
    value: WeaponProficiencyValue
    rank: string
  }[]
  private defenses: {
    type: ProficiencyType
    value: ArmorProficiencyValue
    rank: string
  }[]
  private downgrade: { trait?: string; group?: string }[]
  private specializations: SpecializationFeatureValue[]
  private expertises: SpecializationFeatureValue[]

  constructor(features: SourcedFeature[]) {
    this.attacks = features
      .filter((feature) => feature.feature.type === 'PROFICIENCY')
      .filter((feature) => feature.feature.value.type === 'Weapon')
      .map((val) => val.feature.value)

    this.defenses = features
      .filter((feature) => feature.feature.type === 'PROFICIENCY')
      .filter((feature) => feature.feature.value.type === 'Defense')
      .map((val) => val.feature.value)

    this.downgrade = features
      .filter((feature) => feature.feature.type === 'PROFICIENCY_DOWNGRADE')
      .map((feature) => feature.feature.value)

    this.specializations = features
      .filter(
        (feature) =>
          feature.feature.type === 'SPECIALIZATION' &&
          feature.feature.value.type === 'Weapon'
      )
      .map((feature) => feature.feature.value as SpecializationFeatureValue)

    this.expertises = features
      .filter(
        (feature) =>
          feature.feature.type === 'EXPERTISE' &&
          feature.feature.value.type === 'Weapon'
      )
      .map((feature) => feature.feature.value as SpecializationFeatureValue)
  }

  public getArmorProficiencies(): {
    value: ArmorProficiencyValue
    rank: ProficiencyRank
  }[] {
    const grouped: Map<string, ProficiencyRank[]> = this.defenses.reduce(
      (entryMap, e) =>
        entryMap.set(JSON.stringify(e.value), [
          ...(entryMap.get(e.value) || []),
          ProficiencyRank.get(e.rank),
        ]),
      new Map()
    )

    const result: {
      value: ArmorProficiencyValue
      rank: ProficiencyRank
    }[] = []
    Array.from(grouped.entries()).forEach(
      (value: [string, ProficiencyRank[]]) => {
        let resultRank: ProficiencyRank = ProficiencyRank.UNTRAINED

        value[1].forEach((rank) => {
          resultRank = ProficiencyRank.getGreaterThan(resultRank, rank)
        })

        result.push({
          value: JSON.parse(value[0]),
          rank: resultRank,
        })
      }
    )
    return result
  }

  public getWeaponProficiencies(): {
    value: WeaponProficiencyValue
    rank: ProficiencyRank
  }[] {
    const grouped: Map<string, ProficiencyRank[]> = this.attacks.reduce(
      (entryMap, e) =>
        entryMap.set(JSON.stringify(e.value), [
          ...(entryMap.get(e.value) || []),
          ProficiencyRank.get(e.rank),
        ]),
      new Map()
    )

    const result: {
      value: WeaponProficiencyValue
      rank: ProficiencyRank
    }[] = []
    Array.from(grouped.entries()).forEach(
      (value: [string, ProficiencyRank[]]) => {
        let resultRank: ProficiencyRank = ProficiencyRank.UNTRAINED

        value[1].forEach((rank) => {
          resultRank = ProficiencyRank.getGreaterThan(resultRank, rank)
        })

        result.push({
          value: JSON.parse(value[0]),
          rank: resultRank,
        })
      }
    )
    return result
  }

  public getProficiency(weapon: CharacterWeapon): ProficiencyRank {
    let category = weapon.definition.category

    if (
      this.downgrade.some(
        (downgrade: { trait?: string; group?: string }) =>
          (downgrade.trait && weapon.traits.includes(downgrade.trait)) ||
          (downgrade.group &&
            caseInsensitiveMatch(weapon.definition.group, downgrade.group))
      )
    ) {
      category = downgradeCategory(category)
    }
    const group = weapon.definition.group

    let minimumRank: ProficiencyRank = ProficiencyRank.UNTRAINED

    const matchedTraits = this.expertises
      .filter((epertise) => epertise.value.trait)
      .map((epertise) => epertise.value.trait)
    const matchedExpertises = this.expertises.filter((expertise) => {
      if (weapon.item_name && expertise.value.weapon === weapon.item_name) {
        return true
      }
      if (weapon.traits.some((val) => matchedTraits.includes(val))) {
        return true
      }
      return false
    })

    let attacks = this.attacks
    if (matchedExpertises.length === 0) {
      attacks = this.attacks.filter((proficiency) => {
        if (proficiency.value.weapon === weapon.item_name) {
          return true
        }
        if (proficiency.value.category && proficiency.value.group) {
          return (
            proficiency.value.category === category &&
            proficiency.value.group === group
          )
        }
        return (
          proficiency.value.category === category ||
          proficiency.value.group === group
        )
      })
    }

    attacks.forEach(
      (proficiency) =>
        (minimumRank = ProficiencyRank.getGreaterThan(
          minimumRank,
          ProficiencyRank.get(proficiency.rank)
        ))
    )

    return minimumRank
  }

  public getSpecialization(weapon: CharacterWeapon): string | undefined {
    const matchedTraits = this.specializations
      .filter((specialization) => specialization.value.trait)
      .map((specialization) => specialization.value.trait)
    const matchedSpecialization = this.specializations.filter(
      (specialization) => {
        if (
          weapon.item_name &&
          specialization.value.weapon === weapon.item_name
        ) {
          return true
        }

        if (
          weapon.definition.group &&
          weapon.definition.group === specialization.value.group
        ) {
          return true
        }

        if (weapon.traits.some((val) => matchedTraits.includes(val))) {
          return true
        }
        return false
      }
    )

    if (matchedSpecialization.length > 0) {
      return WeaponCriticalSpecialization.getCriticalSpecialiation(
        weapon.definition.group
      ).getSpecialization()
    }

    return undefined
  }

  public getArmorProficiency(armor: CharacterArmor): ProficiencyRank {
    const category = armor.definition.category
    const group = armor.definition.group

    let minimumRank: ProficiencyRank = ProficiencyRank.UNTRAINED

    this.defenses
      .filter(
        (proficiency) =>
          proficiency.value.category === category ||
          proficiency.value.group === group
      )
      .forEach(
        (proficiency) =>
          (minimumRank = ProficiencyRank.getGreaterThan(
            minimumRank,
            ProficiencyRank.get(proficiency.rank)
          ))
      )

    return minimumRank
  }

  public static createCharacterWeapon(
    value: CharacterEquipment
  ): CharacterWeapon {
    const weapon = value.item as Weapon
    return {
      name: value.name,
      item_name: weapon.name,
      traits: weapon.traits!,
      definition: weapon.properties,
    }
  }

  public static resolveEquippedArmor(
    equipped?: WithNameAndId & { item: Armor }
  ): CharacterArmor {
    return equipped
      ? {
          name: equipped.name,
          item_name: equipped.item.name,
          traits: equipped.item.traits!,
          definition: equipped.item.properties,
        }
      : UNARMORED_DEFENSE
  }
}

export function downgradeCategory(category: WeaponCategory) {
  switch (category) {
    case 'advanced':
      return 'martial'
    case 'martial':
      return 'simple'
    default:
      return category
  }
}
