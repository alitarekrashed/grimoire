import { Attribute } from '@/models/db/ancestry'
import { SpellcastingDefinition } from '@/models/db/class-entity'
import { Tradition } from '@/models/db/spell'
import { Attributes } from '@/models/player-character'
import { ProficiencyRank } from '@/models/proficiency-rank'
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
  attack: ProficiencyRank.UNTRAINED,
  savingThrow: ProficiencyRank.UNTRAINED,
}

export class SpellcastingManager {
  private spellcasting: Map<string, SpellcastingProficiencies> = new Map()
  private allTypes: string[] = []
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
      if (value) {
        let configuration: SpellcastingConfiguration = {
          attribute: value.attribute.value,
          attack: ProficiencyRank.get(
            value.progression.findLast(
              (progression) =>
                progression.level <= level && progression.type === 'attack'
            )!.rank
          ),
          savingThrow: ProficiencyRank.get(
            value?.progression.findLast(
              (progression) =>
                progression.level <= level &&
                progression.type === 'saving_throw'
            )!.rank
          ),
        }

        if (value.tradition.value) {
          this.typeToTradition.set(value.type, {
            tradition: value.tradition.value,
            attribute: value.attribute.value,
          })
          this.spellcasting.set(
            value.tradition.value.toLowerCase(),
            this.buildSpellcasting(configuration)
          )
          this.allTypes.push(value.type)
        }
      }
    })

    const innateCasting: SpellcastingConfiguration = {
      attribute: 'Charisma',
      attack: ProficiencyRank.TRAINED,
      savingThrow: ProficiencyRank.TRAINED,
    }

    this.spellcasting.set('innate', this.buildSpellcasting(innateCasting))
    this.typeToTradition.set('innate', {
      tradition: null!,
      attribute: 'Charisma',
    })
    this.allTypes.push('innate')
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
    return this.allTypes
  }

  private buildSpellcasting(
    configuration: SpellcastingConfiguration
  ): SpellcastingProficiencies {
    return {
      attack: {
        rank: configuration.attack,
        modifier:
          configuration.attack.getValue() +
          this.attributes[configuration.attribute] +
          (configuration.attack.getName() !== 'untrained' ? this.level : 0),
      },
      savingThrow: {
        rank: configuration.savingThrow,
        modifier:
          configuration.savingThrow.getValue() +
          this.attributes[configuration.attribute] +
          (configuration.savingThrow.getName() !== 'untrained'
            ? this.level
            : 0),
      },
    }
  }
}
