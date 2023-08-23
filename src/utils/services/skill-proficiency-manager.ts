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

    public build(): SkillProficiencyManager {
      return new SkillProficiencyManager(
        this.skillProficiencies,
        this.level,
        this.attributes
      )
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

  playerCharacter
    .getLevelFeatures()
    .filter((sourced) => sourced.feature.type === 'SKILL_SELECTION')
    .filter((sourced) => sourced.feature !== exclusion)
    .sort((a, b) => a.feature.level! - b.feature.level!)
    .forEach((sourced) => builder.validateAndApply(sourced.feature))

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

  const manager = builder.build()
  console.log(manager.getSkills())
  return manager
}
