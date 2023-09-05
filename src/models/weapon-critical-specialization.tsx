import { WeaponGroup } from './weapon-models'

export class WeaponCriticalSpecialization {
  public static AXE: WeaponCriticalSpecialization =
    new WeaponCriticalSpecialization(
      'axe',
      "Choose one creature adjacent to the initial target and within reach. If its AC is lower than your attack roll result for the critical hit, you deal damage to that creature equal to the result of the weapon damage die you rolled (including extra dice for its potency rune, if any). This amount isn't doubled, and no bonuses or other additional dice apply to this damage."
    )
  public static BOMB: WeaponCriticalSpecialization =
    new WeaponCriticalSpecialization(
      'bomb',
      "Increase the radius of the bomb's @trait:splash@ damage (if any) to 10 feet."
    )
  public static BOW: WeaponCriticalSpecialization =
    new WeaponCriticalSpecialization(
      'bow',
      "If the target of the critical hit is adjacent to a surface, it gets stuck to that surface by the missile. The target is @condition:immobilized@ and must spend an Interact action to attempt a DC 10 Athletics check to pull the missile free; it can't move from its space until it succeeds. The creature doesn't become stuck if it is incorporeal, is liquid (like a water elemental or some oozes), or could otherwise escape without effort."
    )
  public static BRAWLING: WeaponCriticalSpecialization =
    new WeaponCriticalSpecialization(
      'brawling',
      'The target must succeed at a Fortitude save against your class DC or be @condition:slowed@ 1 until the end of your next turn.'
    )
  public static CLUB: WeaponCriticalSpecialization =
    new WeaponCriticalSpecialization(
      'club',
      'You knock the target away from you up to 10 feet (you choose the distance). This is forced movement.'
    )
  public static DART: WeaponCriticalSpecialization =
    new WeaponCriticalSpecialization(
      'dart',
      "The target takes 1d6 persistent bleed damage. You gain an item bonus to this bleed damage equal to the weapon's item bonus to attack rolls."
    )
  public static FIREARM: WeaponCriticalSpecialization =
    new WeaponCriticalSpecialization(
      'firearm',
      'The target must succeed at a Fortitude save against your class DC or be @condition:stunned@ 1.'
    )
  public static FLAIL: WeaponCriticalSpecialization =
    new WeaponCriticalSpecialization(
      'flail',
      'The target is knocked @condition:prone@.'
    )
  public static HAMMER: WeaponCriticalSpecialization =
    new WeaponCriticalSpecialization(
      'hammer',
      'The target is knocked @condition:prone@.'
    )
  public static KNIFE: WeaponCriticalSpecialization =
    new WeaponCriticalSpecialization(
      'knife',
      "The target takes 1d6 persistent bleed damage. You gain an item bonus to this bleed damage equal to the weapon's item bonus to attack rolls."
    )
  public static PICK: WeaponCriticalSpecialization =
    new WeaponCriticalSpecialization(
      'pick',
      'The weapon viciously pierces the target, who takes 2 additional damage per weapon damage die.'
    )
  public static POLEARM: WeaponCriticalSpecialization =
    new WeaponCriticalSpecialization(
      'polearm',
      'The target is moved 5 feet in a direction of your choice. This is forced movement.'
    )
  public static SHIELD: WeaponCriticalSpecialization =
    new WeaponCriticalSpecialization(
      'shield',
      'You knock the target back from you 5 feet. This is forced movement.'
    )
  public static SLING: WeaponCriticalSpecialization =
    new WeaponCriticalSpecialization(
      'sling',
      'The target must succeed at a Fortitude save against your class DC or be @condition:stunned@ 1.'
    )
  public static SPEAR: WeaponCriticalSpecialization =
    new WeaponCriticalSpecialization(
      'spear',
      'The weapon pierces the target, weakening its attacks. The target is @condition:clumsy@ 1 until the start of your next turn.'
    )
  public static SWORD: WeaponCriticalSpecialization =
    new WeaponCriticalSpecialization(
      'sword',
      'The target is made off-balance by your attack, becoming @condition:flat-footed@ until the start of your next turn.'
    )

  public static getCriticalSpecialiation(
    weaponGroup: WeaponGroup
  ): WeaponCriticalSpecialization {
    switch (weaponGroup) {
      case 'axe':
        return this.AXE
      case 'bomb':
        return this.BOMB
      case 'bow':
        return this.BOW
      case 'brawling':
        return this.BRAWLING
      case 'club':
        return this.CLUB
      case 'dart':
        return this.DART
      case 'firearm':
        return this.FIREARM
      case 'flail':
        return this.FLAIL
      case 'hammer':
        return this.HAMMER
      case 'knife':
        return this.KNIFE
      case 'pick':
        return this.PICK
      case 'polearm':
        this.POLEARM
      case 'shield':
        this.SHIELD
      case 'sling':
        return this.SLING
      case 'spear':
        return this.SPEAR
      case 'sword':
        return this.SWORD
    }
  }

  private constructor(
    private weaponGroup: WeaponGroup,
    private specialization: string
  ) {}

  public getSpecialization(): string {
    return this.specialization
  }
}
