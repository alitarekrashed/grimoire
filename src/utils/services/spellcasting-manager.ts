import { Attribute } from '@/models/db/ancestry'
import { ProficiencyRank, RankModifierMap } from '@/models/db/background'
import { SpellcastingDefinition } from '@/models/db/class-entity'
import { Tradition } from '@/models/db/spell'
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
  private typeToTradition: Map<
    string,
    { tradition: Tradition; attribute: Attribute }
  > = new Map()

  constructor(
    private attributes: Attributes,
    private level: number,
    private spellcastingDefinitions: SpellcastingDefinition[]
  ) {
    spellcastingDefinitions.forEach((value) => {
      let configuration: SpellcastingConfiguration = {
        attribute: value.attribute.value,
        attack: value.progression.findLast(
          (progression) =>
            progression.level <= level && progression.type === 'attack'
        )!.rank,
        savingThrow: value.progression.findLast(
          (progression) =>
            progression.level <= level && progression.type === 'saving_throw'
        )!.rank,
      }

      this.typeToTradition.set(value.type, {
        tradition: value.tradition.value,
        attribute: value.attribute.value,
      })
      this.spellcasting.set(
        value.tradition.value.toLowerCase(),
        this.buildSpellcasting(configuration)
      )
    })

    const innateCasting: SpellcastingConfiguration = {
      attribute: 'Charisma',
      attack: 'trained',
      savingThrow: 'trained',
    }

    this.spellcasting.set('innate', this.buildSpellcasting(innateCasting))
    this.typeToTradition.set('innate', {
      tradition: null!,
      attribute: 'Charisma',
    })
  }

  public getSpellcasting(type: string): SpellcastingProficiencies {
    if (this.spellcasting.has(type)) {
      return this.spellcasting.get(type)!
    }
    return this.buildSpellcasting(fallback)
  }

  public getTypeDefinition(type: string) {
    return this.typeToTradition.get(type)
  }

  public getTypes() {
    return Object.keys(this.typeToTradition)
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
