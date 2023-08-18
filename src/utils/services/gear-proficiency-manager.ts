import {
  ArmorProficiencyValue,
  ProficiencyRank,
  ProficiencyType,
  WeaponProficiencyValue,
} from '@/models/db/background'
import { CharacterEquipment, WithNameAndId } from '@/models/db/character-entity'
import { Armor } from '@/models/db/equipment'
import { CharacterArmor, CharacterWeapon } from '@/models/player-character'

export const FIST_WEAPON: CharacterWeapon = {
  name: 'fist',
  item_name: 'fist',
  traits: ['agile', 'finesse', 'nonlethal', 'unarmed'],
  definition: {
    category: 'unarmed',
    group: 'brawling',
    type: 'melee',
    damage: {
      type: 'bludgeoning',
      dice: '1d4',
    },
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
  constructor(
    private attacks: {
      type: ProficiencyType
      value: WeaponProficiencyValue
      rank: ProficiencyRank
    }[],
    private defenses: {
      type: ProficiencyType
      value: ArmorProficiencyValue
      rank: ProficiencyRank
    }[]
  ) {}

  public getArmorProficiencies(): {
    value: ArmorProficiencyValue
    rank: ProficiencyRank
  }[] {
    const grouped: Map<ArmorProficiencyValue, ProficiencyRank[]> =
      this.defenses.reduce(
        (entryMap, e) =>
          entryMap.set(e.value, [...(entryMap.get(e.value) || []), e.rank]),
        new Map()
      )

    const result: {
      value: ArmorProficiencyValue
      rank: ProficiencyRank
    }[] = []
    Array.from(grouped.entries()).forEach(
      (value: [ArmorProficiencyValue, ProficiencyRank[]]) => {
        let resultRank: ProficiencyRank = 'untrained'

        value[1].forEach((rank) => {
          resultRank = getGreaterThan(resultRank, rank)
        })
        result.push({
          value: value[0],
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
    const grouped: Map<WeaponProficiencyValue, ProficiencyRank[]> =
      this.attacks.reduce(
        (entryMap, e) =>
          entryMap.set(e.value, [...(entryMap.get(e.value) || []), e.rank]),
        new Map()
      )

    const result: {
      value: WeaponProficiencyValue
      rank: ProficiencyRank
    }[] = []
    Array.from(grouped.entries()).forEach(
      (value: [WeaponProficiencyValue, ProficiencyRank[]]) => {
        let resultRank: ProficiencyRank = 'untrained'

        value[1].forEach((rank) => {
          resultRank = getGreaterThan(resultRank, rank)
        })
        result.push({
          value: value[0],
          rank: resultRank,
        })
      }
    )
    return result
  }

  public getProficiency(weapon: CharacterWeapon): ProficiencyRank {
    const category = weapon.definition.category
    const group = weapon.definition.group

    let minimumRank: ProficiencyRank = 'untrained'

    this.attacks
      .filter(
        (proficiency) =>
          proficiency.value.category === category ||
          proficiency.value.group === group
      )
      .forEach(
        (proficiency) =>
          (minimumRank = getGreaterThan(minimumRank, proficiency.rank))
      )

    return minimumRank
  }

  public getArmorProficiency(armor: CharacterArmor): ProficiencyRank {
    const category = armor.definition.category
    const group = armor.definition.group

    let minimumRank: ProficiencyRank = 'untrained'

    this.defenses
      .filter(
        (proficiency) =>
          proficiency.value.category === category ||
          proficiency.value.group === group
      )
      .forEach(
        (proficiency) =>
          (minimumRank = getGreaterThan(minimumRank, proficiency.rank))
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

function getGreaterThan(
  thisRank: ProficiencyRank,
  other: ProficiencyRank
): ProficiencyRank {
  if (other === 'untrained') {
    return thisRank
  } else if (other === 'trained') {
    return thisRank === 'trained' || thisRank === 'expert' ? thisRank : other
  }
  return other
}
