import { Feature, SkillSelectionFeatureValue } from '@/models/db/feature'
import {
  CalculatedProficiency,
  SkillAttributes,
  SkillType,
  generateUntrainedSkillMap,
} from '@/models/statistic'
import {
  ProficiencyFeatureValue,
  ProficiencyRank,
  RankModifierMap,
} from '../../models/db/background'
import {
  getGreaterThan,
  isGreaterThanOrEqualTo,
} from './gear-proficiency-manager'
import { Attribute } from '@/models/db/ancestry'
import { Attributes, PlayerCharacter } from '@/models/player-character'

export class SkillProficiencyManager {
  private skillProficiencies: Map<SkillType, ProficiencyRank>
  private level: number
  private attributes: Attributes

  private constructor(
    skillProficiencies: Map<SkillType, ProficiencyRank>,
    level: number,
    attributes: Attributes
  ) {
    this.skillProficiencies = skillProficiencies
    this.level = level
    this.attributes = attributes
  }

  public getSkills(): Map<SkillType, CalculatedProficiency> {
    const result = new Map()
    this.skillProficiencies.forEach((rank, type) => {
      if (type) {
        result.set(type, {
          rank: rank,
          modifier:
            RankModifierMap[rank] +
            this.level +
            this.attributes[SkillAttributes.get(type) as Attribute],
        })
      }
    })
    return result
  }

  static SkillProficiencyManagerBuilder = class {
    private skillProficiencies: Map<SkillType, ProficiencyRank> =
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
        let existingRank = this.skillProficiencies.get(
          value.value.value as SkillType
        )
        this.skillProficiencies.set(
          value.value.value as SkillType,
          getGreaterThan(value.value.rank, existingRank ?? 'untrained')
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
        !skillSelection.value.configuration.formula &&
        (!skillSelection.value.value || skillSelection.value.value.length !== 1)
      ) {
        skillSelection.value.value = [null!]
      } else if (skillSelection.value.configuration.formula) {
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
        let existingRank = this.skillProficiencies.get(skill as SkillType)
        if (
          isGreaterThanOrEqualTo(
            existingRank!,
            skillSelection.value.configuration.max_rank
          ) === false
        ) {
          this.skillProficiencies.set(
            skill as SkillType,
            getNextRank(existingRank!)!
          )
        } else {
          skillSelection.value.value[index] = null!
        }
      })
    }
  }
}

export function getNextRank(rank: ProficiencyRank) {
  switch (rank) {
    case 'untrained':
      return 'trained'
    case 'trained':
      return 'expert'
  }
}

export function createManagerForCharacter(
  playerCharacter: PlayerCharacter,
  exclusion?: Feature
) {
  const builder = new SkillProficiencyManager.SkillProficiencyManagerBuilder(
    playerCharacter.getCharacter().level,
    playerCharacter.getAttributes(),
    playerCharacter
      .getLevelFeatures()
      .filter(
        (sourced) =>
          sourced.feature.type === 'PROFICIENCY' &&
          sourced.feature.value.type === 'Skill'
      )
      .map((sourced) => sourced.feature)
  )

  // order of operations here matters, basically this makes the subclass selection the 'default' base, which means that
  // it 'wins' during reconciliation
  playerCharacter
    .getLevelFeatures()
    .filter((sourced) => sourced.feature.value !== exclusion)
    .filter(
      (sourced) =>
        sourced.feature.type === 'SUBCLASS_FEATURE' &&
        sourced.feature.value!.type === 'SKILL_SELECTION'
    )
    .forEach((sourced) => {
      builder.validateAndApply(sourced.feature.value)
    })

  playerCharacter
    .getLevelFeatures()
    .filter((sourced) => sourced.feature.type === 'SKILL_SELECTION')
    .filter((sourced) => sourced.feature !== exclusion)
    .sort((a, b) => a.feature.level! - b.feature.level!)
    .forEach((sourced) => builder.validateAndApply(sourced.feature))

  const manager = builder.build()
  console.log(manager.getSkills())
  return manager
}
