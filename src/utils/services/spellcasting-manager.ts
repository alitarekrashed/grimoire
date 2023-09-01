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

const fallback: SpellcastingConfiguration = {
  attribute: 'Charisma',
  attack: 'untrained',
  savingThrow: 'untrained',
}

export class SpellcastingManager {
  private spellcasting: Map<string, SpellcastingProficiencies> = new Map()

  constructor(private attributes: Attributes) {}

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
          this.attributes[configuration.attribute],
      },
      savingThrow: {
        rank: configuration.savingThrow,
        modifier:
          RankModifierMap[configuration.savingThrow] +
          this.attributes[configuration.attribute],
      },
    }
  }
}
