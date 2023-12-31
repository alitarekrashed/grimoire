import { Attribute } from '@/models/db/ancestry'
import { Feature, SkillSelectionFeatureValue } from '@/models/db/feature'
import {
  Attributes,
  PlayerCharacter,
  SourcedFeature,
} from '@/models/player-character'
import {
  CalculatedProficiency,
  SkillAttributes,
  SkillType,
  generateUntrainedSkillMap,
} from '@/models/statistic'
import { ProficiencyFeatureValue } from '../../models/db/background'
import { ProficiencyRank } from '@/models/proficiency-rank'

export class SkillProficiencyManager {
  private skillProficiencies: Map<string, ProficiencyRank>
  private level: number
  private attributes: Attributes

  private constructor(
    skillProficiencies: Map<string, ProficiencyRank>,
    level: number,
    attributes: Attributes
  ) {
    this.skillProficiencies = skillProficiencies
    this.level = level
    this.attributes = attributes
  }

  public getSkills(): Map<string, CalculatedProficiency> {
    const result = new Map()
    this.skillProficiencies.forEach((rank, type) => {
      if (type) {
        // we fall back to Intelligence to handle Lore Skills properly
        result.set(type, {
          rank: rank,
          modifier:
            rank.getValue() +
            this.level +
            this.attributes[
              (SkillAttributes.get(type as SkillType) as Attribute) ??
                'Intelligence'
            ],
        })
      }
    })
    return result
  }

  static SkillProficiencyManagerBuilder = class {
    private skillProficiencies: Map<string, ProficiencyRank> =
      generateUntrainedSkillMap()
    private level: number
    private attributes: Attributes

    constructor(
      level: number,
      attributes: Attributes,
      proficiencies: ({ level?: number } & {
        value: ProficiencyFeatureValue
      })[]
    ) {
      this.level = level
      this.attributes = attributes
      proficiencies.sort((a, b) => {
        if (!a.level) return 1
        if (!b.level) return -1
        return a.level - b.level
      })
      proficiencies.forEach((value) => {
        let existingRank =
          this.skillProficiencies.get(value.value.value) ??
          ProficiencyRank.UNTRAINED
        this.skillProficiencies.set(
          value.value.value,
          ProficiencyRank.getGreaterThan(
            ProficiencyRank.get(value.value.rank),
            existingRank
          )
        )
      })
    }

    // if this operates on objects in place - could i get away with taking in the whole list?
    public validateAndApply(
      skillSelection: { level?: number } & {
        value: SkillSelectionFeatureValue
      }
    ): void {
      this.reconcileNumberOfSkillChoices(skillSelection)
      this.updateSkillProficienciesWithSelections(skillSelection)
    }

    public build(): SkillProficiencyManager {
      return new SkillProficiencyManager(
        this.skillProficiencies,
        this.level,
        this.attributes
      )
    }

    private reconcileNumberOfSkillChoices(skillSelection: {
      value: SkillSelectionFeatureValue
    }) {
      if (
        !skillSelection.value.configuration?.formula &&
        (!skillSelection.value.value || skillSelection.value.value.length !== 1)
      ) {
        skillSelection.value.value = [null!]
      } else if (skillSelection.value.configuration?.formula) {
        const expectedNumber: number =
          skillSelection.value.configuration.formula.reduce((prev, curr) => {
            if (typeof curr === 'number') {
              return (prev as number) + curr
            } else {
              return (prev as number) + this.attributes[curr]
            }
          }, 0) as number

        const currentNumber = skillSelection.value.value.length

        if (currentNumber < expectedNumber) {
          const toAdd = expectedNumber - currentNumber
          for (let i = 0; i < toAdd; i++) {
            skillSelection.value.value.push(null!)
          }
        } else if (currentNumber > expectedNumber) {
          let removalCounter = currentNumber - expectedNumber
          skillSelection.value.value.splice(
            skillSelection.value.value.length - removalCounter,
            removalCounter
          )
        }
      }
    }

    private updateSkillProficienciesWithSelections(skillSelection: {
      value: SkillSelectionFeatureValue
    }) {
      skillSelection.value.value.forEach((skill, index) => {
        if (this.skillProficiencies.has(skill) === false) {
          skillSelection.value.value[index] = null!
        } else {
          let existingRank = this.skillProficiencies.get(skill)
          if (
            ProficiencyRank.isLessThanOrEqualTo(
              existingRank!,
              ProficiencyRank.get(skillSelection.value.configuration.max_rank)
            )
          ) {
            this.skillProficiencies.set(skill, existingRank!.getNext())
          } else {
            skillSelection.value.value[index] = null!
          }
        }
      })
    }
  }
}

export function createManagerFromPlayerCharacter(
  playerCharacter: PlayerCharacter,
  level: number,
  exclusion?: Feature
): SkillProficiencyManager {
  return createManagerFromFeatures(
    level,
    playerCharacter.getAttributes(),
    playerCharacter.getResolvedFeatures(),
    exclusion
  )
}

export function createManagerFromFeatures(
  level: number,
  attributes: Attributes,
  sourced: SourcedFeature[],
  exclusion?: Feature
): SkillProficiencyManager {
  const builder = new SkillProficiencyManager.SkillProficiencyManagerBuilder(
    level,
    attributes,
    sourced
      .filter(
        (sourced) =>
          sourced.feature.type === 'PROFICIENCY' &&
          (sourced.feature.value.type === 'Skill' ||
            sourced.feature.value.type === 'Lore')
      )
      .filter((sourced) => {
        if (sourced.feature.level) {
          return sourced.feature.level <= level
        }
        return true
      })
      .map((sourced) => sourced.feature)
  )

  // order of operations here matters, basically this makes the subclass selection the 'default' base, which means that
  // it 'wins' during reconciliation
  sourced
    .filter((sourced) => sourced.feature !== exclusion)
    .filter(
      (sourced) =>
        !sourced.feature.level && sourced.feature.type === 'SKILL_SELECTION'
    )
    .forEach((sourced) => {
      builder.validateAndApply(sourced.feature)
    })

  sourced
    .filter((sourced) => sourced.feature.type === 'SKILL_SELECTION')
    .filter((sourced) => sourced.feature !== exclusion)
    .filter(
      (sourced) => sourced.feature.level && sourced.feature.level <= level
    )
    .sort((a, b) => a.feature.level! - b.feature.level!)
    .forEach((sourced) => {
      builder.validateAndApply(sourced.feature)
    })

  const manager = builder.build()
  return manager
}
