import { Attribute } from '@/models/db/ancestry'
import { ProficiencyRank, RankModifierMap } from '@/models/db/background'
import { Attributes } from '@/models/player-character'
import { CalculatedProficiency } from '@/models/statistic'

export interface SpellcastingProficiencies {
  attack: CalculatedProficiency
  savingThrow: CalculatedProficiency
}

export interface SpellcastingConfiguration {
  attribute: Attribute
  attack: ProficiencyRank
  savingThrow: ProficiencyRank
}

// fallback uses Charisma + untrained
const fallback: SpellcastingConfiguration = {
  attribute: 'Charisma',
  attack: 'untrained',
  savingThrow: 'untrained',
}

export class SpellcastingManager {
  private spellcasting: Map<string, SpellcastingProficiencies> = new Map()

  constructor(
    private attributes: Attributes,
    private level: number
  ) {
    const innateCasting: SpellcastingConfiguration = {
      attribute: 'Charisma',
      attack: 'trained',
      savingThrow: 'trained',
    }
    this.spellcasting.set('innate', this.buildSpellcasting(innateCasting))
  }

  public getSpellcasting(type: string): SpellcastingProficiencies {
    if (this.spellcasting.has(type)) {
      return this.spellcasting.get(type)!
    }
    return this.buildSpellcasting(fallback)
  }

  private buildSpellcasting(
    configuration: SpellcastingConfiguration
  ): SpellcastingProficiencies {
    return {
      attack: {
        rank: configuration.attack,
        modifier:
          RankModifierMap[configuration.attack] +
          this.attributes[configuration.attribute] +
          (configuration.attack !== 'untrained' ? this.level : 0),
      },
      savingThrow: {
        rank: configuration.savingThrow,
        modifier:
          RankModifierMap[configuration.savingThrow] +
          this.attributes[configuration.attribute] +
          (configuration.savingThrow !== 'untrained' ? this.level : 0),
      },
    }
  }
}
