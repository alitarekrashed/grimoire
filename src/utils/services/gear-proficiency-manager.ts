import {
  ProficiencyRank,
  ProficiencyType,
  WeaponProficiencyValue,
} from '@/models/db/background'
import { CharacterWeapon } from '@/models/player-character'

export class GearProficiencyManager {
  constructor(
    private attacks: {
      type: ProficiencyType
      value: WeaponProficiencyValue
      rank: ProficiencyRank
    }[]
  ) {}

  public getProficiency(weapon: CharacterWeapon): ProficiencyRank {
    const category = weapon.definition.category
    const group = weapon.definition.group

    let minimumRank: ProficiencyRank = 'untrained'

    const relevantProficiencies = this.attacks
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
